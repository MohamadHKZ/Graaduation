const API_URL = 'http://localhost:5000';

// Endpoint: GET api/{jobseeker_id}/jobs
export const getRecommendedJobs = async (token, jobSeekerId, profileId = null) => {
  let url = `${API_URL}/api/${jobSeekerId}/jobs`;
  if (profileId) {
    url += `?profileId=${profileId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch recommended jobs');
  }

  return response.json();
};