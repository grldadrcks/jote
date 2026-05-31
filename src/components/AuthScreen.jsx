import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen } from 'lucide-react'

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email for a confirmation link!')
    }

    setLoading(false)
  }

  function toggleMode() {
    setIsLogin(!isLogin)
    setError('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-amber-500 p-4 rounded-2xl mb-4 shadow-lg shadow-amber-200">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Jote</h1>
          <p className="text-gray-400 mt-1 text-sm">Your thoughts, beautifully kept</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 text-sm"
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 text-sm"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {error && (
              <p className="text-red-500 text-xs px-1">{error}</p>
            )}
            {message && (
              <p className="text-green-600 text-xs px-1">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform mt-1"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleMode} className="text-amber-600 font-semibold">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
