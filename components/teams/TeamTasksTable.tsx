"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Dropdown menu imports removed
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  content?: string;
  status: string;
  priority: string;
  teamId: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    username: string;
    email: string;
  };
  subtasks: SubTask[];
  createdAt: string;
  dueDate?: string;
}

interface TeamTasksTableProps {
  tasks: Task[];
  teamId?: string;
  isTeamAdmin?: boolean; // Add prop to indicate if user is team admin
}

export default function TeamTasksTable({
  tasks,
  isTeamAdmin = false,
}: TeamTasksTableProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(tasks.map((task) => task.status));
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteDialog = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "done":
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <div className="relative w-full">
        <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] bg-gray-50">Task</TableHead>
                <TableHead className="bg-gray-50">Status</TableHead>
                <TableHead className="bg-gray-50">Priority</TableHead>
                <TableHead className="bg-gray-50">Assigned To</TableHead>
                <TableHead className="bg-gray-50">Due Date</TableHead>
                <TableHead className="w-[100px] bg-gray-50"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          No tasks found
                        </p>
                        <p className="text-sm text-gray-500">
                          Get started by creating a new task
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="group cursor-pointer hover:bg-gray-50/75 transition-colors duration-150"
                    onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-gray-50 group-hover:bg-white transition-colors">
                            {getStatusIcon(task.status)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div
                            className="font-medium text-gray-900 truncate max-w-[250px]"
                            title={task.title}
                          >
                            {task.title}
                          </div>
                          {task.content && (
                            <div
                              className="text-xs text-gray-500 truncate max-w-[250px]"
                              title={task.content}
                            >
                              {task.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset",
                          task.status === "todo" &&
                            "bg-gray-50 text-gray-700 ring-gray-500/10",
                          task.status === "in-progress" &&
                            "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
                          task.status === "done" ||
                            (task.status == "completed" &&
                              "bg-green-50 text-green-700 ring-green-600/20")
                        )}
                      >
                        {getStatusText(task.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset",
                          task.priority === "high" &&
                            "bg-red-50 text-red-700 ring-red-600/10",
                          task.priority === "medium" &&
                            "bg-yellow-50 text-yellow-700 ring-yellow-600/10",
                          task.priority === "low" &&
                            "bg-green-50 text-green-700 ring-green-600/10"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            task.priority === "high" && "bg-red-500",
                            task.priority === "medium" && "bg-yellow-500",
                            task.priority === "low" && "bg-green-500"
                          )}
                        />
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 flex items-center justify-center ring-2 ring-white">
                            <span className="text-indigo-700 font-medium text-xs">
                              {task.assignedTo.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {task.assignedTo.username}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "text-sm",
                          task.dueDate ? "text-gray-900" : "text-gray-500"
                        )}
                      >
                        {formatDate(task.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isTeamAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(task);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 transition-colors" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{taskToDelete?.title}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
