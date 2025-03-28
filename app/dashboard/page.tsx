"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { UserTable } from "@/components/dashboard/UserTable";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import type { User } from "@/lib/utils/types";
import { createClient } from "@/lib/utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    // Get current user email for self-deletion check
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserEmail(data.user.email || null);
      }
    };
    getCurrentUser();
  }, []);  

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
      toast.error(errorMessage);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {

    try {
      const response = await fetch("/api/users/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedUsers,
          status: "blocked",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to block users");
      }

      toast.success(`User${selectedUsers.length !== 1 ? 's' : ''} blocked successfully`);
      router.refresh();
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error: unknown) {
      console.error("Error blocking users:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to block users";
      toast.error(errorMessage);
      router.push("/login");
    }
  };

  const handleUnblock = async () => {

    try {
      const response = await fetch("/api/users/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedUsers,
          status: "active",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unblock users");
      }

      toast.success(`User${selectedUsers.length !== 1 ? 's' : ''} unblocked successfully`);
      router.refresh();
      await fetchUsers(); 
      setSelectedUsers([]);
    } catch (error: unknown) {
      console.error("Error unblocking users:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to unblock users";
      toast.error(errorMessage);
      router.push("/login");
    }
  };

  const handleDelete = async () => {
    // Check if user is deleting themselves
    const isDeletingSelf = currentUserEmail && users.some(user => 
      selectedUsers.includes(user.id) && user.email === currentUserEmail
    );

    try {
      const response = await fetch(
        `/api/users?ids=${selectedUsers.join(",")}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete users");
      }

      toast.success(`User${selectedUsers.length !== 1 ? 's' : ''} deleted successfully`);
      
      if (isDeletingSelf) {
        // If deleting self, clear local storage directly instead of using signOut API
        // This prevents the 403 error when trying to sign out a deleted user
        if (typeof window !== 'undefined') {
          // Clear Supabase session data from local storage
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.expires_at');
          localStorage.removeItem('supabase.auth.refresh_token');
        }
        router.push("/login");
        return; // Exit early to prevent further API calls
      }
      
      // Only refresh and fetch users if not deleting self
      router.refresh();
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error: unknown) {
      console.error("Error deleting users:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete users";
      toast.error(errorMessage);
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <div className="container mx-auto px-4 sm:px-12 lg:px-14 py-8 md:mt-12">
        <div className="flex flex-col justify-between gap-4 bg-indigo-50 px-3 py-4 rounded-md">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Users Dashboard
            </h1>
            <p className="mt-2 text-md text-gray-900">
              A list of all users in your account including their name, email, last seen time and
              status.
            </p>
          </div>
          <TableToolbar
            selectedUsers={selectedUsers}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            onDelete={handleDelete}
          />
        </div>

        <div className="mt-4">
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            onSelectUsers={setSelectedUsers}
          />
        </div>
      </div>

    </div>
    
  );
}
