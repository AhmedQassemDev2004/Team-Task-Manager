import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for task update validation
const taskUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  teamId: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = params;

    // Get task
    const task = await db.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        subtasks: true,
        attachments: true,
        team: true,
        assignedTo: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Check if user is a member of the team
    const teamMember = await db.teamMember.findFirst({
      where: {
        userId: session.user.id,
        teamId: task.teamId,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { message: "You are not authorized to view this task" },
        { status: 403 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = params;
    const data = await req.json();

    // Validate task data
    const validationResult = taskUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid task data",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Get task
    const task = await db.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Check if user is a member of the team
    const teamMember = await db.teamMember.findFirst({
      where: {
        userId: session.user.id,
        teamId: task.teamId,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { message: "You are not authorized to update this task" },
        { status: 403 }
      );
    }

    // Check if assignment has changed
    const assignmentChanged =
      data.assignedToId !== undefined &&
      data.assignedToId !== task.assignedToId;

    // Update task
    const updatedTask = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: data.title,
        content: data.content,
        status: data.status,
        priority: data.priority,
        teamId: data.teamId,
        assignedToId: data.assignedToId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        subtasks: true,
        attachments: true,
        team: true,
      },
    });

    // Create notification if task assignment has changed and there is a new assignee
    if (assignmentChanged && data.assignedToId) {
      console.log(`Assignment changed for task ${taskId}. New assignee: ${data.assignedToId}`);

      try {
        // Create notification for the newly assigned user
        const notification = await db.notification.create({
          data: {
            type: "task_assigned",
            message: `You have been assigned to task "${updatedTask.title}" in team "${updatedTask.team.name}"`,
            userId: data.assignedToId,
            taskId: taskId,
          },
        });

        console.log("Notification created successfully:", notification);
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = params;

    // Get task
    const task = await db.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Check if user is an admin of the team
    const teamMember = await db.teamMember.findFirst({
      where: {
        userId: session.user.id,
        teamId: task.teamId,
        role: "admin", // Only admins can delete tasks
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { message: "Only team admins can delete tasks" },
        { status: 403 }
      );
    }

    // Delete task (subtasks and attachments will be deleted automatically due to cascade)
    await db.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
