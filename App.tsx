/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-APP-ROOT-SENTINEL-V6
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FilesIcon, GraphIcon, RocketIcon, LockIcon, ShieldIcon, 
  SearchIcon, AlertIcon, CloudIcon, BuildingIcon, DatabaseIcon, 
  GlobeIcon, UserIcon, TrendingUpIcon, LinkIcon, LightbulbIcon,
  TerminalIcon, CpuIcon, ChevronRight
} from './components/Icons';
import { MOCK_CODEBASE, ARCH_RULES, MOCK_ACTIVITY, PLAN_CONFIGS } from './constants';
import { 
  CodeFile, DependencyNode, DependencyLink, ImpactAnalysis, 
  MonitorLog, UserProfile, PlanType, DatabaseStatus, 
  DeveloperPersona, NewcomerGuide, PhantomStatus, PhantomExecutionResult,
  RuleViolation, SyntheticFix, SandboxInstance
} from './types';
import DependencyGraph from './components/DependencyGraph';
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import CodeEditor from './components/CodeEditor';
import SovereignVault from './components/SovereignVault';
import UpgradeModal from './components/UpgradeModal';
import SemanticSearch from './components/SemanticSearch';
import AuditView from './components/AuditView';
import RulesView from './components/RulesView';
import CloudSentinel from './components/CloudSentinel';
import ConstitutionView from './components/ConstitutionView';
import DataSentinelView from './components/DataSentinelView';
import DependencyGuardian from './components/DependencyGuardian';
import DeveloperPersonaMirror from './components/DeveloperPersonaMirror';
import DriftView from './components/DriftView';
import DueDiligenceView from './components/DueDiligenceView';
import FairnessGuardView from './components/FairnessGuardView';
import ImmuneSystem from './components/ImmuneSystem';
import LegalSentinel from './components/LegalSentinel';
import LibraryAuditView from './components/LibraryAuditView';
import LogicRegistryView from './components/LogicRegistryView';
import NewcomerGuideView from './components/NewcomerGuideView';
import AcademyDrillsView from './components/AcademyDrillsView';
import PhantomExecutionOverlay from './components/PhantomExecutionOverlay';
import PipelineView from './components/PipelineView';
import ProductivityOracle from './components/ProductivityOracle';
import RefactoringHub from './components/RefactoringHub';
import ReliabilityHub from './components/ReliabilityHub';
import ScaleGuardian from './components/ScaleGuardian';
import SecurityHub from './components/SecurityHub';
import SpecsView from './components/SpecsView';
import StrategicCitadel from './components/StrategicCitadel';
import StructuralForge from './components/StructuralForge';
import WorkloadMonitor from './components/WorkloadMonitor';
import { ragService } from './services/ragService';
import { membershipService } from './services/membershipService';
import { dbService } from './services/databaseService';
import { autoFixerService } from './services/autoFixerService';
import * as gemini from './services/geminiService';

type Tab = 'landing' | 'specs' | 'dashboard' | 'citadel' | 'forge' | 'explorer' | 'graph' | 'vault' | 'saas' | 'security' | 'search' | 'audit' | 'rules' | 'cloud' | 'constitution' | 'data' | 'dna' | 'drift' | 'diligence' | 'ethics' | 'immune' | 'legal' | 'library' | 'registry' | 'drills' | 'pipeline' | 'oracle' | 'refactor' | 'pulse' | 'performance' | 'shield';

interface NavItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
  category: 'Intelligence' | 'Engineering' | 'Logic' | 'Tactical';
}

