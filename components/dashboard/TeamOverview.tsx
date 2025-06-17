"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
}

interface TeamOverviewProps {
  teams: Team[];
}

export default function TeamOverview({ teams }: TeamOverviewProps) {
  const router = useRouter();

  // Get up to 3 teams to display
  const displayTeams = teams.slice(0, 3);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getTeamMemberCount = (team: Team) => {
    return team.members.length;
  };

  const getRandomColor = (teamId: string) => {
    // Generate a consistent color based on team ID
    const colors = [
      "bg-indigo-500",
      "bg-indigo-600",
      "bg-indigo-500",
      "bg-indigo-600",
      "bg-indigo-700",
      "bg-indigo-700",
      "bg-indigo-800",
      "bg-indigo-800",
    ];

    // Use the sum of character codes as a simple hash
    const hash = teamId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Card className="border border-indigo-100 shadow-sm">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-indigo-700 bg-clip-text text-transparent">
          Your Teams
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            onClick={() => router.push("/dashboard/teams/create")}
          >
            <Plus className="mr-1 h-4 w-4" />
            New Team
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-700"
            onClick={() => router.push("/dashboard/teams")}
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayTeams.length === 0 ? (
          <div className="text-center py-6 text-indigo-600">
            You are not part of any team yet. Create or join a team to
            collaborate.
          </div>
        ) : (
          <div className="space-y-3">
            {displayTeams.map((team) => (
              <div
                key={team.id}
                className="p-3 bg-indigo-50/50 rounded-md border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-colors"
                onClick={() => router.push(`/dashboard/teams/${team.id}`)}
              >
                <div className="flex items-center">
                  <Avatar
                    className={`h-10 w-10 mr-3 ${getRandomColor(team.id)}`}
                  >
                    <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {getTeamMemberCount(team)} members
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/teams/${team.id}/tasks`);
                    }}
                  >
                    View Tasks
                  </Button>
                </div>
              </div>
            ))}

            {teams.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="link"
                  className="text-indigo-600 hover:text-indigo-700"
                  onClick={() => router.push("/dashboard/teams")}
                >
                  View {teams.length - 3} more teams
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
