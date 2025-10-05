import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Hero from './components/Hero';
import Storybook from './components/Storybook';
import DataExplorer from './components/DataExplorer';

export default function App() {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-[var(--deep-space)] text-white overflow-x-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Storybook Section */}
        <Storybook />

        {/* Data Explorer Section */}
        <DataExplorer />
      </div>
    </ErrorBoundary>
  );
}
