"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Shield, User } from "lucide-react";
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

interface TeamMembersTableProps {
  members: TeamMember[];
  teamId: string;
  currentUserRole: string;
  currentUserId: string;
}

export default function TeamMembersTable({
  members,
  teamId,
  currentUserRole,
  currentUserId,
}: TeamMembersTableProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      // Refresh the server-side data
      router.refresh();

      // Optimistically update the UI by removing the deleted member
      const updatedMembers = members.filter(
        (member) => member.id !== memberToDelete.id
      );

      members.splice(0, members.length, ...updatedMembers);
    } catch (error) {
      console.error("Error deleting team member:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const openDeleteDialog = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const isAdmin = currentUserRole === "admin";
  const canDeleteMember = (member: TeamMember) => {
    // Admins can delete members but not themselves
    if (isAdmin && member.user.id !== currentUserId) {
      return true;
    }
    // Members can't delete anyone
    return false;
  };

  return (
    <>
      <div className="relative w-full">
        <div className="flex-1 space-y-4">
          <div className="rounded-lg border border-gray-100 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] bg-gray-50">Member</TableHead>
                  <TableHead className="bg-gray-50">Email</TableHead>
                  <TableHead className="bg-gray-50">Role</TableHead>
                  <TableHead className="w-[80px] bg-gray-50"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="group hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 flex items-center justify-center ring-2 ring-white">
                            <span className="text-indigo-700 font-medium text-sm">
                              {member.user.username
                                ? member.user.username.charAt(0).toUpperCase()
                                : "?"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {member.user.username || "No username"}
                            {member.user.id == currentUserId && (
                              <span className="font-bold "> (You) </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {member.user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.role === "admin" ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          <Shield className="h-3.5 w-3.5" />
                          Admin
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          <User className="h-3.5 w-3.5" />
                          Member
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {canDeleteMember(member) && (
                        <button
                          onClick={() => openDeleteDialog(member)}
                          className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {memberToDelete?.user.username || memberToDelete?.user.email}
              </span>{" "}
              from this team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
