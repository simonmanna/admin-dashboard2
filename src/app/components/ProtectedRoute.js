"use client";
// components/ProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../app/session-provider"; // Adjust the path as needed

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after we've checked for a session
    // and confirmed there isn't one
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

  // While checking session status, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If we have a session, render the children
  return session ? <>{children}</> : null;
}
