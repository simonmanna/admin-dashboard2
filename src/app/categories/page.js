// app/categories/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MenuDetailModal from "../components/MenuDetailModal";
import EditModal from "../components/EditModal";
import AddNewItemModal from "../components/AddNewItemModal";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [allFlatCategories, setAllFlatCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryPath, setCategoryPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addingItemType, setAddingItemType] = useState(null);

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("view_order");

    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      // Save flat list for parent selection dropdown
      setAllFlatCategories(data);

      // Build the category tree
      const categoryTree = buildCategoryTree(data);
      setCategories(categoryTree);
    }

    setLoading(false);
  }

  // Build a hierarchical tree from flat category data
  function buildCategoryTree(flatCategories) {
    const categoryMap = new Map();

    // Create a map of all categories with their IDs as keys
    flatCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories = [];

    // Organize categories into a hierarchical structure
    flatCategories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id);

      if (categoryWithChildren) {
        if (category.parent_id === null) {
          // This is a root category
          rootCategories.push(categoryWithChildren);
        } else {
          // This is a child category
          const parentCategory = categoryMap.get(category.parent_id);
          if (parentCategory) {
            if (!parentCategory.children) {
              parentCategory.children = [];
            }
            parentCategory.children.push(categoryWithChildren);
          }
        }
      }
    });

    // Sort categories by view_order
    rootCategories.sort((a, b) => {
      return (a.view_order || 0) - (b.view_order || 0);
    });

    return rootCategories;
  }

  // Handle category selection
  async function handleCategoryClick(category) {
    setLoading(true);
    setCurrentCategory(category);

    // Update the category path
    if (category.parent_id === null) {
      setCategoryPath([category]);
    } else {
      const newPath = [...categoryPath];

      // Find if the category is already in the path
      const existingIndex = newPath.findIndex(
        (item) => item.id === category.id
      );
      if (existingIndex !== -1) {
        // If it's in the path, truncate the path up to this category
        setCategoryPath(newPath.slice(0, existingIndex + 1));
      } else {
        // If it's not in the path, add it
        setCategoryPath([...newPath, category]);
      }
    }

    // If the category has no children, fetch its menu items
    if (!category.children || category.children.length === 0) {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .eq("category_id", category.id)
        .order("view_order");

      if (error) {
        console.error("Error fetching menu items:", error);
      } else {
        setMenuItems(data || []);
      }
    } else {
      // If the category has children, clear the menu items
      setMenuItems([]);
    }

    setLoading(false);
  }

  // Handle back navigation
  function handleBackClick() {
    if (categoryPath.length > 1) {
      // Navigate to the parent category
      const parentCategory = categoryPath[categoryPath.length - 2];
      handleCategoryClick(parentCategory);
    } else {
      // Navigate to the root
      setCurrentCategory(null);
      setCategoryPath([]);
      setMenuItems([]);
    }
  }

  // Handle menu item click to show detail modal
  function handleMenuItemClick(item) {
    setSelectedItem(item);
  }

  // Close the modal
  function handleCloseModal() {
    setSelectedItem(null);
  }

  // Handle edit button click for category or menu item
  function handleEditClick(item, type, event) {
    event.stopPropagation(); // Prevent triggering the parent onClick

    setItemToEdit({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      price: type === "menuItem" ? item.price : undefined,
      category_id: type === "menuItem" ? item.category_id : undefined,
      parent_id: type === "category" ? item.parent_id : undefined,
      type: type,
    });

    setIsEditing(true);
  }

  // Close the edit modal
  function handleCloseEditModal() {
    setItemToEdit(null);
    setIsEditing(false);
  }

  // Save edited item
  async function handleSaveEdit(editedItem) {
    setLoading(true);

    const {
      id,
      name,
      description,
      imageUrl,
      price,
      type,
      category_id,
      parent_id,
    } = editedItem;
    const tableName = type === "category" ? "categories" : "menus";

    // Create update object based on item type
    const updateData = {
      name,
      description,
      imageUrl,
      updated_at: new Date().toISOString(),
    };

    // Add price only for menu items
    if (type === "menuItem" && price !== undefined) {
      updateData.price = price;
      updateData.category_id = category_id;
    }

    // Add parent_id for categories
    if (type === "category" && parent_id !== undefined) {
      updateData.parent_id = parent_id;
    }

    // Update the item in the database
    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error(`Error updating ${type}:`, error);
      alert(`Failed to update ${type}: ${error.message}`);
    } else {
      // Handle successful update
      if (type === "category") {
        // Complete refresh is needed as category hierarchy might have changed
        fetchCategories();

        // If category parent has changed, we need to return to a safe navigation point
        if (currentCategory && currentCategory.id === id) {
          // If we changed the currently selected category, go to the root level
          setCurrentCategory(null);
          setCategoryPath([]);
          setMenuItems([]);
        }
      } else {
        // For menu items, if category changed, refresh menu items
        if (currentCategory && category_id !== currentCategory.id) {
          // Remove the item from the current view if its category changed
          setMenuItems(menuItems.filter((item) => item.id !== id));
        } else {
          // Just update the local state
          const updatedMenuItems = menuItems.map((item) =>
            item.id === id
              ? { ...item, name, description, imageUrl, price, category_id }
              : item
          );
          setMenuItems(updatedMenuItems);

          // If this is the selected item, update it
          if (selectedItem && selectedItem.id === id) {
            setSelectedItem({
              ...selectedItem,
              name,
              description,
              imageUrl,
              price,
              category_id,
            });
          }
        }
      }
    }

    setIsEditing(false);
    setItemToEdit(null);
    setLoading(false);
  }

  // Open add new item modal
  function handleAddNewClick(type) {
    setAddingItemType(type);
    setIsAddingNew(true);
  }

  // Close add new item modal
  function handleCloseAddNewModal() {
    setIsAddingNew(false);
    setAddingItemType(null);
  }

  // Save new item (category or menu item)
  async function handleSaveNewItem(newItem) {
    setLoading(true);

    try {
      const type = addingItemType;
      const tableName = type === "category" ? "categories" : "menus";

      // Add created_at timestamp
      newItem.created_at = new Date().toISOString();
      newItem.updated_at = new Date().toISOString();

      // Insert the new item
      const { data, error } = await supabase
        .from(tableName)
        .insert(newItem)
        .select();

      if (error) {
        console.error(`Error creating new ${type}:`, error);
        alert(`Failed to create new ${type}: ${error.message}`);
      } else {
        // Handle successful creation
        if (type === "category") {
          // Refresh all categories
          fetchCategories();
        } else if (type === "menuItem" && currentCategory) {
          // If we're adding a menu item to current category, refresh only that
          const { data: newMenuItems, error: menuError } = await supabase
            .from("menus")
            .select("*")
            .eq("category_id", currentCategory.id)
            .order("view_order");

          if (!menuError) {
            setMenuItems(newMenuItems || []);
          }
        }

        // Close the modal
        handleCloseAddNewModal();

        // Show success message
        alert(
          `New ${
            type === "category" ? "category" : "menu item"
          } created successfully!`
        );
      }
    } catch (error) {
      console.error("Error saving new item:", error);
      alert(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Handle image upload
  async function handleImageUpload(file) {
    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `food_categories/${fileName}`;

      // Convert File to Binary Data
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("food_categories") // Use the same bucket as your mobile app
        .upload(filePath, fileData, {
          contentType: `image/${fileExt}`,
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return null;
      }

      // Get the public URL - using same approach as mobile app
      const { data: urlData } = supabase.storage
        .from("food_categories")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Detailed upload error:", error);
      return null;
    }
  }

  // Determine what type of item can be added based on current view
  function getAddButtonContext() {
    if (!currentCategory) {
      // At root level, can only add categories
      return { type: "category", label: "Add Category" };
    } else if (
      currentCategory.children &&
      currentCategory.children.length > 0
    ) {
      // In a category with subcategories, can add more subcategories
      return { type: "category", label: "Add Subcategory" };
    } else {
      // In a leaf category, can add menu items or create a subcategory
      return [
        { type: "menuItem", label: "Add Menu Item" },
        { type: "category", label: "Add Subcategory" },
      ];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Menu Management
            </h1>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Breadcrumb navigation */}
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <button
              onClick={() => {
                setCurrentCategory(null);
                setCategoryPath([]);
                setMenuItems([]);
              }}
              className="hover:text-blue-600"
            >
              Home
            </button>

            {categoryPath.map((category, index) => (
              <div key={category.id} className="flex items-center">
                <span className="mx-2">/</span>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`hover:text-blue-600 ${
                    index === categoryPath.length - 1 ? "font-medium" : ""
                  }`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        </header>

        <main>
          {/* Navigation and action buttons */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            {currentCategory && (
              <button
                onClick={handleBackClick}
                className="mb-2 sm:mb-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
              >
                <span className="mr-1">←</span> Back
              </button>
            )}

            {/* Add new buttons */}
            <div className="flex space-x-2">
              {!Array.isArray(getAddButtonContext()) ? (
                // Single button case
                <button
                  onClick={() => handleAddNewClick(getAddButtonContext().type)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {getAddButtonContext().label}
                </button>
              ) : (
                // Multiple buttons case
                getAddButtonContext().map((btn, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddNewClick(btn.type)}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      btn.type === "menuItem"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {btn.label}
                  </button>
                ))
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div>
              {!currentCategory ? (
                /* Root level categories */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name || ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        <button
                          onClick={(e) =>
                            handleEditClick(category, "category", e)
                          }
                          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="mt-1 text-gray-600 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      <p className="text-xl">No categories yet</p>
                      <p className="mb-4">
                        Create your first category to get started
                      </p>
                      <button
                        onClick={() => handleAddNewClick("category")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Category
                      </button>
                    </div>
                  )}
                </div>
              ) : currentCategory.children &&
                currentCategory.children.length > 0 ? (
                /* Subcategories view */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategory.children.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      onClick={() => handleCategoryClick(subcategory)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        {subcategory.imageUrl ? (
                          <img
                            src={subcategory.imageUrl}
                            alt={subcategory.name || ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        <button
                          onClick={(e) =>
                            handleEditClick(subcategory, "category", e)
                          }
                          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {subcategory.name}
                        </h3>
                        {subcategory.description && (
                          <p className="mt-1 text-gray-600 line-clamp-2">
                            {subcategory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Menu items view */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMenuItemClick(item)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name || ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        <button
                          onClick={(e) => handleEditClick(item, "menuItem", e)}
                          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        {item.is_popular ? (
                          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs">
                            Popular
                          </div>
                        ) : null}{" "}
                        {/* {!item.is_active && (
                          <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                            Inactive
                          </div>
                        )} */}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <span className="font-medium text-green-600">
                            UGX {Number(item.price).toLocaleString()}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {menuItems.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-xl">No menu items yet</p>
                      <p className="mb-4">Add menu items to this category</p>
                      <button
                        onClick={() => handleAddNewClick("menuItem")}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Menu Item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Menu detail modal */}
      {selectedItem && (
        <MenuDetailModal
          item={selectedItem}
          onClose={handleCloseModal}
          onEdit={() =>
            handleEditClick(selectedItem, "menuItem", {
              stopPropagation: () => {},
            })
          }
        />
      )}

      {/* Edit modal */}
      {isEditing && itemToEdit && (
        <EditModal
          item={itemToEdit}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          onImageUpload={handleImageUpload}
          allCategories={allFlatCategories}
        />
      )}

      {/* Add new item modal */}
      {isAddingNew && (
        <AddNewItemModal
          type={addingItemType}
          onClose={handleCloseAddNewModal}
          onSave={handleSaveNewItem}
          onImageUpload={handleImageUpload}
          currentCategoryId={currentCategory ? currentCategory.id : null}
          allCategories={allFlatCategories}
        />
      )}
    </div>
  );
}
