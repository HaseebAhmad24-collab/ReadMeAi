"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }
      
      toast.success("Account deleted successfully.");
      
      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }), "bg-error hover:bg-error/90 shrink-0 font-bold px-6 cursor-pointer")}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-secondary-foreground">
            This will permanently delete your ReadMeAI account and all associated data, including your usage history and generated README records. You will need to re-authenticate with GitHub to use the service again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="rounded-xl border-border-strong font-bold" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="bg-error hover:bg-error/90 text-white rounded-xl font-bold"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
