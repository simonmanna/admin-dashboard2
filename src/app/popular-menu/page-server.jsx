// app/popular-menu/page-server.jsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function PopularMenuPage({ searchParams }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("view_order");

  // Build query for popular items
  const query = supabase
    .from("menus")
    .select(
      `
      *,
      category:categories(id, name, description, imageUrl)
    `
    )
    .eq("is_popular", 1)
    .order("view_order");

  // Apply category filter if selected
  if (searchParams.category) {
    query.eq("category_id", searchParams.category);
  }

  const { data: popularItems, error } = await query;

  if (error) {
    console.error("Error fetching popular items:", error);
    return <div>Failed to load popular menu items</div>;
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Popular Items
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover our customers' favorites and bestsellers
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/popular-menu"
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${
                !searchParams.category
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            All Categories
          </Link>

          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/popular-menu?category=${category.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${
                  searchParams.category === String(category.id)
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Menu items display */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {popularItems?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="h-48 w-full relative">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {item.category?.name || "Uncategorized"}
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      {item.name}
                    </h2>
                  </div>
                  <span className="text-xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p className="mt-3 text-gray-500 text-sm line-clamp-3">
                  {item.description || "No description available"}
                </p>

                <button className="mt-5 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300">
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {popularItems?.length === 0 && (
          <div className="mt-16 text-center text-gray-500 py-12">
            <p className="text-xl">
              No popular items found
              {searchParams.category ? " in this category" : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
