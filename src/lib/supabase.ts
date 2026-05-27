import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;

/**
 * Converts a snake_case object (from PostgreSQL) into camelCase (for TypeScript interfaces)
 */
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const n: any = {};
    Object.keys(obj).forEach((k) => {
      // Map center_id to center to match frontend models perfectly
      let camelKey = k;
      if (k === 'center_id') {
        camelKey = 'center';
      } else if (k === 'client_name' && obj.client_name === undefined) {
        // Fallback for special keys
      } else {
        camelKey = k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      }
      n[camelKey] = toCamelCase(obj[k]);
    });
    return n;
  }
  return obj;
}

/**
 * Converts a camelCase object (from TypeScript interfaces) into snake_case (for PostgreSQL columns)
 */
export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const n: any = {};
    Object.keys(obj).forEach((k) => {
      // Map center to center_id to match database FK perfectly
      let snakeKey = k;
      if (k === 'center') {
        snakeKey = 'center_id';
      } else {
        snakeKey = k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      }
      
      // Avoid mapping React-specific properties or functions if passed
      if (typeof obj[k] !== 'function') {
        n[snakeKey] = toSnakeCase(obj[k]);
      }
    });
    return n;
  }
  return obj;
}
