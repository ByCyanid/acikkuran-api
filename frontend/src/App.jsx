import React, { useState } from 'react'
import { QuranProvider, useQuran } from './context/QuranContext'
import Header from './components/Header/Header'
import Book from './components/Reader/Book'
import Controls from './components/Navigation/Controls'
import SettingsPanel from './components/Settings/SettingsPanel'
import Dashboard from './components/Dashboard/Dashboard'

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { currentView } = useQuran()

  if (currentView === 'dashboard') {
    return <Dashboard />
  }

  return (
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
  )
}

function App() {
  return (
    <QuranProvider>
      <AppContent />
    </QuranProvider>
  )
}

export default App
