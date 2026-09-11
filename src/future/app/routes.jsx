import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/future/pages/Home'
import { AboutPage } from '@/future/pages/About'
import { ServicesPage } from '@/future/pages/Services'
import { ProjectsPage } from '@/future/pages/Projects'
import { TeamPage } from '@/future/pages/Team'
import { ClientsPage } from '@/future/pages/Clients'
import { VideoPage } from '@/future/pages/Video'
import { ContactPage } from '@/future/pages/Contact'

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
