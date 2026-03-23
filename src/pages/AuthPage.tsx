import { useMemo, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AppStatePanel } from '../components/AppStatePanel'
import { PageCard } from '../components/ui'
import { useAuth } from '../features/auth/useAuth'
import styles from './auth.module.css'

type AuthMode = 'sign_in' | 'sign_up' | 'forgot_password'

export function AuthPage() {
  const auth = useAuth()
  const [mode, setMode] = useState<AuthMode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = useMemo(() => {
    if (auth.isRecoveryMode) {
      return 'Reset your password'
    }

    if (mode === 'sign_up') {
      return 'Create your planner account'
    }

    if (mode === 'forgot_password') {
      return 'Reset your password'
    }

    return 'Sign in to your planner'
  }, [auth.isRecoveryMode, mode])

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

  if (auth.status === 'authenticated' && !auth.isRecoveryMode) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setMessage(null)

    try {
      if (auth.isRecoveryMode) {
        if (password.length < 8) {
          setErrorMessage('Use at least 8 characters for the new password.')
          return
        }

        if (password !== confirmPassword) {
          setErrorMessage('The new password and confirmation must match.')
          return
        }

        const result = await auth.actions.updatePassword(password)
        if (result.error) {
          setErrorMessage(result.error)
          return
        }

        setMessage(result.message ?? 'Password updated.')
        return
      }

      if (mode === 'forgot_password') {
        if (!email.trim()) {
          setErrorMessage('Enter the email address tied to your planner account.')
          return
        }

        const result = await auth.actions.sendPasswordReset(email.trim())
        if (result.error) {
          setErrorMessage(result.error)
          return
        }

        setMessage(result.message ?? 'Password reset email sent.')
        return
      }

      if (!email.trim()) {
        setErrorMessage('Email is required.')
        return
      }

      if (!password) {
        setErrorMessage('Password is required.')
        return
      }

      if (mode === 'sign_up') {
        if (password.length < 8) {
          setErrorMessage('Use at least 8 characters for the password.')
          return
        }

        if (password !== confirmPassword) {
          setErrorMessage('Password confirmation does not match.')
          return
        }

        const result = await auth.actions.signUp(email.trim(), password)
        if (result.error) {
          setErrorMessage(result.error)
          return
        }

        setMessage(result.message ?? 'Account created.')
        if (!result.needsEmailConfirmation) {
          setMode('sign_in')
        }
        return
      }

      const result = await auth.actions.signIn(email.trim(), password)
      if (result.error) {
        setErrorMessage(result.error)
        return
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Supabase sync</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>
          Planner progress now syncs privately across devices through your Supabase account.
        </p>
      </div>

      <PageCard title={title} eyebrow={auth.isRecoveryMode ? 'Recovery' : 'Account access'} className={styles.card}>
        {!auth.isRecoveryMode ? (
          <div className={styles.modeRow}>
            <button
              className={`${styles.modeButton} ${mode === 'sign_in' ? styles.modeButtonActive : ''}`.trim()}
              type="button"
              onClick={() => {
                setMode('sign_in')
                setMessage(null)
                setErrorMessage(null)
              }}
            >
              Sign in
            </button>
            <button
              className={`${styles.modeButton} ${mode === 'sign_up' ? styles.modeButtonActive : ''}`.trim()}
              type="button"
              onClick={() => {
                setMode('sign_up')
                setMessage(null)
                setErrorMessage(null)
              }}
            >
              Sign up
            </button>
            <button
              className={`${styles.modeButton} ${mode === 'forgot_password' ? styles.modeButtonActive : ''}`.trim()}
              type="button"
              onClick={() => {
                setMode('forgot_password')
                setMessage(null)
                setErrorMessage(null)
              }}
            >
              Reset
            </button>
          </div>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          {!auth.isRecoveryMode && mode !== 'forgot_password' ? (
            <>
              <div className={styles.field}>
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'sign_up' ? 'new-password' : 'current-password'}
                />
              </div>
            </>
          ) : null}

          {!auth.isRecoveryMode && mode === 'forgot_password' ? (
            <div className={styles.field}>
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                className={styles.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
          ) : null}

          {auth.isRecoveryMode ? (
            <div className={styles.field}>
              <label htmlFor="auth-new-password">New password</label>
              <input
                id="auth-new-password"
                className={styles.input}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          ) : null}

          {(auth.isRecoveryMode || mode === 'sign_up') ? (
            <div className={styles.field}>
              <label htmlFor="auth-confirm-password">
                {auth.isRecoveryMode ? 'Confirm new password' : 'Confirm password'}
              </label>
              <input
                id="auth-confirm-password"
                className={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          ) : null}

          {errorMessage ? <p className={styles.errorText}>{errorMessage}</p> : null}
          {message ? <p className={styles.infoText}>{message}</p> : null}

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {auth.isRecoveryMode
                ? 'Update password'
                : mode === 'sign_up'
                  ? 'Create account'
                  : mode === 'forgot_password'
                    ? 'Send reset email'
                    : 'Sign in'}
            </button>
            {auth.isRecoveryMode ? (
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => {
                  auth.actions.clearRecoveryMode()
                  setPassword('')
                  setConfirmPassword('')
                  setErrorMessage(null)
                  setMessage(null)
                }}
              >
                Back to sign in
              </button>
            ) : null}
          </div>
        </form>
      </PageCard>
    </div>
  )
}
