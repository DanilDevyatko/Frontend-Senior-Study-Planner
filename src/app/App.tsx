import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthProvider'
import { AppShell } from './AppShell'
import { ProtectedPlannerRoute } from './ProtectedPlannerRoute'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { RoadmapPage } from '../pages/RoadmapPage'
import { TopicsPage } from '../pages/TopicsPage'
import { ReviewPage } from '../pages/ReviewPage'
import { SettingsPage } from '../pages/SettingsPage'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedPlannerRoute />}>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate replace to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="roadmap/:weekId" element={<RoadmapPage />} />
              <Route path="topics" element={<TopicsPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
