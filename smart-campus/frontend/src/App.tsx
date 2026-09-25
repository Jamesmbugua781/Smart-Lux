import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import { ExplorePage } from './pages/ExplorePage'
import { CampusPage } from './pages/CampusPage'
import { MapPage } from './pages/MapPage'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
import { AcademicsPage } from './pages/AcademicsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/campus" element={<CampusPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
      <Route path="/academics" element={<AcademicsPage />} />
    </Routes>
  )
}

export default App
