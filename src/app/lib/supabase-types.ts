// lib/supabase-types.js
// This file is for documentation purposes only, as JavaScript does not support static types.

/**
 * Represents a JSON value, which can be:
 * - A string
 * - A number
 * - A boolean
 * - null
 * - An object with string keys and JSON values
 * - An array of JSON values
 */
// export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Represents the structure of the Supabase database.
 */
// export interface Database {
export const Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: "number",
          created_at: "string",
          name: "string",
        },
        Insert: {
          id: "number?",
          created_at: "string?",
          name: "string",
        },
        Update: {
          id: "number?",
          created_at: "string?",
          name: "string?",
        },
        Relationships: [],
      },
      menus: {
        Row: {
          id: "number",
          created_at: "string",
          name: "string",
          description: "string | null",
          imageUrl: "string | null",
          price: "number | null",
          category_id: "number | null",
          is_popular: "number | null",
          view_order: "number | null",
        },
        Insert: {
          id: "number?",
          created_at: "string?",
          name: "string",
          description: "string | null",
          imageUrl: "string | null",
          price: "number | null",
          category_id: "number | null",
          is_popular: "number | null",
          view_order: "number | null",
        },
        Update: {
          id: "number?",
          created_at: "string?",
          name: "string?",
          description: "string | null",
          imageUrl: "string | null",
          price: "number | null",
          category_id: "number | null",
          is_popular: "number | null",
          view_order: "number | null",
        },
        Relationships: [
          {
            foreignKeyName: "menus_category_id_fkey",
            columns: ["category_id"],
            referencedRelation: "categories",
            referencedColumns: ["id"],
          },
        ],
      },
    },
    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {},
  },
};