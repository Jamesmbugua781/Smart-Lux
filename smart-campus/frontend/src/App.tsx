import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import { ExplorePage } from './pages/ExplorePage'
import { CampusPage } from './pages/CampusPage'
import { MapPage } from './pages/MapPage'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
import { AcademicsPage } from './pages/AcademicsPage'
import { DocumentationPage } from './pages/DocumentationPage'
import { TermsPage } from './pages/TermsPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { NotFound } from './pages/NotFound'
import { AuthProvider } from './components/auth/AuthProvider'
import { MobileBottomNav } from './components/layout/MobileBottomNav'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/campus" element={<CampusPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileBottomNav />
    </AuthProvider>
  )
}

export default App
