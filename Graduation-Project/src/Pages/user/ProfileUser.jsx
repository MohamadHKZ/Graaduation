import { useState, useEffect } from 'react';
import { updateProfile, getProfile,getProfileIdForUser } from '../../api/profile';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Checkbox from '../../components/Checkbox';
import SkillsInput from '../../components/SkillsInput';
import UserInfo from '../../components/UserInfo';

const ProfileUser = ({ user, token }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
 
  const [jobTitle, setJobTitle] = useState('');
  const [technicalSkills, setTechnicalSkills] = useState(['']);
  const [jobPositionSkills, setJobPositionSkills] = useState(['']);
  const [fieldSkills, setFieldSkills] = useState(['']);
  const [softSkills, setSoftSkills] = useState(['']);
  const [profileId, setProfileId] = useState(null);
  const [experience, setExperience] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if(!localStorage.getItem('profileId')){
          const profileIdForCurrentUser = await getProfileIdForUser(token, user.jobSeekerId);
          if(profileIdForCurrentUser){
            localStorage.setItem('profileId', profileIdForCurrentUser);
          }
        }
        const storedProfileId = localStorage.getItem('profileId');        
        if (storedProfileId && user?.jobSeekerId) {
          const profile = await getProfile(token, storedProfileId);
          setJobTitle(profile.seekedJobTitle || '');
          setProfileId(profile.profileId);
          setTechnicalSkills(profile.technicalSkills || ['']);
          setJobPositionSkills(profile.jobPositionSkills || ['']);
          setFieldSkills(profile.fieldSkills || ['']);
          setSoftSkills(profile.softSkills || ['']);
          setExperience(profile.experience || '');
          setReceiveNotifications(profile.receiveNotifications || false);
        }
      // eslint-disable-next-line no-unused-vars
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
    formData.append('seekedJobTitle', jobTitle);
    formData.append('technicalSkills', JSON.stringify(technicalSkills.filter(s => s.trim())));
    formData.append('jobPositionSkills', JSON.stringify(jobPositionSkills.filter(s => s.trim())));
    formData.append('fieldSkills', JSON.stringify(fieldSkills.filter(s => s.trim())));
    formData.append('softSkills', JSON.stringify(softSkills.filter(s => s.trim())));
    formData.append('experience', experience);
    formData.append('receiveNotifications', receiveNotifications);

    try {
      const result = await updateProfile(formData, token, user.jobSeekerId, profileId);

      if (!profileId && result.profileId) {
        setProfileId(result.profileId);
        localStorage.setItem('profileId', result.profileId);
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
      <UserInfo user={user} />

      <h1 className="text-xl font-bold mb-4">Profile</h1>

      <Alert message={message.text} type={message.type} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="seekedJobTitle"
          required
          placeholder="Seeked Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <SkillsInput 
          label="Technical Skills" 
          skills={technicalSkills} 
          setSkills={setTechnicalSkills} 
        />
        
        <SkillsInput 
          label="Job Position Skills" 
          skills={jobPositionSkills} 
          setSkills={setJobPositionSkills} 
        />
        
        <SkillsInput 
          label="Field Skills" 
          skills={fieldSkills} 
          setSkills={setFieldSkills} 
        />
        
        <SkillsInput 
          label="Soft Skills" 
          skills={softSkills} 
          setSkills={setSoftSkills} 
        />

        <Input
          type="text"
          name="experience"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <Checkbox 
          name="receiveNotifications" 
          label="Receive job notifications"
          checked={receiveNotifications}
          onChange={(e) => setReceiveNotifications(e.target.checked)} 
        />

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? '...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileUser;