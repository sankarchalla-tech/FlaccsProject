import SyncControls from './components/SyncControls';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-700 p-4">
      <h1 className="text-white text-4xl font-bold mb-6">🎵 FLAC Music Sync Manager</h1>
      <SyncControls />
    </div>
  )
}

export default App