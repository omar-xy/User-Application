export interface User {
    id: number;
    name: string;
    createdAt?: string;
  }
  
  export interface UsersResponse {
    users: User[];
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  export async function fetchUsers(page: number = 1): Promise<UsersResponse> {
    try {
      const response = await fetch(`${API_URL}/api/users?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If the API returns users directly without the "users" wrapper
      if (Array.isArray(data)) {
        return { users: data };
      }
      
      // If the API already returns in the expected format
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }