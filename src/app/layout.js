// /app/layout.js
import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import AuthCheck from "./components/AuthCheck"; // We'll create this file next

import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Restaurant Admin",
  description: "Restaurant Order Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthCheck>{children}</AuthCheck>
        </SessionProvider>
      </body>
    </html>
  );
}
