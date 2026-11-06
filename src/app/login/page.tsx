'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password });
      if (signUpErr) alert(signUpErr.message);
      else alert('Đăng ký thành công!');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-white/10 shadow-2xl relative">
        <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập Moodify</h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#282828] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#1DB954]"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#282828] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#1DB954]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:scale-105 transition mt-4"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập / Đăng ký'}
          </button>
        </form>
      </div>
    </main>
  );
}