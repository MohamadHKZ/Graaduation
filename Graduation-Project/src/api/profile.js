const API_URL = 'http://localhost:5000';

// Endpoint: POST api/{jobseeker_id}/profile or PUT api/{jobseeker_id}/{profile_id}/profile
export const updateProfile = async (formData, token, jobSeekerId, profileId = null) => {
  const seekedJobTitle = formData.get('seekedJobTitle');
  const experience = formData.get('experience');
  const notifications = formData.get('notifications') === 'on';
  const technicalSkills = JSON.parse(formData.get('technicalSkills') || '[]');
  const jobPositionSkills = JSON.parse(formData.get('jobPositionSkills') || '[]');
  const fieldSkills = JSON.parse(formData.get('fieldSkills') || '[]');
  const softSkills = JSON.parse(formData.get('softSkills') || '[]');

  const profileData = {
    profileName: 'Default Profile',
    jobTitle: seekedJobTitle,
    technicalSkills: technicalSkills.filter(s => s.trim()),
    jobPositionSkills: jobPositionSkills.filter(s => s.trim()),
    fieldSkills: fieldSkills.filter(s => s.trim()),
    softSkills: softSkills.filter(s => s.trim()),
    yearsOfExperience: parseInt(experience) || 0,
    education: '',
    receiveNotifications: notifications,
    customRules: ''
  };

  const url = profileId 
    ? `${API_URL}/api/${jobSeekerId}/${profileId}/profile`
    : `${API_URL}/api/${jobSeekerId}/profile`;
  
  const method = profileId ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update profile');
  }
  
  return response.json();
};

 // Endpoint: POST api/{jobseeker_id}/{profile_id}/upload_cv
export const uploadCV = async (cvFile, token, jobSeekerId, profileId) => {
  const formData = new FormData();
  formData.append('cv', cvFile);

  const response = await fetch(`${API_URL}/api/${jobSeekerId}/${profileId}/upload_cv`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to upload CV');
  }
  
  return response.json();
};


 // Endpoint: GET api/{jobseeker_id}/{profile_id}/profile

export const getProfile = async (token, jobSeekerId, profileId) => {
  const response = await fetch(`${API_URL}/api/${jobSeekerId}/${profileId}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch profile');
  }
  
  return response.json();
};