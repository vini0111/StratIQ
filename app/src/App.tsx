import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import type { Profile } from './types'
import { profileFromRow, profileToRow } from './lib/mappers'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setProfile(null)
      return
    }
    loadProfile(session.user.id)
  }, [session])

  async function loadProfile(userId: string) {
    setLoadingProfile(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) {
      setProfile(profileFromRow(data))
    } else {
      setProfile(null)
    }
    setLoadingProfile(false)
  }

  async function handleCreateProfile(draft: Omit<Profile, 'id' | 'createdAt'>) {
    if (!session) return
    setSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .insert(profileToRow(draft, session.user.id))
    setSavingProfile(false)
    if (!error) {
      await loadProfile(session.user.id)
    }
  }

  async function handleUpdateProfile(draft: Omit<Profile, 'id' | 'createdAt'>) {
    if (!session) return
    setSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .update(profileToRow(draft, session.user.id))
      .eq('id', session.user.id)
    setSavingProfile(false)
    if (!error) {
      await loadProfile(session.user.id)
      setEditingProfile(false)
    }
  }

  if (loadingSession) return null

  if (!session) return <Login />

  if (loadingProfile) return null

  if (!profile) {
    return <ProfileSetup onSubmit={handleCreateProfile} submitting={savingProfile} />
  }

  if (editingProfile) {
    return (
      <ProfileSetup
        initialProfile={profile}
        onSubmit={handleUpdateProfile}
        onCancel={() => setEditingProfile(false)}
        submitting={savingProfile}
      />
    )
  }

  return <Dashboard profile={profile} onEditProfile={() => setEditingProfile(true)} />
}
