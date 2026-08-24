import { useState, useRef, type ReactNode } from 'react';
import {
  ArrowLeft,
  Settings,
  Camera,
  Pencil,
  Video,
  Palette,
  Sparkles,
  Mail,
  AtSign,
  Calendar,
  ChevronRight,
  Film,
  Bookmark,
  Heart,
  Cog,
  Loader2,
  X,
  Flame,
  Award,
  Pin,
  Users,
  Globe,
  FolderOpen,
  Trophy,
  Zap,
  Target,
  Star,
  Quote,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type ContentTab = 'characters' | 'videos' | 'worlds' | 'collections';

export default function ProfileScreen({ onBack }: { onBack: () => void }) {
  const { user, profile, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name ?? '');
  const [editUsername, setEditUsername] = useState(profile?.username ?? '');
  const [editBio, setEditBio] = useState(profile?.bio ?? '');
  const [editSignature, setEditSignature] = useState(profile?.signature ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>('characters');
  const [avatarError, setAvatarError] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const displayName = profile?.full_name || 'Creator';
  const email = user?.email ?? profile?.email ?? '—';
  const username = profile?.username || 'Not set';
  const bio = profile?.bio || '';
  const signature = profile?.signature || '';
  const creatorLevel = profile?.creator_level ?? 1;
  const streakDays = profile?.streak_days ?? 0;
  const totalCreations = profile?.total_creations ?? 0;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';
  const avatarUrl = profile?.avatar_url;
  const avatarUrlWithCacheBust = avatarUrl
    ? `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}v=${avatarVersion}`
    : '';

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);
    setAvatarError(false);

    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { cacheControl: '3600', upsert: true });

      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const { error: updErr } = await updateProfile({ avatar_url: urlData.publicUrl });
      if (updErr) throw new Error(updErr);
      setAvatarVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    const { error } = await updateProfile({
      full_name: editName.trim() || null,
      username: editUsername.trim() || null,
      bio: editBio.trim().slice(0, 150) || null,
      signature: editSignature.trim().slice(0, 50) || null,
    });
    setSaving(false);
    if (error) {
      setError(error);
    } else {
      setEditOpen(false);
    }
  };

  const openEdit = () => {
    setEditName(profile?.full_name ?? '');
    setEditUsername(profile?.username ?? '');
    setEditBio(profile?.bio ?? '');
    setEditSignature(profile?.signature ?? '');
    setError(null);
    setEditOpen(true);
  };

  const tabs: { id: ContentTab; label: string; icon: ReactNode }[] = [
    { id: 'characters', label: 'Characters', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'worlds', label: 'Worlds', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'collections', label: 'Collections', icon: <FolderOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pb-24">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#232A36] bg-[#0B0F14]/95 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-[#A3A7B3] hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <button className="p-2 -mr-2 rounded-lg text-[#A3A7B3] hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-90">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 pt-8 space-y-6">
        {/* Profile section */}
        <section className="flex flex-col items-center">
          {/* Avatar with gradient ring + level badge */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] opacity-60 blur-md" />
            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6]" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-[#141A23] border-2 border-[#0B0F14]">
              {avatarUrl && !avatarError ? (
                <img
                  src={avatarUrlWithCacheBust}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-[#8B5CF6]/30 to-[#3B82F6]/30">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </div>
            {/* Camera/edit button */}
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center border-2 border-[#0B0F14] shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-60"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            {/* Creator Level badge */}
            <div className="absolute -top-1 -left-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-[10px] font-bold shadow-lg border border-[#0B0F14]">
              LV {creatorLevel}
            </div>
          </div>

          <h2 className="mt-4 text-xl font-bold">{displayName}</h2>
          {username !== 'Not set' && (
            <p className="text-sm text-[#8B5CF6] mt-0.5">@{username}</p>
          )}
          <p className="text-sm text-[#A3A7B3] mt-0.5">{email}</p>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-[#C4C8D4] mt-3 text-center max-w-xs leading-relaxed">{bio}</p>
          )}

          {/* Signature */}
          {signature && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8B5CF6]/80 italic">
              <Quote className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{signature}</span>
            </div>
          )}

          {/* Edit Profile button */}
          <button
            onClick={openEdit}
            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#A78BFA] hover:to-[#60A5FA] text-white font-semibold transition-all duration-200 shadow-lg shadow-[#8B5CF6]/20 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>

          {error && (
            <div className="w-full mt-3 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        {/* Creator Stats — Streak + Total Creations */}
        <section>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] p-5">
            <div className="grid grid-cols-3 gap-2">
              <StatItem icon={<Flame className="w-4 h-4" />} label="Day Streak" value={streakDays} accent="orange" />
              <StatItem icon={<Sparkles className="w-4 h-4" />} label="Creations" value={totalCreations} accent="purple" />
              <StatItem icon={<Trophy className="w-4 h-4" />} label="Level" value={creatorLevel} accent="blue" />
            </div>
          </div>
        </section>

        {/* Featured Creation */}
        <section>
          <h3 className="text-sm font-semibold text-[#A3A7B3] mb-3 px-1 flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5" /> Featured Creation
          </h3>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B0F14] flex items-center justify-center mb-3">
              <Pin className="w-5 h-5 text-[#A3A7B3]" />
            </div>
            <p className="text-sm text-[#A3A7B3]">No featured creation yet</p>
            <p className="text-xs text-[#6B7280] mt-1">Pin a creation to showcase it at the top of your profile</p>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h3 className="text-sm font-semibold text-[#A3A7B3] mb-3 px-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Achievements
          </h3>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B0F14] flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-[#A3A7B3]" />
            </div>
            <p className="text-sm text-[#A3A7B3]">No achievements earned yet</p>
            <p className="text-xs text-[#6B7280] mt-1">Create and explore to unlock badges</p>
          </div>
        </section>

        {/* Content Tabs */}
        <section>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-[#232A36]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-[#8B5CF6] bg-[#8B5CF6]/5'
                      : 'text-[#A3A7B3] hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Tab content — empty state */}
            <div className="p-8 flex flex-col items-center justify-center text-center min-h-[180px]">
              <div className="w-12 h-12 rounded-xl bg-[#0B0F14] flex items-center justify-center mb-3">
                {tabs.find((t) => t.id === activeTab)?.icon}
              </div>
              <p className="text-sm text-[#A3A7B3]">No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} yet</p>
              <p className="text-xs text-[#6B7280] mt-1">Your creations will appear here once you start making them</p>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section>
          <h3 className="text-sm font-semibold text-[#A3A7B3] mb-3 px-1">Account Info</h3>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] overflow-hidden">
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={email} />
            <Divider />
            <InfoRow icon={<AtSign className="w-4 h-4" />} label="Username" value={username} />
            <Divider />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Member Since" value={memberSince} />
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-sm font-semibold text-[#A3A7B3] mb-3 px-1">Quick Links</h3>
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] overflow-hidden">
            <LinkRow icon={<Film className="w-4 h-4" />} label="My Creations" />
            <Divider />
            <LinkRow icon={<Bookmark className="w-4 h-4" />} label="Saved Styles" />
            <Divider />
            <LinkRow icon={<Heart className="w-4 h-4" />} label="Favorites" />
            <Divider />
            <LinkRow icon={<Cog className="w-4 h-4" />} label="Settings" />
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#141A23] border border-[#232A36] rounded-t-2xl sm:rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={() => setEditOpen(false)}
                className="p-1.5 rounded-lg text-[#A3A7B3] hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-[#A3A7B3] mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="auth-input"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#A3A7B3] mb-1.5 block">Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="@username"
                className="auth-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#A3A7B3]">Bio</label>
                <span className={`text-xs ${editBio.length > 150 ? 'text-red-400' : 'text-[#6B7280]'}`}>
                  {editBio.length}/150
                </span>
              </div>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value.slice(0, 150))}
                placeholder="Tell people about yourself..."
                rows={3}
                className="auth-input resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#A3A7B3]">Signature</label>
                <span className={`text-xs ${editSignature.length > 50 ? 'text-red-400' : 'text-[#6B7280]'}`}>
                  {editSignature.length}/50
                </span>
              </div>
              <input
                type="text"
                value={editSignature}
                onChange={(e) => setEditSignature(e.target.value.slice(0, 50))}
                placeholder="Your tagline or quote"
                className="auth-input"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#A78BFA] hover:to-[#60A5FA] text-white font-semibold transition-all duration-200 shadow-lg shadow-[#8B5CF6]/20 disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent: 'purple' | 'blue' | 'orange';
}) {
  const accentClasses = {
    purple: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5 text-[#A78BFA]',
    blue: 'from-[#3B82F6]/20 to-[#3B82F6]/5 text-[#60A5FA]',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400',
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentClasses[accent]} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-[#A3A7B3]">{label}</span>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-lg bg-[#0B0F14] flex items-center justify-center text-[#A3A7B3]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[#A3A7B3]">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#A3A7B3] flex-shrink-0" />
    </div>
  );
}

function LinkRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white/5 active:scale-[0.99]">
      <div className="w-9 h-9 rounded-lg bg-[#0B0F14] flex items-center justify-center text-[#8B5CF6]">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="w-4 h-4 text-[#A3A7B3] flex-shrink-0" />
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-[#232A36] mx-4" />;
}
