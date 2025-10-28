// Prefer using an environment variable for the API URL so migration targets
// (Next.js API routes, Hapi backend, or Supabase) can be injected at runtime.
// During migration set REACT_APP_API_URL (or replace in Next.js) accordingly.
// Support both CRA and Next.js environment variables during migration.
export const API_URL =
	(typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
	process.env.REACT_APP_API_URL ||
	'';

