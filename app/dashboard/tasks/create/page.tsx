"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import SubTaskInput from "@/components/tasks/SubTaskInput";
import AttachmentUpload from "@/components/tasks/AttachmentUpload";

interface Team {
  id: string;
  name: string;
  isAdmin: boolean; // Add isAdmin flag to track admin status
}

interface TeamMember {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const taskFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional(),
  status: z.string().default("todo"),
  priority: z.string().default("medium"),
  teamId: z.string().min(1, "Team is required"),
  assignedToId: z.string().optional(),
  dueDate: z.date().optional(),
});

// We'll use the inferred type from the form

// We're using a custom type definition instead of z.infer

export default function CreateTaskPage() {
  const { status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>([]);
  const [attachments, setAttachments] = useState<{ id: string; file: File }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const urlParams = useSearchParams();
  const initialTeamId = urlParams.get("team") || "";

  // Form setup
  const form = useForm({
    resolver: zodResolver(taskFormSchema) as any,
    defaultValues: {
      title: "",
      content: "",
      status: "todo",
      priority: "medium",
      teamId: initialTeamId || "",
      assignedToId: "",
    },
  });

  // Authentication redirect effect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

  }, [status, router]);

  // Admin teams fetch and redirect effect
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();

        // Process all teams and check for admin status
        const teamsWithAdminStatus = data.teams.map((team: any) => ({
          id: team.id,
          name: team.name,
          isAdmin: team.members.some(
            (member: any) =>
              member.role === "admin" &&
              (member.isCurrentUser || member.userId === member.user?.id)
          ),
        }));

        // Only show teams where the user is an admin
        const adminTeams = teamsWithAdminStatus.filter(
          (team: Team) => team.isAdmin
        );

        if (adminTeams.length === 0) {
          setError(
            "You must be a team admin to create tasks. Please contact your team admin."
          );
          // Add delay before redirect
          setTimeout(() => {
            router.push("/dashboard/tasks");
          }, 2000);
        }

        setTeams(adminTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError("Failed to load teams. Please try again later.");
      }
    };

    if (status === "authenticated") {
      fetchTeams();
    }
  }, [status, router]);

  // Team members fetch effect
  useEffect(() => {
    if(initialTeamId) {
      setSelectedTeam(initialTeamId);
      form.setValue("teamId", initialTeamId);
    }

    const fetchTeamMembers = async () => {
      if (!selectedTeam) return;

      try {
        const response = await fetch(`/api/teams/${selectedTeam}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }
        const data = await response.json();
        setTeamMembers(data.members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    if (selectedTeam) {
      fetchTeamMembers();
    }
  }, [selectedTeam, initialTeamId]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    setError("");

    try {
      console.log(
        "Starting task creation with attachments:",
        attachments.length
      );

      // Create FormData for file uploads
      const formData = new FormData();

      // Add task data
      const taskData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        subtasks: subtasks.map((st) => ({ title: st.title })),
      };

      console.log("Task data:", JSON.stringify(taskData));
      formData.append("taskData", JSON.stringify(taskData));

      // Add attachments
      if (attachments.length > 0) {
        console.log(`Adding ${attachments.length} attachments to form data`);
        attachments.forEach((attachment, index) => {
          console.log(
            `Adding attachment ${index}: ${attachment.file.name} (${attachment.file.size} bytes)`
          );
          formData.append(`attachment_${index}`, attachment.file);
        });
      }

      console.log("Sending request to /api/tasks");
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      router.push("/dashboard/tasks");
    } catch (error: any) {
      console.error("Error creating task:", error);
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <LoadingPage message="Verifying your session..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <div className="flex items-center px-8 pt-6 border-b border-slate-200 pb-5">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold text-slate-900">
                Create Task
              </h1>
            </div>

            {error && (
              <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-8 pt-6 space-y-8"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-900"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    className="w-full bg-slate-50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 transition-colors"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium text-slate-900"
                  >
                    Description
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Enter task description"
                    className="min-h-[120px] resize-vertical bg-slate-50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 transition-colors"
                    {...form.register("content")}
                  />
                  <p className="text-sm text-slate-500">
                    Provide a detailed description of the task
                  </p>
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium text-slate-900"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    {...form.register("priority")}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  {form.formState.errors.priority && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.priority.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-slate-900"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    {...form.register("status")}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  {form.formState.errors.status && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="teamId"
                    className="text-sm font-medium text-slate-900"
                  >
                    Team
                  </label>
                  <select
                    id="teamId"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    {...form.register("teamId")}
                    onChange={(e) => {
                      form.setValue("teamId", e.target.value);
                      setSelectedTeam(e.target.value);
                    }}
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id} selected={team.id===initialTeamId}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.teamId && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.teamId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="assignedToId"
                    className="text-sm font-medium text-slate-900"
                  >
                    Assigned To
                  </label>
                  <select
                    id="assignedToId"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                    {...form.register("assignedToId")}
                    disabled={!selectedTeam}
                  >
                    <option value="">
                      {selectedTeam ? "Unassigned" : "Select a team first"}
                    </option>
                    {teamMembers.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.user.username || member.user.email}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.assignedToId && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.assignedToId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Subtasks
                  </label>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <SubTaskInput
                      subtasks={subtasks}
                      setSubtasks={setSubtasks}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Attachments
                  </label>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <AttachmentUpload
                      attachments={attachments}
                      setAttachments={setAttachments}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
