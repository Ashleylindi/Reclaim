import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authService.login({ email, password });

      localStorage.setItem('token', res.accessToken);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h1 className="text-xl font-bold">Login</h1>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <input
          className="w-full p-2 bg-slate-800 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 bg-slate-800 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          type="submit"
        >
          Login
        </button>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
