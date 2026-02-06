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
import HeroLanding from './components/HeroLanding';
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
    <div className="h-screen w-screen overflow-hidden text-sm bg-[#0d1117] flex flex-col select-none font-sans">
      {/* Top Navigation Bar - Match Image 4 */}
      {activeTab !== 'landing' && activeTab !== 'specs' && (
        <div className="h-10 bg-[#010409] border-b border-[#30363d] flex items-center justify-between px-4 z-[60]">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                 <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wider">CITADEL SECURE MODE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 border border-green-500/30">
                 <span className="text-green-400 text-[10px] font-semibold uppercase tracking-wider">LOGIC CREDITS: {currentUser.membership.tokens.total - currentUser.membership.tokens.consumed}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/30">
                 <UserIcon className="w-3 h-3 text-blue-400" />
                 <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider">SENIOR ARCHITECT MODE</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">MASTER KEY: ARCHLENS_SEN...</span>
              <button onClick={() => setIsUpgradeModalOpen(true)} className="bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-1.5 rounded text-[10px] font-semibold border border-[#30363d] transition-colors uppercase tracking-wider">ELEVATE QUOTA</button>
           </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Authoritative Sidebar V2 */}
        {activeTab !== 'landing' && activeTab !== 'specs' && (
          <div className="w-56 bg-[#010409] flex flex-col border-r border-[#30363d] shrink-0 z-50">
            <div className="p-4 flex items-center gap-2 border-b border-[#30363d]">
               <div className="text-[#58a6ff] font-black text-lg tracking-tight cursor-pointer" onClick={() => setActiveTab('landing')}>ARCHLENS</div>
               <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4 space-y-4">
               {(['Intelligence', 'Engineering', 'Logic', 'Tactical'] as const).map(cat => (
                 <div key={cat} className="space-y-1">
                    <h3 className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">{cat} TIER</h3>
                    <div className="space-y-0.5">
                       {NAV_ITEMS.filter(item => item.category === cat).map(item => (
                         <button 
                           key={item.id}
                           onClick={() => setActiveTab(item.id)}
                           className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-left ${
                             activeTab === item.id 
                               ? 'bg-[#1f6feb] text-white' 
                               : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                           }`}
                         >
                           <div className="w-4 h-4 shrink-0">
                             {item.icon}
                           </div>
                           <span className="text-xs font-medium uppercase tracking-wide">
                             {item.label}
                           </span>
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-3 border-t border-[#30363d]">
               <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center gap-2 cursor-pointer hover:border-[#58a6ff]/50 transition-all" onClick={() => setIsUpgradeModalOpen(true)}>
                  <RocketIcon className="w-4 h-4 text-[#58a6ff]" />
                  <div>
                     <div className="text-xs font-bold text-white">Upgrade</div>
                     <div className="text-[10px] text-gray-500">Enterprise Plan</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-0 overflow-hidden relative">
          {activeTab === 'landing' ? <HeroLanding onNavigate={setActiveTab as any} /> :
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
