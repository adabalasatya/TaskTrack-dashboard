import { useRef } from 'react'
import { UploadCloud } from 'lucide-react'

export const FileUpload = ({ onDataLoaded }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result)
        // Check if data has expected structure (array of tasks or wrapped object)
        if (Array.isArray(jsonData)) {
          onDataLoaded(jsonData)
        } else if (jsonData.tasks && Array.isArray(jsonData.tasks)) {
          onDataLoaded(jsonData.tasks)
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          onDataLoaded(jsonData.data)
        } else {
          alert('Invalid JSON structure. Expected an array of tasks.')
        }
      } catch (err) {
        console.error('Error parsing JSON:', err)
        alert('Failed to parse the JSON file. Ensure it is valid.')
      }
      
      // Reset input so the same file could be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    
    reader.readAsText(file)
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all shadow-sm hover:scale-[1.02] active:scale-95"
        style={{ 
          background: 'linear-gradient(135deg, rgba(20,22,34,0.95) 0%, rgba(28,32,46,0.95) 100%)', 
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#d1d5db'
        }}
      >
        <UploadCloud size={16} className="text-indigo-400" />
        <span className="font-medium">Upload JSON</span>
      </button>
    </>
  )
}
