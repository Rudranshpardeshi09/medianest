import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/Home'
import { AboutPage } from '@/pages/About'
import { ServicesPage } from '@/pages/Services'
import { ProjectsPage } from '@/pages/Projects'
import { TeamPage } from '@/pages/Team'
import { ClientsPage } from '@/pages/Clients'
import { VideoPage } from '@/pages/Video'
import { ContactPage } from '@/pages/Contact'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/video" element={<VideoPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}
