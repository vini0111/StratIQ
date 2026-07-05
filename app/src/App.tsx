import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import type { Profile } from './types'
import { profileFromRow, profileToRow } from './lib/mappers'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Wiki from './pages/Wiki'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [showWiki, setShowWiki] = useState(false)

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

  // Depende só do ID do usuário, não do objeto `session` inteiro. O
  // Supabase emite um novo objeto de sessão (mesma pessoa) sempre que o
  // token é renovado — o que acontece automaticamente, inclusive toda vez
  // que a aba volta a ficar em foco. Se este efeito dependesse de `session`,
  // cada uma dessas renovações reexecutaria loadProfile → setLoadingProfile
  // (true) → a tela renderiza null momentaneamente → Dashboard/SnapshotForm
  // são desmontados e o rascunho em preenchimento é perdido. Foi a causa
  // raiz do "a página se atualiza sozinha e perco o que eu tava digitando".
  const userId = session?.user.id
  useEffect(() => {
    if (!userId) {
      setProfile(null)
      return
    }
    loadProfile(userId)
  }, [userId])

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

  if (showWiki) {
    return <Wiki onBack={() => setShowWiki(false)} />
  }

  return (
    <Dashboard
      profile={profile}
      onEditProfile={() => setEditingProfile(true)}
      onOpenWiki={() => setShowWiki(true)}
    />
  )
}
