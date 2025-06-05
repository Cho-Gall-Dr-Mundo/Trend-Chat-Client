export function useUser() {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) return JSON.parse(userData);
  }
  return { userId: null, role: null };
}