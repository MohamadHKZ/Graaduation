import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '../../api/profile';

const SkillsInput = ({ label, skills, setSkills }) => {
  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">{label}</label>
        <button type="button" onClick={addSkill} className="text-xs px-2 py-1 bg-gray-200">
          + Add
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto border p-2 space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="flex-1 p-2 border text-sm"
              placeholder={`${label.split(' ')[0]} skill`}
            />
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="px-3 py-2 bg-red-100 text-red-800 text-sm"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileUser = ({ user, token, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [technicalSkills, setTechnicalSkills] = useState(['']);
  const [jobPositionSkills, setJobPositionSkills] = useState(['']);
  const [fieldSkills, setFieldSkills] = useState(['']);
  const [softSkills, setSoftSkills] = useState(['']);
  const [profileId, setProfileId] = useState(null);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfileId = localStorage.getItem('profileId');
        if (storedProfileId && user?.jobSeekerId) {
          const profile = await getProfile(token, user.jobSeekerId, storedProfileId);
          
          setProfileId(profile.id);
          setTechnicalSkills(profile.technicalSkills || ['']);
          setJobPositionSkills(profile.jobPositionSkills || ['']);
          setFieldSkills(profile.fieldSkills || ['']);
          setSoftSkills(profile.softSkills || ['']);
        }
      } catch (err) {
        console.log('No existing profile found');
      }
    };

    if (user?.jobSeekerId && token) {
      loadProfile();
    }
  }, [token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.target);
    formData.append('technicalSkills', JSON.stringify(technicalSkills.filter(s => s.trim())));
    formData.append('jobPositionSkills', JSON.stringify(jobPositionSkills.filter(s => s.trim())));
    formData.append('fieldSkills', JSON.stringify(fieldSkills.filter(s => s.trim())));
    formData.append('softSkills', JSON.stringify(softSkills.filter(s => s.trim())));

    try {
      const result = await updateProfile(formData, token, user.jobSeekerId, profileId);

      if (!profileId && result.id) {
        setProfileId(result.id);
        localStorage.setItem('profileId', result.id);
      }
      
      setMessage({ text: 'Profile updated', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-600">Name: {user?.name || 'Not set'}</p>
        <p className="text-sm text-gray-600">Email: {user?.email}</p>
      </div>

      <h1 className="text-xl font-bold mb-4">Profile</h1>

      {message.text && (
        <div className={`mb-4 p-2 text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="seekedJobTitle"
          required
          className="w-full p-2 border"
          placeholder="Seeked Job Title"
        />

        <SkillsInput label="Technical Skills" skills={technicalSkills} setSkills={setTechnicalSkills} />
        <SkillsInput label="Job Position Skills" skills={jobPositionSkills} setSkills={setJobPositionSkills} />
        <SkillsInput label="Field Skills" skills={fieldSkills} setSkills={setFieldSkills} />
        <SkillsInput label="Soft Skills" skills={softSkills} setSkills={setSoftSkills} />

        <input
          type="text"
          name="experience"
          required
          className="w-full p-2 border"
          placeholder="Experience"
        />

        <label className="flex items-center text-sm">
          <input type="checkbox" name="notifications" className="mr-2" />
          Receive job notifications
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-black text-white"
        >
          {loading ? '...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProfileUser;