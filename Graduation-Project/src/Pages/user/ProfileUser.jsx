import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '../../api/profile';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Checkbox from '../../components/Checkbox';
import SkillsInput from '../../components/SkillsInput';
import UserInfo from '../../components/UserInfo';
import CVUpload from '../../components/CVUpload';

const ProfileUser = ({ user, token, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [cvFile, setCvFile] = useState(null);
  const [currentCV, setCurrentCV] = useState('');
  
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
          if (profile.cvFileName) {
            setCurrentCV(profile.cvFileName);
          }
        }
      } catch (err) {
        console.log('No existing profile found');
      }
    };

    if (user?.jobSeekerId && token) {
      loadProfile();
    }
  }, [token, user]);

  const handleCVSelect = (file) => {
    setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.target);
    
    // Add CV file if selected
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
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
      
      if (result.cvFileName) {
        setCurrentCV(result.cvFileName);
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
        <CVUpload onFileSelect={handleCVSelect} currentCV={currentCV} />

        <Input
          type="text"
          name="seekedJobTitle"
          required
          placeholder="Seeked Job Title"
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
          required
          placeholder="Experience"
        />

        <Checkbox 
          name="notifications" 
          label="Receive job notifications" 
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