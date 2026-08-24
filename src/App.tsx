import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import ProfileScreen from '@/components/ProfileScreen';
import BottomNav, { type TabId } from '@/components/BottomNav';

function AppContent() {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<TabId>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {tab === 'home' && <Dashboard onNavigateProfile={() => setTab('profile')} />}
      {tab === 'profile' && <ProfileScreen onBack={() => setTab('home')} />}
      {tab === 'create' && <Dashboard onNavigateProfile={() => setTab('profile')} />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
