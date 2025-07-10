
// Simple guest authentication service
// This maintains compatibility with existing code while using the guest token

const authService = {
  // Since we're using a guest token, always return true for authentication
  isAuthenticated: () => true,
  
  // Guest logout (just a placeholder)
  logout: () => {
    // No actual logout needed for guest mode
    console.log('Guest logout - no action needed');
  },
  
  // Get guest user info
  getCurrentUser: () => ({
    id: '686b77eeaa95adeb9ffd9aee',
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com'
  })
};

export default authService;
