"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "../providers/SessionProvider";

// List of public routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"];

export default function AuthCheck({ children }) {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if this is a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    // If not loading anymore and we have the session status
    if (!loading) {
      // For protected routes without a session, redirect to login
      if (!session && !isPublicRoute) {
        router.push("/login");
      } else {
        // Otherwise, we've finished our auth check
        setAuthChecked(true);
      }
    }
  }, [session, loading, router, pathname]);

  // Show loading state for protected routes while checking session
  if ((!authChecked && !publicRoutes.includes(pathname)) || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // For public routes or authenticated users with confirmed auth check, render children
  return children;
}
