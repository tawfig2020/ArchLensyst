import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import PainPointsSection from './components/landing/PainPointsSection';
import TruthRevealerSection from './components/landing/TruthRevealerSection';
import NervousSystemSection from './components/landing/NervousSystemSection';
import TransformationSection from './components/landing/TransformationSection';
import LeadershipElevationSection from './components/landing/LeadershipElevationSection';
import SymphonySection from './components/landing/SymphonySection';
import CompetitiveAdvantageSection from './components/landing/CompetitiveAdvantageSection';
import ObjectionHandlerSection from './components/landing/ObjectionHandlerSection';
import FeaturesSection from './components/landing/FeaturesSection';
import HowItWorksSection from './components/landing/HowItWorksSection';
import InteractiveProofSection from './components/landing/InteractiveProofSection';
import CareerDefiningSection from './components/landing/CareerDefiningSection';
import TestimonialsSection from './components/landing/TestimonialsSection';
import PricingSection from './components/landing/PricingSection';
import CTASection from './components/landing/CTASection';
import ElevatedCTASection from './components/landing/ElevatedCTASection';
import Footer from './components/landing/Footer';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import CodeAnalysis from './pages/dashboard/CodeAnalysis';
import SemanticSearch from './pages/dashboard/SemanticSearch';
import Dependencies from './pages/dashboard/Dependencies';
import DriftDetection from './pages/dashboard/DriftDetection';
import RulesEngine from './pages/dashboard/RulesEngine';
import SecurityHub from './pages/dashboard/SecurityHub';
import AuditLog from './pages/dashboard/AuditLog';
import StrategicCitadel from './pages/dashboard/StrategicCitadel';
import SovereignVault from './pages/dashboard/SovereignVault';
import Metrics from './pages/dashboard/Metrics';
import Settings from './pages/dashboard/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-citadel-surface text-gray-200">
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <TruthRevealerSection />
        <NervousSystemSection />
        <TransformationSection />
        <LeadershipElevationSection />
        <SymphonySection />
        <CompetitiveAdvantageSection />
        <ObjectionHandlerSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InteractiveProofSection />
        <CareerDefiningSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <ElevatedCTASection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="analysis" element={<CodeAnalysis />} />
          <Route path="search" element={<SemanticSearch />} />
          <Route path="dependencies" element={<Dependencies />} />
          <Route path="drift" element={<DriftDetection />} />
          <Route path="rules" element={<RulesEngine />} />
          <Route path="security" element={<SecurityHub />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="citadel" element={<StrategicCitadel />} />
          <Route path="vault" element={<SovereignVault />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
