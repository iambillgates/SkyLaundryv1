"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Untuk redirect

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login sederhana (Nanti bisa pakai JWT dari backend)
    if (password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      alert('Password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Staff Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Akses</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan password staff"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            MASUK DASHBOARD
          </button>
        </form>
        <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
            ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}