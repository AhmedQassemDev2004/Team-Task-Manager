import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for team creation validation
const TeamCreateSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's teams
    const teams = await db.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Add isCurrentUser flag to each team member
    const teamsWithCurrentUserFlag = teams.map((team) => {
      const membersWithFlag = team.members.map((member) => ({
        ...member,
        isCurrentUser: member.userId === session.user.id,
      }));

      return {
        ...team,
        members: membersWithFlag,
      };
    });

    return NextResponse.json({ teams: teamsWithCurrentUserFlag });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate team data
    const validationResult = TeamCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid team data",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { name } = body;

    // Create team with the user as admin
    const team = await db.team.create({
      data: {
        name,
        members: {
          create: {
            userId: session.user.id,
            role: "admin",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        team,
        message: "Team created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
