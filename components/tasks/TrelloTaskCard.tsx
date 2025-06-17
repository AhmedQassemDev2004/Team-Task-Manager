"use client";

import { useRouter } from "next/navigation";
import { Clock, Users, CheckSquare, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  content?: string;
  status: string;
  priority: string;
  assignedToId?: string;
  teamId: string;
  createdAt: string;
  dueDate?: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
  team?: {
    id: string;
    name: string;
  };
  assignedTo?: {
    username: string;
    email: string;
  };
}

interface TrelloTaskCardProps {
  task: Task;
}

export default function TrelloTaskCard({ task }: TrelloTaskCardProps) {
  const router = useRouter();

  const calculateProgress = () => {
    if (!task.subtasks?.length) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return (completed / task.subtasks.length) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "low":
        return "bg-teal-100 text-teal-700 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Calculate days until due
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const due = new Date(task.dueDate);
    const daysUntil = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );

    if (daysUntil < 0) return { text: "Overdue", color: "text-red-600" };
    if (daysUntil === 0) return { text: "Due today", color: "text-yellow-600" };
    if (daysUntil <= 2) return { text: "Due soon", color: "text-yellow-600" };
    return { text: `Due ${formatDate(task.dueDate)}`, color: "text-slate-500" };
  };

  const dueStatus = task.dueDate ? getDueStatus() : null;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-4 cursor-pointer hover:shadow-md transition-all hover:border-cyan-200/60"
      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-slate-800">{task.title}</h3>
        <Badge variant="outline" className={getPriorityColor(task.priority)}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </div>

      {/* Task metadata row */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        <span className="text-slate-500">
          Added {formatDate(task.createdAt)}
        </span>
        {task.assignedTo && (
          <span className="text-slate-500 flex items-center">
            • Assigned to {task.assignedTo.username}
          </span>
        )}
      </div>

      {task.content && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {task.content}
        </p>
      )}

      {/* Progress section */}
      <div className="space-y-2 mb-3">
        {task.subtasks.length > 0 && (
          <div>
            <div className="flex items-center text-xs text-slate-500 mb-1">
              <CheckSquare className="h-3 w-3 mr-1" />
              <span>
                {task.subtasks.filter((st) => st.completed).length}/
                {task.subtasks.length} subtasks
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-1 mb-2" />
            <div className="space-y-1">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center text-xs">
                  <div
                    className={`w-3 h-3 rounded-sm border mr-2 ${
                      subtask.completed
                        ? "bg-cyan-600 border-cyan-600"
                        : "border-slate-300"
                    }`}
                  />
                  <span
                    className={`${
                      subtask.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-600"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer section */}
      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-slate-500">
            <Users className="h-3 w-3 mr-1" />
            <span>{task.team?.name}</span>
          </div>
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center text-slate-500">
              <span>📎 {task.attachments.length}</span>
            </div>
          )}
        </div>
        {dueStatus && (
          <div className={`flex items-center ${dueStatus.color}`}>
            <Clock className="h-3 w-3 mr-1" />
            <span>{dueStatus.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