const NAV_ITEMS: NavItem[] = [
  // Intelligence
  { id: 'dashboard', icon: <RocketIcon />, label: 'Strategic Center', category: 'Intelligence' },
  { id: 'citadel', icon: <BuildingIcon />, label: 'ADR Oversight', category: 'Intelligence' },
  { id: 'saas', icon: <GlobeIcon />, label: 'Platform Hub', category: 'Intelligence' },
  { id: 'search', icon: <SearchIcon />, label: 'Semantic RAG', category: 'Intelligence' },
  
  // Engineering
  { id: 'audit', icon: <AlertIcon />, label: 'Deep Scrutiny', category: 'Engineering' },
  { id: 'rules', icon: <ShieldIcon />, label: 'Logic Invariants', category: 'Engineering' },
  { id: 'refactor', icon: <CpuIcon />, label: 'Refactoring Hub', category: 'Engineering' },
  { id: 'security', icon: <LinkIcon />, label: 'Supply Guardian', category: 'Engineering' },
  { id: 'shield', icon: <LockIcon className="text-[#f85149]" />, label: 'Security Shield', category: 'Engineering' },
  
  // Logic
  { id: 'dna', icon: <UserIcon />, label: 'Persona Mirror', category: 'Logic' },
  { id: 'pulse', icon: <TerminalIcon />, label: 'Reliability Pulse', category: 'Logic' },
  { id: 'pipeline', icon: <GraphIcon className="opacity-50" />, label: 'Continuity Guard', category: 'Logic' },
  { id: 'vault', icon: <LockIcon />, label: 'Sovereign Vault', category: 'Logic' },

  // Tactical
  { id: 'explorer', icon: <FilesIcon />, label: 'File Scrutiny', category: 'Tactical' },
  { id: 'graph', icon: <GraphIcon />, label: 'Logic Graph', category: 'Tactical' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('landing');
  const [codebase, setCodebase] = useState<CodeFile[]>(MOCK_CODEBASE);
  const [selectedFile, setSelectedFile] = useState<CodeFile>(MOCK_CODEBASE[0]);
  const [impactData, setImpactData] = useState<ImpactAnalysis | null>(null);
  const [logs, setLogs] = useState<MonitorLog[]>([]);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>(dbService.getStatus());
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSyncingPersona, setIsSyncingPersona] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  
  const [newcomerGuide, setNewcomerGuide] = useState<NewcomerGuide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  const [phantomStatus, setPhantomStatus] = useState<PhantomStatus>('idle');
  const [phantomResult, setPhantomResult] = useState<PhantomExecutionResult | null>(null);
  const [refactorSuggestions, setRefactorSuggestions] = useState<{ violation: RuleViolation; fix?: SyntheticFix }[]>([]);

  const [sandboxes, setSandboxes] = useState<SandboxInstance[]>([
    { id: 'sb-1', provider: 'AWS', status: 'executing', computeLoad: 72, uptime: '14d 2h', workload: 'RAG Indexer v6', region: 'us-east-1', ownerTeam: 'PLATFORM_CORE', deploymentStatus: 'nominal' },
    { id: 'sb-2', provider: 'GCP', status: 'isolated', computeLoad: 18, uptime: '2d 18h', workload: 'Auth Sentinel', region: 'europe-west1', ownerTeam: 'ACCOUNTS', deploymentStatus: 'nominal' },
    { id: 'sb-3', provider: 'Azure', status: 'executing', computeLoad: 45, uptime: '45m', workload: 'Shipping Edge v2', region: 'west-us', ownerTeam: 'SHIPPING', deploymentStatus: 'scaling' },
  ]);
  const [throughput, setThroughput] = useState(1240500);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user_sentinel_001',
    name: 'Architect Rivera',
    email: 'architect@globovill.com',
    membership: { 
      plan: 'Enterprise',
      status: 'Active',
      signature: {
        logicHash: 'ARCHLENS_SENTINEL_PROVENANCE_V6_MASTER',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
        verifiedBy: 'ArchLens-Core-Citadel'
      },
      tokens: { total: 10000, consumed: 120, reserved: 0, lastUpdated: new Date().toISOString() },
      billingCycleStart: new Date().toISOString(),
      billingCycleEnd: new Date(Date.now() + 25 * 86400000).toISOString(),
      autoRenew: true,
      lastPaymentId: 'PAY-8812',
      unlockedFeatures: ['Deep_RAG', 'Socratic_Mentorship', 'Supply_Guardian', 'Federated_Governance']
    },
    runtimeTarget: 'Cloudflare_Workers'
  });

  const [persona, setPersona] = useState<DeveloperPersona>({
    type: 'Senior Architect',
    traits: ['Functional Logic', 'Zero-Trust Context', 'Modular Purity'],
    philosophy: 'Code is a persistent state of architectural sovereignty.',
    preferredPatterns: ['Repository', 'Strategy', 'Observer'],
    lastSync: new Date().toLocaleTimeString(),
    syncStatus: 'synced'
  });

  const [nodes, setNodes] = useState<DependencyNode[]>([]);
  const [links, setLinks] = useState<DependencyLink[]>([]);

  useEffect(() => {
    const startup = async () => {
       setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'CITADEL_ACTIVE', details: 'Establishing zero-trust logic perimeter...', level: 'success' }]);
       await membershipService.hydrateFromDatabase(currentUser.email);
       setDbStatus(dbService.getStatus());
    };
    startup();

    const workloadTimer = setInterval(() => {
      setThroughput(prev => prev + Math.floor(Math.random() * 5000) - 2000);
      setSandboxes(prev => prev.map(s => s.status === 'executing' ? { ...s, computeLoad: Math.min(100, Math.max(10, s.computeLoad + Math.floor(Math.random() * 10) - 5)) } : s));
    }, 4000);

    return () => clearInterval(workloadTimer);
  }, [currentUser.email]);

  useEffect(() => {
    const runIndexing = async () => {
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'LOGIC_INDEX', details: 'Scanning cross-tier fragments...', level: 'info' }]);
      try {
        const result = await ragService.indexCodebase(codebase, (p, msg) => {
          if (p % 20 === 0) setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'RAG_SYNC', details: msg, level: 'info' }]);
        });
        if (result) {
          setNodes(result.nodes);
          setLinks(result.links);
        }
      } catch (err) {
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'SYNC_ERROR', details: 'Logical corruption detected in RAG layer.', level: 'error' }]);
      }
    };
    if (activeTab !== 'landing' && activeTab !== 'specs' && activeTab !== 'security') runIndexing();
  }, [activeTab, codebase]);

  const fetchGuide = useCallback(async (file: CodeFile) => {
    setIsLoadingGuide(true);
    try {
      const guide = await gemini.generateNewcomerGuide(file, codebase);
      setNewcomerGuide(guide);
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'INTEL_READY', details: `Briefing compiled for ${file.name}`, level: 'success' }]);
    } catch (e) {
      console.error('AI Onboarding failed', e);
    } finally {
      setIsLoadingGuide(false);
    }
  }, [codebase]);

  useEffect(() => {
    if (activeTab === 'explorer') {
      fetchGuide(selectedFile);
    }
  }, [selectedFile, activeTab, fetchGuide]);

  const triggerGuardian = useCallback((file: CodeFile) => {
    setPhantomStatus('compiling');
    setPhantomResult(null);
    
    const analyze = async () => {
      setPhantomStatus('testing');
      try {
        const result = await ragService.validateProposedChange(file, file.content, codebase, ARCH_RULES);
        setImpactData(result);
        setPhantomStatus('checking_invariants');
        await new Promise(r => setTimeout(r, 1000));
        setPhantomStatus(result.safe ? 'success' : 'failed');
        setPhantomResult({
           testResults: { passed: result.testResults?.count || (result.safe ? 100 : 42), total: 100, errors: result.ruleViolations.map(v => v.message) },
           invariantChecks: { passed: result.safe, details: result.rationale }
        });
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'SENTINEL_SCAN', details: `Analysis complete. Sovereignty Score: ${result.score}%`, level: result.safe ? 'success' : 'warning' }]);
      } catch (err) {
        setPhantomStatus('failed');
      }
    };
    analyze();
  }, [codebase]);

  const handleTriggerSyntheticFix = async (violation: RuleViolation) => {
    setIsRefactoring(true);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'FIX_GEN', details: `Curation logic active for ${violation.ruleId}...`, level: 'info' }]);
    try {
      const fix = await autoFixerService.provideCodeActions(selectedFile, violation, codebase, persona);
      if (fix) {
        setRefactorSuggestions(prev => [...prev.filter(s => s.violation.ruleId !== violation.ruleId), { violation, fix }]);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'FIX_READY', details: `Proposed alignment for ${violation.ruleId} (${fix.safetyScore}% confidence).`, level: 'success' }]);
      }
    } catch (e) {
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'FIX_FAIL', details: 'Could not forge synthetic fix.', level: 'error' }]);
    } finally {
      setIsRefactoring(false);
    }
  };

  const handleApplyFix = (violation: RuleViolation, fix: SyntheticFix) => {
    setRefactorSuggestions(prev => prev.filter(s => s.violation.ruleId !== violation.ruleId));
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'REALIGN', details: `Strategic realignment applied to ${violation.file}.`, level: 'success' }]);
  };

  const navigateToCode = useCallback((path: string, line?: number) => {
    const file = codebase.find(f => f.path === path || path.includes(f.path));
    if (file) { 
      setSelectedFile(file); 
      setActiveTab('explorer'); 
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'NAVIGATE', details: `Focusing logical node: ${path}`, level: 'info' }]);
    }
  }, [codebase]);

  const handleUpgradeSuccess = (target: PlanType, details: any) => {
    const planConfig = PLAN_CONFIGS.find(p => p.type === target);
    if (!planConfig) return;
    setCurrentUser(prev => ({
      ...prev, membership: { ...prev.membership, plan: target, lastPaymentId: details.id, tokens: { ...prev.membership.tokens, total: planConfig.limits.credits } }
    }));
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), event: 'PAYMENT', details: `Sovereign Vault upgraded to ${target}. Access Authorized.`, level: 'success' }]);
    setIsUpgradeModalOpen(false);
  };

  const currentViolations = refactorSuggestions.map(s => s.violation);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-sm bg-[#020202] flex-col select-none font-sans relative">
      {/* Global Status Bar */}
      {activeTab !== 'landing' && activeTab !== 'specs' && (
        <div className="h-12 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-8 z-[60] glass-card">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className={`w-2.5 h-2.5 rounded-full ${dbStatus.connected ? 'bg-[#3fb950] shadow-[0_0_10px_#3fb950]' : 'bg-[#f85149]'} animate-pulse`}></div>
                 <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] glow-text-blue">Citadel Secure Mode</span>
              </div>
              <div className="h-5 w-px bg-[#30363d]"></div>
              <div className="flex items-center gap-3 text-[#8b949e]">
                 <span className="text-[10px] font-black uppercase tracking-widest">Logic Credits:</span>
                 <span className={`text-[11px] font-mono font-black text-[#3fb950]`}>{currentUser.membership.tokens.total - currentUser.membership.tokens.consumed}</span>
              </div>
              <div className="h-5 w-px bg-[#30363d]"></div>
              <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-[#2f81f711] text-[#2f81f7] rounded-lg border border-[#2f81f733]">
                    <UserIcon className="w-3 h-3" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{persona.type} Mode</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-[#484f58] uppercase tracking-widest">Master Key: {currentUser.membership.signature.logicHash.slice(0, 12)}...</span>
              <button onClick={() => setIsUpgradeModalOpen(true)} className="bg-white text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">ELEVATE QUOTA</button>
           </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Authoritative Sidebar V2 */}
        {activeTab !== 'landing' && activeTab !== 'specs' && (
          <div className="w-72 bg-[#0d1117] flex flex-col border-r border-[#30363d] shrink-0 z-50 overflow-hidden glass-card">
            <div className="p-8 flex items-center justify-between border-b border-white/5 bg-[#161b22]/30">
               <div className="text-[#2f81f7] font-black italic text-2xl tracking-tighter cursor-pointer hover:scale-105 transition-transform glow-text-blue" onClick={() => setActiveTab('landing')}>ARCHLENS</div>
               <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_8px_#3fb950]" />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8 space-y-10">
               {(['Intelligence', 'Engineering', 'Logic', 'Tactical'] as const).map(cat => (
                 <div key={cat} className="space-y-3">
                    <h3 className="px-4 text-[9px] font-black text-[#484f58] uppercase tracking-[0.4em] mb-4 border-l-2 border-transparent">{cat} Tier</h3>
                    <div className="space-y-1">
                       {NAV_ITEMS.filter(item => item.category === cat).map(item => (
                         <button 
                           key={item.id}
                           onClick={() => setActiveTab(item.id)}
                           className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                             activeTab === item.id 
                               ? 'bg-[#2f81f7] text-white shadow-2xl shadow-[#2f81f733] ring-1 ring-white/20' 
                               : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                           }`}
                         >
                           <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
                             {item.icon}
                           </div>
                           <span className={`text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                             {item.label}
                           </span>
                           {activeTab === item.id && (
                             <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                           )}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#050505]/40 mt-auto">
               <div className="p-4 bg-[#2f81f70a] border border-[#2f81f722] rounded-2xl flex items-center gap-4 group cursor-pointer" onClick={() => setIsUpgradeModalOpen(true)}>
                  <div className="w-10 h-10 rounded-xl bg-[#2f81f715] flex items-center justify-center text-[#2f81f7] group-hover:scale-110 transition-transform">
                     <RocketIcon className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-white uppercase tracking-tight">Upgrade Available</div>
                     <div className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">PROVISION ENTERPRISE</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-0 overflow-hidden relative">
          {activeTab === 'landing' ? <LandingPage onGetStarted={() => setActiveTab('dashboard')} onViewSpecs={() => setActiveTab('specs')} /> :
           activeTab === 'specs' ? <SpecsView onBack={() => setActiveTab('landing')} onInitialize={() => setActiveTab('dashboard')} /> :
           activeTab === 'citadel' ? <StrategicCitadel codebase={codebase} /> :
           activeTab === 'forge' ? <StructuralForge codebase={codebase} /> :
           activeTab === 'saas' ? <WorkloadMonitor sandboxes={sandboxes} throughput={throughput} /> :
           activeTab === 'dashboard' ? <Dashboard stats={{ creditsUsed: 120, requestsUsed: 450, activeViolations: currentViolations.length } as any} rules={ARCH_RULES} user={currentUser} activities={MOCK_ACTIVITY} sandboxes={sandboxes} onNavigate={setActiveTab as any} onUpgrade={() => setIsUpgradeModalOpen(true)} onDrillDown={navigateToCode} /> :
           activeTab === 'audit' ? <AuditView codebase={codebase} rules={ARCH_RULES} onAuditStarted={() => {}} onDrillDown={navigateToCode} /> :
           activeTab === 'rules' ? <RulesView rules={ARCH_RULES} codebase={codebase} activeViolations={currentViolations} onTriggerFix={handleTriggerSyntheticFix} /> :
           activeTab === 'refactor' ? <RefactoringHub suggestions={refactorSuggestions} onApplyFix={handleApplyFix} onGenerateFix={handleTriggerSyntheticFix} isProcessing={isRefactoring} /> :
           activeTab === 'pulse' ? <ReliabilityHub codebase={codebase} /> :
           activeTab === 'shield' ? <SecurityHub codebase={codebase} /> :
           activeTab === 'performance' ? <ScaleGuardian codebase={codebase} /> :
           activeTab === 'cloud' ? <CloudSentinel codebase={codebase} /> :
           activeTab === 'security' ? <DependencyGuardian codebase={codebase} runtime={currentUser.runtimeTarget} /> :
           activeTab === 'library' ? <LibraryAuditView projectRules={ARCH_RULES} plan={currentUser.membership.plan} onUpgrade={() => setIsUpgradeModalOpen(true)} /> :
           activeTab === 'registry' ? <LogicRegistryView codebase={codebase} /> :
           activeTab === 'pipeline' ? <PipelineView /> :
           activeTab === 'oracle' ? <ProductivityOracle codebase={codebase} /> :
           activeTab === 'drills' ? <AcademyDrillsView selectedFile={selectedFile} persona={persona} /> :
           activeTab === 'constitution' ? <ConstitutionView /> :
           activeTab === 'data' ? <DataSentinelView /> :
           activeTab === 'dna' ? <DeveloperPersonaMirror persona={persona} onSync={() => {}} isSyncing={isSyncingPersona} /> :
           activeTab === 'drift' ? <DriftView selectedFile={selectedFile} isLive={true} /> :
           activeTab === 'diligence' ? <DueDiligenceView codebase={codebase} onNavigateToFile={navigateToCode} /> :
           activeTab === 'ethics' ? <FairnessGuardView codebase={codebase} onAuditComplete={() => {}} /> :
           activeTab === 'immune' ? <ImmuneSystem codebase={codebase} /> :
           activeTab === 'legal' ? <LegalSentinel codebase={codebase} /> :
           activeTab === 'search' ? <SemanticSearch codebase={codebase} onNavigateToFile={navigateToCode} /> :
           activeTab === 'vault' ? <SovereignVault user={currentUser} onUpgrade={() => setIsUpgradeModalOpen(true)} /> :
           activeTab === 'explorer' ? (
            <div className="flex h-full relative">
              <CodeEditor 
                file={selectedFile} 
                violations={impactData?.ruleViolations || []} 
                onTriggerFix={handleTriggerSyntheticFix} 
                onApplySyntheticFix={() => {}} 
                onCodeChange={(c) => { 
                  const updated = { ...selectedFile, content: c }; 
                  setSelectedFile(updated); 
                  triggerGuardian(updated); 
                }} 
              />
              <div className="w-96 shrink-0 border-l border-[#30363d] glass-card">
                 <NewcomerGuideView guide={newcomerGuide} isLoading={isLoadingGuide} />
              </div>
              <PhantomExecutionOverlay status={phantomStatus} result={phantomResult} />
            </div>
          ) : activeTab === 'graph' ? <DependencyGraph nodes={nodes} links={links} onNodeClick={(id) => navigateToCode(id)} /> : null}
        </main>
      </div>
      
      <UpgradeModal isOpen={isUpgradeModalOpen} user={currentUser} onClose={() => setIsUpgradeModalOpen(false)} onUpgradeSuccess={handleUpgradeSuccess} />
      {activeTab !== 'landing' && activeTab !== 'specs' && <Terminal logs={logs} impactData={impactData} activeFix={null} onApplyFix={() => {}} onDrillDown={navigateToCode} />}
    </div>
  );
};

export default App;
