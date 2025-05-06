import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

    console.log(
      `User ${session.user.id} teams with admin status:`,
      teamsWithCurrentUserFlag.map((team) => ({
        id: team.id,
        name: team.name,
        isAdmin: team.members.some(
          (m) => m.isCurrentUser && m.role === "admin"
        ),
      }))
    );

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

    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Team name is required" },
        { status: 400 }
      );
    }

    // Create team and add current user as admin
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
      { message: "Team created successfully", team },
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
