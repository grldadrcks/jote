import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Search, LogOut, BookOpen } from 'lucide-react'
import { formatDate } from '../lib/utils'

const NOTE_COLORS = [
  'bg-white',
  'bg-amber-50',
  'bg-rose-50',
  'bg-sky-50',
  'bg-emerald-50',
  'bg-violet-50',
]

function getNoteColor(id) {
  if (!id) return NOTE_COLORS[0]
  const index = id.charCodeAt(0) % NOTE_COLORS.length
  return NOTE_COLORS[index]
}

export default function NoteList({ notes, loading, session, onOpen, onCreate }) {
  const [search, setSearch] = useState('')

  const filtered = notes.filter(n =>
    (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(search.toLowerCase())
  )

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-xl">
              <BookOpen size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Jote</h1>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 mr-1">{session.user.email?.split('@')[0]}</span>
            <button
              onClick={signOut}
              className="p-2 text-gray-400 active:text-gray-600"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>
      </div>

      {/* Notes grid */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-28">
        {loading ? (
          <div className="flex justify-center mt-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <BookOpen size={52} className="text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">
              {search ? 'No matching notes' : 'No notes yet'}
            </p>
            {!search && (
              <p className="text-gray-300 text-sm mt-1">Tap + to write your first note</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3 px-1">
              {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(note => (
                <button
                  key={note.id}
                  onClick={() => onOpen(note)}
                  className={`${getNoteColor(note.id)} rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform`}
                >
                  <h3 className="font-semibold text-gray-900 text-sm truncate leading-snug">
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-4 leading-relaxed">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-gray-300 text-xs mt-3">{formatDate(note.updated_at)}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onCreate}
        className="fixed bottom-8 right-5 w-14 h-14 bg-amber-500 rounded-full shadow-xl shadow-amber-200 flex items-center justify-center text-white active:scale-90 transition-transform"
        aria-label="New note"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
