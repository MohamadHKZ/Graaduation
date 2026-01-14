const API_URL = 'http://localhost:5000';

// Endpoint: POST api/jobseeker/login
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/jobseeker/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Login failed');
  }
  
  return response.json();
};

// endpoint: POST api/jobseeker/register
export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/api/jobseeker/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Registration failed');
  }
  
  return response.json();
};