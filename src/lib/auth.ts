import supabase from './supabase';

/**
 * Helper to set or clear the auth cookie used by Next.js middleware for route protection.
 */
function setAuthCookie(loggedIn: boolean) {
  if (typeof window === 'undefined') return;
  if (loggedIn) {
    document.cookie = 'nexdesk-auth=true; path=/; max-age=604800; SameSite=Lax; Secure';
  } else {
    document.cookie = 'nexdesk-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  }
}

/**
 * Signs in a user with email and password.
 */
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (!error && data?.session) {
    setAuthCookie(true);
  }
  return { data, error };
}

/**
 * Registers a new user with email and password.
 */
export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (!error && data?.session) {
    setAuthCookie(true);
  }
  return { data, error };
}

/**
 * Signs out the current user and clears active sessions.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  setAuthCookie(false);
  return { error };
}

/**
 * Retrieves the currently active user session/metadata.
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    setAuthCookie(false);
    return null;
  }
  setAuthCookie(true);
  return user;
}

/**
 * Synchronizes cookie state based on client-side Supabase state changes (e.g. on mount/refresh).
 */
export function syncAuthState() {
  if (typeof window === 'undefined') return;
  
  supabase.auth.getSession().then(({ data: { session } }) => {
    setAuthCookie(!!session);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    setAuthCookie(!!session);
  });
}
