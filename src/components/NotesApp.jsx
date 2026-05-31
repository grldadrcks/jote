import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import NoteList from './NoteList'
import NoteEditor from './NoteEditor'

export default function NotesApp({ session }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState(null)
  const [isNewNote, setIsNewNote] = useState(false)

  useEffect(() => {
    fetchNotes()

    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${session.user.id}` },
        () => fetchNotes()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [session.user.id])

  async function fetchNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (!error) setNotes(data || [])
    setLoading(false)
  }

  async function saveNote(note) {
    if (!note.title && !note.content) return null

    if (note.id) {
      const { error } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          font: note.font,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      if (!error) {
        setNotes(prev =>
          prev.map(n =>
            n.id === note.id ? { ...n, ...note, updated_at: new Date().toISOString() } : n
          )
        )
      }
      return note
    } else {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: session.user.id,
          title: note.title,
          content: note.content,
          font: note.font || 'default',
        })
        .select()
        .single()

      if (!error && data) {
        setNotes(prev => [data, ...prev])
        return data
      }
      return null
    }
  }

  async function deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id))
      closeEditor()
    }
  }

  function openNote(note) {
    setIsNewNote(false)
    setActiveNote(note)
  }

  function createNote() {
    setIsNewNote(true)
    setActiveNote({ title: '', content: '', font: 'default' })
  }

  function closeEditor() {
    setActiveNote(null)
    setIsNewNote(false)
  }

  if (activeNote !== null) {
    return (
      <NoteEditor
        note={activeNote}
        isNew={isNewNote}
        onSave={saveNote}
        onDelete={deleteNote}
        onClose={closeEditor}
      />
    )
  }

  return (
    <NoteList
      notes={notes}
      loading={loading}
      session={session}
      onOpen={openNote}
      onCreate={createNote}
    />
  )
}
