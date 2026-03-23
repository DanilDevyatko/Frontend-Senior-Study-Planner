import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppStatePanel } from '../components/AppStatePanel'
import { PlannerProvider } from '../features/planner/PlannerProvider'
import { useAuth } from '../features/auth/useAuth'

export function ProtectedPlannerRoute() {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'loading') {
    return <AppStatePanel title="Checking session" body="Restoring your Supabase session and planner access." eyebrow="Auth" />
  }

  if (auth.status === 'misconfigured') {
    return (
      <AppStatePanel
        title="Supabase is not configured"
        body={auth.configError ?? 'Add the Supabase URL and anon key to continue.'}
        eyebrow="Configuration"
      />
    )
  }

  if (auth.status !== 'authenticated' || !auth.user || auth.isRecoveryMode) {
    return <Navigate replace to="/auth" state={{ from: location.pathname }} />
  }

  return (
    <PlannerProvider userId={auth.user.id}>
      <Outlet />
    </PlannerProvider>
  )
}
