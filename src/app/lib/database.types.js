// lib/database.types.js

/**
 * Represents a JSON-compatible value.
 * @typedef {string | number | boolean | null | { [key: string]: Json | undefined } | Json[]} Json
 */

/**
 * Represents the database schema.
 * @typedef {Object} Database
 * @property {Object} public
 * @property {Object} public.Tables
 * @property {Object} public.Tables.menu_options
 * @property {Object} public.Tables.menu_options.Row
 * @property {string} public.Tables.menu_options.Row.id
 * @property {string} public.Tables.menu_options.Row.name
 * @property {string | null} public.Tables.menu_options.Row.description
 * @property {number | null} public.Tables.menu_options.Row.price_adjustment
 * @property {boolean | null} public.Tables.menu_options.Row.is_active
 * @property {string | null} public.Tables.menu_options.Row.created_at
 * @property {Object} public.Tables.menu_options.Insert
 * @property {string} [public.Tables.menu_options.Insert.id]
 * @property {string} public.Tables.menu_options.Insert.name
 * @property {string | null} [public.Tables.menu_options.Insert.description]
 * @property {number | null} [public.Tables.menu_options.Insert.price_adjustment]
 * @property {boolean | null} [public.Tables.menu_options.Insert.is_active]
 * @property {string | null} [public.Tables.menu_options.Insert.created_at]
 * @property {Object} public.Tables.menu_options.Update
 * @property {string} [public.Tables.menu_options.Update.id]
 * @property {string} [public.Tables.menu_options.Update.name]
 * @property {string | null} [public.Tables.menu_options.Update.description]
 * @property {number | null} [public.Tables.menu_options.Update.price_adjustment]
 * @property {boolean | null} [public.Tables.menu_options.Update.is_active]
 * @property {string | null} [public.Tables.menu_options.Update.created_at]
 */