import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Trash2, Type } from 'lucide-react'
import FontPicker from './FontPicker'

const FONT_CLASSES = {
  default: 'font-sans',
  georgia: 'font-georgia',
  merriweather: 'font-merriweather',
  playfair: 'font-playfair',
  lato: 'font-lato',
  'open-sans': 'font-open-sans',
  mono: 'font-mono',
}

export default function NoteEditor({ note, isNew, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(note.title || '')
  const [content, setContent] = useState(note.content || '')
  const [font, setFont] = useState(note.font || 'default')
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [noteId, setNoteId] = useState(note.id || null)
  const [saveStatus, setSaveStatus] = useState('saved')
  const saveTimeout = useRef(null)
  const latestNote = useRef({ id: noteId, title, content, font })

  useEffect(() => {
    latestNote.current = { id: noteId, title, content, font }
  })

  const scheduleSave = useCallback(() => {
    const { title, content } = latestNote.current
    if (!title && !content) return
    setSaveStatus('saving')
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      const saved = await onSave(latestNote.current)
      if (saved && !latestNote.current.id) {
        setNoteId(saved.id)
        latestNote.current.id = saved.id
      }
      setSaveStatus('saved')
    }, 900)
  }, [onSave])

  useEffect(() => {
    scheduleSave()
  }, [title, content, font])

  async function handleClose() {
    clearTimeout(saveTimeout.current)
    const { title, content } = latestNote.current
    if (title || content) await onSave(latestNote.current)
    onClose()
  }

  async function handleDelete() {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    if (noteId) {
      await onDelete(noteId)
    } else {
      onClose()
    }
  }

  const fontClass = FONT_CLASSES[font] || 'font-sans'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-3 border-b border-gray-100">
        <button
          onClick={handleClose}
          className="p-2 -ml-2 text-gray-600 active:text-gray-900"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="text-xs text-gray-300 transition-opacity">
          {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
        </span>
        <button
          onClick={handleDelete}
          className="p-2 -mr-2 text-red-400 active:text-red-600"
          aria-label="Delete note"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Editor area */}
      <div className={`flex-1 flex flex-col px-5 pt-4 pb-2 ${fontClass}`}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={`text-2xl font-bold text-gray-900 placeholder-gray-200 focus:outline-none mb-3 w-full bg-transparent ${fontClass}`}
          autoFocus={isNew}
        />
        <textarea
          placeholder="Start writing..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className={`flex-1 text-gray-700 placeholder-gray-300 focus:outline-none text-[16px] leading-relaxed bg-transparent ${fontClass}`}
          style={{ minHeight: '65vh' }}
        />
      </div>

      {/* Toolbar */}
      <div className="px-5 py-3 pb-8 border-t border-gray-100 flex items-center gap-3">
        <button
          onClick={() => setShowFontPicker(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm active:bg-gray-200 transition-colors"
        >
          <Type size={15} />
          <span className={fontClass}>Font</span>
        </button>
      </div>

      {showFontPicker && (
        <FontPicker
          current={font}
          onSelect={f => {
            setFont(f)
            setShowFontPicker(false)
          }}
          onClose={() => setShowFontPicker(false)}
        />
      )}
    </div>
  )
}
