// app/menu-options/page.js
import { createClient } from "@supabase/supabase-js";
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
import MenuOptionList from "../components/MenuOptionList";

export const dynamic = "force-dynamic";

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
      <h1 className="text-2xl font-bold mb-6">Choice Options</h1>
      <MenuOptionList initialMenuOptions={menuOptions} />
    </div>
  );
}
