import { Home, Plus, User } from 'lucide-react';

export type TabId = 'home' | 'create' | 'profile';

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#232A36] bg-[#0B0F14]/95 backdrop-blur-xl">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-2 pb-[env(safe-area-inset-bottom)]">
        <NavButton
          active={active === 'home'}
          onClick={() => onChange('home')}
          icon={<Home className="w-5 h-5" />}
          label="Home"
        />
        <CreateButton onClick={() => onChange('create')} />
        <NavButton
          active={active === 'profile'}
          onClick={() => onChange('profile')}
          icon={<User className="w-5 h-5" />}
          label="Profile"
        />
      </div>
    </nav>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200 ${
        active ? 'text-white' : 'text-[#A3A7B3] hover:text-white'
      }`}
    >
      <span className={active ? 'text-[#8B5CF6]' : ''}>{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function CreateButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="-mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/40 transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <Plus className="w-6 h-6 text-white" />
    </button>
  );
}
