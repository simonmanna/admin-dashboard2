// components/MenuOptionList.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MenuOptionList({ initialMenuOptions }) {
  const [menuOptions, setMenuOptions] = useState(initialMenuOptions);
  const router = useRouter();

  // Function to delete a menu option
  const deleteMenuOption = async (id) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      try {
        const response = await fetch(`/api/menu-options/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete");
        }

        // Remove the deleted option from the state
        setMenuOptions(menuOptions.filter((option) => option.id !== id));
        // Refresh the page data
        router.refresh();
      } catch (error) {
        console.error("Error deleting menu option:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menuOptions.length > 0 ? (
            menuOptions.map((option) => (
              <tr key={option.id}>
                <td className="px-6 py-4 whitespace-nowrap">{option.name}</td>
                <td className="px-6 py-4">{option.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  UGX {option.price_adjustment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/menu-options/${option.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  {/* <button
                    onClick={() => deleteMenuOption(option.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No menu options found. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
