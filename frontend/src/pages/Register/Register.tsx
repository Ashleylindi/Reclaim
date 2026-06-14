import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl w-96 space-y-3"
      >
        <h1 className="text-xl font-bold">Register</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 bg-slate-800 rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 bg-slate-800 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-slate-800 rounded"
          onChange={handleChange}
        />

        <input
          name="contact"
          placeholder="Contact"
          className="w-full p-2 bg-slate-800 rounded"
          onChange={handleChange}
        />

        <button
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
          type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
