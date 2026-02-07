import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Key, Crown, Gem, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'plan'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'plan' as const, label: 'Plan & Billing', icon: Key },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-gray-400" /> Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-2 border-b border-citadel-border pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px',
              activeTab === tab.id ? 'border-sentinel-blue text-sentinel-blue' : 'border-transparent text-gray-400 hover:text-white')}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sentinel-blue to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">{user?.orgName} &middot; {user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input defaultValue={user?.name} className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-white focus:border-sentinel-blue outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input defaultValue={user?.email} className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-white focus:border-sentinel-blue outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization</label>
              <input defaultValue={user?.orgName} className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-white focus:border-sentinel-blue outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
              <input defaultValue={user?.role} className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-gray-400 cursor-not-allowed" disabled />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all shadow-glow-blue">
            Save Changes
          </button>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              {user?.plan === 'institution' ? <Crown className="w-6 h-6 text-purple-400" /> :
               user?.plan === 'pro' ? <Gem className="w-6 h-6 text-sentinel-blue" /> :
               <Zap className="w-6 h-6 text-gray-400" />}
              <div>
                <p className="text-lg font-semibold text-white capitalize">{user?.plan} Plan</p>
                <p className="text-xs text-gray-500">Current subscription</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {user?.features?.slice(0, 12).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-invariant-green" />
                  {f.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          </div>
          {user?.plan !== 'institution' && (
            <div className="bg-gradient-to-r from-purple-500/10 to-sentinel-blue/10 border border-purple-400/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Upgrade to Institution</h3>
              <p className="text-sm text-gray-400 mb-4">Unlock Strategic Citadel, Sovereign Vault, SSO/SAML, and unlimited team members.</p>
              <button className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all">
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6 space-y-4">
          {['Drift detection alerts', 'Security vulnerability alerts', 'Analysis completion', 'Team activity', 'Weekly reports'].map((n) => (
            <div key={n} className="flex items-center justify-between py-3 border-b border-citadel-border/50 last:border-0">
              <span className="text-sm text-gray-300">{n}</span>
              <button className="w-11 h-6 rounded-full bg-invariant-green flex items-center px-0.5">
                <div className="w-5 h-5 rounded-full bg-white translate-x-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Change Password</h3>
            <div className="space-y-3 max-w-md">
              <input type="password" placeholder="Current password" className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue outline-none transition-all" />
              <input type="password" placeholder="New password" className="w-full px-4 py-3 bg-citadel-bg border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue outline-none transition-all" />
              <button className="px-6 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all">Update Password</button>
            </div>
          </div>
          <div className="border-t border-citadel-border pt-6">
            <h3 className="text-sm font-semibold text-white mb-3">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-500 mb-3">Add an extra layer of security to your account.</p>
            <button className="px-4 py-2 border border-citadel-border text-gray-300 rounded-xl hover:border-sentinel-blue hover:text-white transition-all text-sm">Enable 2FA</button>
          </div>
        </div>
      )}
    </div>
  );
}
