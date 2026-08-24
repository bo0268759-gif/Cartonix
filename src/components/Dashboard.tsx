import { type ReactNode } from 'react';
import { Sparkles, LogOut, Video, Palette, Wand2, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard({ onNavigateProfile }: { onNavigateProfile?: () => void }) {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pb-24">
      {/* Header */}
      <header className="border-b border-[#232A36] bg-[#0B0F14]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Cartonix</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{profile?.full_name || user?.email}</div>
              <div className="text-xs text-[#A3A7B3]">{user?.email}</div>
            </div>
            <button
              onClick={onNavigateProfile}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-110 active:scale-90"
            >
              {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </button>
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-[#A3A7B3] hover:text-white hover:bg-white/5 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.full_name || 'Creator'}!
          </h1>
          <p className="text-[#A3A7B3] mt-1">Your AI cartoon creation studio is ready.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ActionCard
            icon={<Plus className="w-5 h-5" />}
            title="New Project"
            desc="Start a new AI cartoon from scratch"
            highlight
          />
          <ActionCard
            icon={<Video className="w-5 h-5" />}
            title="Text to Video"
            desc="Generate a video from a text prompt"
          />
          <ActionCard
            icon={<Palette className="w-5 h-5" />}
            title="Cartoon Styles"
            desc="Browse and apply cartoon art styles"
          />
          <ActionCard
            icon={<Wand2 className="w-5 h-5" />}
            title="AI Edit"
            desc="Enhance and edit existing content"
          />
        </div>

        {/* Account info */}
        <div className="mt-12 rounded-2xl border border-[#232A36] bg-[#141A23] p-6">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Email" value={user?.email ?? '—'} />
            <InfoRow label="Name" value={profile?.full_name || 'Not set'} />
            <InfoRow label="Username" value={profile?.username || 'Not set'} />
            <InfoRow label="Joined" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'} />
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  desc,
  highlight,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <button
      className={`group rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] ${
        highlight
          ? 'bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B82F6]/20 border-[#8B5CF6]/40 hover:border-[#8B5CF6]/60'
          : 'bg-[#141A23] border-[#232A36] hover:border-[#3B82F6]/40 hover:bg-[#141A23]/80'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
        highlight ? 'bg-[#8B5CF6]/30 text-[#A78BFA]' : 'bg-white/5 text-[#A3A7B3] group-hover:text-white'
      }`}>
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#A3A7B3]">{desc}</p>
    </button>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[#A3A7B3] text-xs uppercase tracking-wide mb-1">{label}</div>
      <div className={mono ? 'font-mono text-xs break-all' : ''}>{value}</div>
    </div>
  );
}
