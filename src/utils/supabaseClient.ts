import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-92855c06`;

// Get auth headers
function getAuthHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
  };
}

// ===== AUTH API =====

export async function signUp(email: string, password: string, name?: string) {
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// ===== DATA API =====

export async function syncProfile(profile: any) {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: getAuthHeaders(session.access_token),
      body: JSON.stringify(profile),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync profile');
    }
    
    return data;
  } catch (error) {
    console.error('Sync profile error:', error);
    throw error;
  }
}

export async function fetchProfile() {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: getAuthHeaders(session.access_token),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data.profile;
  } catch (error) {
    console.error('Fetch profile error:', error);
    throw error;
  }
}

export async function syncMessages(messages: any[]) {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(session.access_token),
      body: JSON.stringify({ messages }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync messages');
    }
    
    return data;
  } catch (error) {
    console.error('Sync messages error:', error);
    throw error;
  }
}

export async function fetchMessages() {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'GET',
      headers: getAuthHeaders(session.access_token),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch messages');
    }
    
    return data.messages;
  } catch (error) {
    console.error('Fetch messages error:', error);
    throw error;
  }
}

export async function submitFeedback(feedback: any) {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(session.access_token),
      body: JSON.stringify(feedback),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit feedback');
    }
    
    return data;
  } catch (error) {
    console.error('Submit feedback error:', error);
    throw error;
  }
}

export async function syncAllData(profile: any, messages: any[]) {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: getAuthHeaders(session.access_token),
      body: JSON.stringify({ profile, messages }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync data');
    }
    
    return data;
  } catch (error) {
    console.error('Sync all data error:', error);
    throw error;
  }
}

export async function fetchAllData() {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/sync`, {
      method: 'GET',
      headers: getAuthHeaders(session.access_token),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch data');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch all data error:', error);
    throw error;
  }
}

export async function deleteAllUserData() {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE}/user-data`, {
      method: 'DELETE',
      headers: getAuthHeaders(session.access_token),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete data');
    }
    
    return data;
  } catch (error) {
    console.error('Delete user data error:', error);
    throw error;
  }
}