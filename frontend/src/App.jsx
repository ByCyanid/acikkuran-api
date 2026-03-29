import React, { useState } from 'react'
import { QuranProvider } from './context/QuranContext'
import Header from './components/Header/Header'
import Book from './components/Reader/Book'
import Controls from './components/Navigation/Controls'
import SettingsPanel from './components/Settings/SettingsPanel'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <QuranProvider>
      <div className="flex flex-col min-h-screen bg-[var(--bg-app)] transition-colors duration-300">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <Book />
        </main>

        <Controls />

        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </QuranProvider>
  )
}

export default App
