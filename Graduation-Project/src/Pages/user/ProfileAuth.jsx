import { useState } from 'react';
import { login, register } from '../../api/auth';

const ProfileAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const data = isLogin 
        ? await login(email, password) 
        : await register(email, password);
      
      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('jobSeekerId', data.jobSeekerId);
      localStorage.setItem('email', data.email);
      
      onAuthSuccess(data.token, { 
        email: data.email, 
        jobSeekerId: data.jobSeekerId 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          className="w-full p-2 border"
          placeholder="Email"
        />

        <input
          type="password"
          name="password"
          required
          className="w-full p-2 border"
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-black text-white"
        >
          {loading ? '...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        {isLogin ? "No account? " : "Have account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="underline"
        >
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default ProfileAuth;