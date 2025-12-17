import { useState } from 'react';
import { JobProvider } from './context/JobContext';
import { ResumeProvider } from './context/ResumeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Settings } from './pages/Settings';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { Claire } from './components/Claire';
import type { Page } from './types/types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <Jobs />;
      case 'resume':
        return <ResumeBuilder />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <JobProvider>
      <ResumeProvider>
        <AppContent />
        <Claire />
      </ResumeProvider>
    </JobProvider>
  );
}
