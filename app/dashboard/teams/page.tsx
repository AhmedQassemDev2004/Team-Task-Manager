"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Users } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchTeams();
    }
  }, [status]);

  if (status === "loading") {
    return <LoadingPage message="Verifying your session..." />;
  }

  if (loading) {
    return <LoadingPage message="Loading your teams..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200">
          <div className="p-6 md:p-8">
            {/* Modern Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-3">
                  Teams Overview
                  <Badge
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-600 px-2 py-0.5 text-xs"
                  >
                    {teams.length} Teams
                  </Badge>
                </h1>
                <p className="text-gray-500 text-sm">
                  Manage teams, track members and monitor team activities
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Teams
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {teams.length}
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/dashboard/teams/create")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Team
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {teams.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Create Your First Team
                </h3>
                <p className="text-gray-500 mb-6">
                  Start collaborating with your colleagues by creating a team
                  and inviting members.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/teams/create")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Team
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {team.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-0.5">
                            Created{" "}
                            {new Date(team.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {team.members.some(
                          (member) =>
                            member.userId === session?.user?.id &&
                            member.role === "admin"
                        ) && (
                          <Badge className="bg-indigo-50 text-indigo-600">
                            Admin
                          </Badge>
                        )}
                      </div>

                      {/* Team Stats */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                          <p className="text-sm text-gray-500">Members</p>
                          <p className="text-lg font-medium text-gray-900">
                            {team.members.length}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                          <p className="text-sm text-gray-500">Admins</p>
                          <p className="text-lg font-medium text-gray-900">
                            {
                              team.members.filter((m) => m.role === "admin")
                                .length
                            }
                          </p>
                        </div>
                      </div>

                      {/* Member Preview */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Team Members
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {team.members.slice(0, 3).map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center bg-gray-50 px-2.5 py-1.5 rounded-md text-sm border border-gray-100"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                              <span className="text-gray-700">
                                {member.user.username}
                              </span>
                              {member.role === "admin" && (
                                <Badge className="ml-2 h-4 bg-indigo-50 text-indigo-600 text-xs hover:bg-indigo-100">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          ))}
                          {team.members.length > 3 && (
                            <div className="flex items-center bg-gray-50 px-2.5 py-1.5 rounded-md text-sm border border-gray-100 text-gray-500">
                              +{team.members.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {team.members.some(
                        (member) =>
                          member.userId === session?.user?.id
                      ) && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(`/dashboard/teams/${team.id}`)
                            }
                            className="w-full justify-center border-gray-200 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 gap-2"
                          >
                            View Team
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
