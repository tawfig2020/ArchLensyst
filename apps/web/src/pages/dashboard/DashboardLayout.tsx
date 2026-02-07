import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Code2, GitBranch, Shield, Search, ScrollText, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Zap, Building2, Lock, BarChart3, Crosshair,
  BookOpen, Menu, X, Crown, Gem,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  category: string;
  requiresPlan?: ('pro' | 'institution')[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', category: 'Intelligence' },
  { to: '/dashboard/analysis', icon: Code2, label: 'Code Analysis', category: 'Intelligence' },
  { to: '/dashboard/search', icon: Search, label: 'Semantic Search', category: 'Intelligence' },
  { to: '/dashboard/dependencies', icon: GitBranch, label: 'Dependencies', category: 'Engineering' },
  { to: '/dashboard/drift', icon: Crosshair, label: 'Drift Detection', category: 'Engineering' },
  { to: '/dashboard/rules', icon: BookOpen, label: 'Rules Engine', category: 'Engineering' },
  { to: '/dashboard/security', icon: Shield, label: 'Security Hub', category: 'Tactical' },
  { to: '/dashboard/audit', icon: ScrollText, label: 'Audit Log', category: 'Tactical' },
  { to: '/dashboard/citadel', icon: Building2, label: 'Strategic Citadel', category: 'Command', requiresPlan: ['institution'] },
  { to: '/dashboard/vault', icon: Lock, label: 'Sovereign Vault', category: 'Command', requiresPlan: ['institution'] },
  { to: '/dashboard/metrics', icon: BarChart3, label: 'Metrics', category: 'Command' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings', category: 'Settings' },
];

const CATEGORIES = ['Intelligence', 'Engineering', 'Tactical', 'Command', 'Settings'];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  const planBadge = user?.plan === 'institution'
    ? { icon: Crown, label: 'Institution', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' }
    : user?.plan === 'pro'
    ? { icon: Gem, label: 'Pro', color: 'text-sentinel-blue bg-sentinel-blue-glow border-sentinel-blue/30' }
    : { icon: Zap, label: 'Free', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' };

  const isFeatureAvailable = (item: NavItem) => {
    if (!item.requiresPlan) return true;
    return item.requiresPlan.includes(user?.plan as 'pro' | 'institution');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-citadel-border', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 rounded-xl bg-blue-purple flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold text-white tracking-tight">ArchLens</span>}
      </div>

      {/* Plan badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold', planBadge.color)}>
            <planBadge.icon className="w-3.5 h-3.5" />
            {planBadge.label} Plan
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {CATEGORIES.map((cat) => {
          const items = NAV_ITEMS.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              {!collapsed && (
                <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {cat}
                </p>
              )}
              {items.map((item) => {
                const available = isFeatureAvailable(item);
                return (
                  <NavLink
                    key={item.to}
                    to={available ? item.to : '#'}
                    end={item.to === '/dashboard'}
                    onClick={(e) => {
                      if (!available) e.preventDefault();
                      setMobileOpen(false);
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                        collapsed && 'justify-center px-2',
                        isActive && available
                          ? 'bg-sentinel-blue/10 text-sentinel-blue border border-sentinel-blue/20'
                          : available
                          ? 'text-gray-400 hover:text-white hover:bg-citadel-elevated border border-transparent'
                          : 'text-gray-600 cursor-not-allowed border border-transparent opacity-50'
                      )
                    }
                  >
                    <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0')} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {!available && <Lock className="w-3 h-3 text-gray-600" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn('border-t border-citadel-border p-3', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3 px-3 py-2 rounded-xl', collapsed && 'justify-center px-2')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sentinel-blue to-purple-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-breach-red hover:bg-breach-red-glow transition-all mt-1',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-citadel-bg flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-citadel-surface border-r border-citadel-border transition-all duration-300 relative',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-citadel-elevated border border-citadel-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-sentinel-blue transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-citadel-surface border-r border-citadel-border z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-citadel-surface/80 backdrop-blur-citadel border-b border-citadel-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-citadel-elevated transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-breach-red rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-citadel-elevated rounded-lg border border-citadel-border">
              <div className="w-2 h-2 bg-invariant-green rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">{user?.orgName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-citadel-border px-4 lg:px-6 py-3 flex items-center justify-between text-xs text-gray-500">
          <span>Powered by <span className="text-sentinel-blue font-semibold">ddbis-rmc</span></span>
          <span>&copy; {new Date().getFullYear()} ArchLens Strategic Systems</span>
        </footer>
      </div>
    </div>
  );
}
