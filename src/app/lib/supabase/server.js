"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");

// Define the type for the Supabase database schema (not applicable in JavaScript)
// export type Database = {
//   public: {
//     tables: {
//       order_feedback: {
//         Row: {
//           id: string;
//           order_id: string;
//           user_id: string;
//           rating: number;
//           comment: string | null;
//           status: "active" | "inactive" | "deleted";
//           is_anonymous: boolean;
//           created_at: string;
//           updated_at: string;
//           deleted_at: string | null;
//           delivery_rating: number | null;
//           food_quality_rating: number;
//           service_rating: number;
//         };
//         Insert: {
//           id?: string;
//           order_id: string;
//           user_id: string;
//           rating: number;
//           comment?: string | null;
//           status?: "active" | "inactive" | "deleted";
//           is_anonymous?: boolean;
//           created_at?: string;
//           updated_at?: string;
//           deleted_at?: string | null;
//           delivery_rating?: number | null;
//           food_quality_rating?: number;
//           service_rating?: number;
//         };
//         Update: {
//           id?: string;
//           order_id?: string;
//           user_id?: string;
//           rating?: number;
//           comment?: string | null;
//           status?: "active" | "inactive" | "deleted";
//           is_anonymous?: boolean;
//           created_at?: string;
//           updated_at?: string;
//           deleted_at?: string | null;
//           delivery_rating?: number | null;
//           food_quality_rating?: number;
//           service_rating?: number;
//         };
//       };
//     };
//   };
// };

const createClient = () => {
  const supabaseUrl = "https://mlpgrevfohpiaepnnsch.supabase.co";
  const supabaseServiceKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scGdyZXZmb2hwaWFlcG5uc2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4OTcwOTgsImV4cCI6MjA0MjQ3MzA5OH0.pp4aRjxONzTfmNddHEcAua16qEjUeHlOEU3zNwJloOg";

  return (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
};
exports.createClient = createClient;
