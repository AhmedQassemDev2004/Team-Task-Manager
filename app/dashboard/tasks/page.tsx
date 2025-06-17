"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingPage from "@/components/LoadingPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamTasksSection, {
  TeamTasksSectionSkeleton,
} from "@/components/dashboard/TeamTasksSection";
import TrelloTaskCard from "@/components/tasks/TrelloTaskCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  team?: {
    id: string;
    name: string;
  };
}

interface Team {
  id: string;
  name: string;
  isAdmin: boolean;
}

type SortOption = "newest" | "oldest" | "priority" | "due-date";
type PriorityOption = "all" | "high" | "medium" | "low";

export default function TasksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await fetch("/api/tasks");
        if (!tasksResponse.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasksData = await tasksResponse.json();

        // Fetch teams to get admin status, get user's teams
        const teamsResponse = await fetch("/api/teams");
        if (!teamsResponse.ok) {
          throw new Error("Failed to fetch teams");
        }
        const teamsData = await teamsResponse.json();

        // Create a map of teamId -> isAdmin status
        const teamAdminMap = new Map<
          string,
          { name: string; isAdmin: boolean }
        >();
        teamsData.teams.forEach(
          (team: {
            id: string;
            name: string;
            members: Array<{ role: string; isCurrentUser: boolean }>;
          }) => {
            teamAdminMap.set(team.id, {
              name: team.name,
              isAdmin: team.members.some(
                (member: { role: string; isCurrentUser: boolean }) =>
                  member.role === "admin" && member.isCurrentUser
              ),
            });
          }
        );

        // Create teams array with admin status
        const teamsWithAdminStatus = Array.from(teamAdminMap.entries()).map(
          ([id, { name, isAdmin }]) => ({
            id,
            name,
            isAdmin,
          })
        );

        setTasks(tasksData.tasks);
        setTeams(teamsWithAdminStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading") {
    return <LoadingPage message="Verifying your session..." />;
  }

  if (loading) {
    return <LoadingPage message="Loading your tasks..." />;
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      // Search filter - look in title, content, and subtasks
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchLower) ||
        task.content?.toLowerCase().includes(searchLower) ||
        task.subtasks?.some((subtask) =>
          subtask.title.toLowerCase().includes(searchLower)
        );

      // Priority filter
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      // Team filter - match against teamId
      const matchesTeam = teamFilter === "all" || task.teamId === teamFilter;

      return matchesSearch && matchesPriority && matchesTeam;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          );
        }
        case "due-date":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

  // Group filtered and sorted tasks by status
  const tasksByStatus = {
    todo: filteredAndSortedTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredAndSortedTasks.filter(
      (task) => task.status === "in-progress"
    ),
    completed: filteredAndSortedTasks.filter(
      (task) => task.status === "completed"
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100/80">
          <div className="p-6 pb-4 border-b border-zinc-100">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-grow">
                <div className="relative">
                  <Search className="outline-0 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 h-9 bg-zinc-50/70 border-zinc-200 hover:border-zinc-300 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[130px] h-9 border-zinc-200 hover:border-zinc-300 bg-zinc-50/70">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-[130px] h-9 border-zinc-200 hover:border-zinc-300 bg-zinc-50/70">
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px] h-9 border-zinc-200 hover:border-zinc-300 bg-zinc-50/70">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="due-date">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-2 h-5 text-xs font-normal"
                >
                  Search: {searchQuery}
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-2 h-5 text-xs font-normal"
                >
                  Priority: {priorityFilter}
                </Badge>
              )}
              {teamFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-2 h-5 text-xs font-normal"
                >
                  Team: {teams.find((t) => t.id === teamFilter)?.name}
                </Badge>
              )}
              {(searchQuery ||
                priorityFilter !== "all" ||
                teamFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 text-xs font-normal text-zinc-500 hover:text-zinc-600 hover:bg-zinc-100 px-2"
                  onClick={() => {
                    setSearchQuery("");
                    setPriorityFilter("all");
                    setTeamFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Task Columns */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="min-w-0">
              <div className="bg-zinc-50/70 rounded-lg border border-zinc-100 p-4 h-full">
                <h2 className="font-medium text-zinc-800 mb-3 flex items-center text-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                  To Do
                  <span className="ml-2 text-xs text-zinc-400">
                    ({tasksByStatus["todo"]?.length || 0})
                  </span>
                </h2>
                <div className="space-y-2">
                  {tasksByStatus["todo"]?.map((task) => (
                    <TrelloTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>

            {/* In Progress Column */}
            <div className="min-w-0">
              <div className="bg-zinc-50/70 rounded-lg border border-zinc-100 p-4 h-full">
                <h2 className="font-medium text-zinc-800 mb-3 flex items-center text-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                  In Progress
                  <span className="ml-2 text-xs text-zinc-400">
                    ({tasksByStatus["in-progress"]?.length || 0})
                  </span>
                </h2>
                <div className="space-y-2">
                  {tasksByStatus["in-progress"]?.map((task) => (
                    <TrelloTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>

            {/* Completed Column */}
            <div className="min-w-0">
              <div className="bg-zinc-50/70 rounded-lg border border-zinc-100 p-4 h-full">
                <h2 className="font-medium text-zinc-800 mb-3 flex items-center text-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                  Completed
                  <span className="ml-2 text-xs text-zinc-400">
                    ({tasksByStatus["completed"]?.length || 0})
                  </span>
                </h2>
                <div className="space-y-2">
                  {tasksByStatus["completed"]?.map((task) => (
                    <TrelloTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
