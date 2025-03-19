// app/menu-options/page.js
import { createClient } from "@supabase/supabase-js";
import MenuOptionList from "../components/MenuOptionList";
import Link from "next/link";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = "force-dynamic";
export const revalidate = 0; // Add this line to disable cache

export default async function MenuOptionsPage() {
  const { data: menuOptions, error } = await supabase
    .from("menu_options")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching menu options:", error);
    return <div>Error loading menu options. Please try again later.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Choice Options</h1>
        <Link
          href="/menu-options/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Option
        </Link>
      </div>
      <MenuOptionList initialMenuOptions={menuOptions} />
    </div>
  );
}
