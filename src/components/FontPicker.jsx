const FONTS = [
  { id: 'default', label: 'Default', description: 'System font', style: 'font-sans' },
  { id: 'georgia', label: 'Georgia', description: 'Classic serif', style: 'font-georgia' },
  { id: 'merriweather', label: 'Merriweather', description: 'Readable serif', style: 'font-merriweather' },
  { id: 'playfair', label: 'Playfair Display', description: 'Elegant serif', style: 'font-playfair' },
  { id: 'lato', label: 'Lato', description: 'Clean sans-serif', style: 'font-lato' },
  { id: 'open-sans', label: 'Open Sans', description: 'Friendly sans-serif', style: 'font-open-sans' },
  { id: 'mono', label: 'Monospace', description: 'Code-style', style: 'font-mono' },
]

export default function FontPicker({ current, onSelect, onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pt-4 pb-8 shadow-2xl">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <h3 className="text-base font-semibold text-gray-900 mb-4">Choose Font</h3>

        <div className="space-y-2">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors active:scale-95 ${
                current === f.id
                  ? 'bg-amber-50 border-2 border-amber-400'
                  : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className="text-left">
                <p className={`text-gray-900 text-sm font-medium ${f.style}`}>{f.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{f.description}</p>
              </div>
              <span className={`text-gray-400 text-sm ${f.style}`}>Aa</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
