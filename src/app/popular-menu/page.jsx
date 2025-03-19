// app/popular-menu/page.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PopularMenuPage() {
  const [popularItems, setPopularItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function fetchPopularItems() {
      setLoading(true);

      // Fetch categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("view_order");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        return;
      }

      setCategories(categoriesData || []);

      // Fetch popular menu items with category information
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
      if (selectedCategory) {
        query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching popular items:", error);
        return;
      }

      setPopularItems(data || []);
      setLoading(false);
    }

    fetchPopularItems();
  }, [selectedCategory]);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Popular Items
          </h1>
          {/* <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover our customers' favorites and bestsellers
          </p> */}
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${
                !selectedCategory
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${
                  selectedCategory === category.id
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu items display */}
        {loading ? (
          <div className="flex justify-center mt-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {popularItems.map((item) => (
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
                      UGX {item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-500 text-sm line-clamp-3">
                    {item.description || "No description available"}
                  </p>

                  {/* <button className="mt-5 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300">
                    Add to Order
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && popularItems.length === 0 && (
          <div className="mt-16 text-center text-gray-500 py-12">
            <p className="text-xl">
              No popular items found
              {selectedCategory ? " in this category" : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
