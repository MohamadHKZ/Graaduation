import { useState, useEffect } from 'react';
import { getRecommendedJobs } from '../../api/jobs';

const JobsView = ({ token, user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.jobSeekerId) {
        setError('Please log in to view jobs');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const profileId = localStorage.getItem('profileId');
        const data = await getRecommendedJobs(token, user.jobSeekerId, profileId);
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No jobs found
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={job.jobId || index} className="bg-white border rounded p-4">
              <h3 className="font-bold text-lg mb-2">{job.title}</h3>
              
              <p className="text-gray-600 text-sm mb-2">{job.company}</p>
              
              {job.description && (
                <p className="text-gray-700 text-sm mb-3">{job.description}</p>
              )}

              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                {job.location && <span>{job.location}</span>}
                {job.employmentType && <span>{job.employmentType}</span>}
              </div>

              {job.technicalSkills && job.technicalSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.technicalSkills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {job.externalUrl && (
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
                >
                  Apply
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsView;