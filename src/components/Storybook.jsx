import { useState, useEffect } from 'react';
import PageContainer from './storybook/PageContainer';
import ScrollProgress from './storybook/ScrollProgress';

// Import page components
import Page1 from './storybook/pages/Page1';
import Page2 from './storybook/pages/Page2';
import Page3 from './storybook/pages/Page3';

// Placeholder pages (will be replaced with actual implementations)
const PlaceholderPage = ({ pageNumber, isInView }) => (
  <div className="flex items-center justify-center h-full">
    <div className="glass-strong p-8 rounded-2xl text-center">
      <h2 className="text-4xl font-bold mb-4 text-[var(--aurora-green)]">
        Page {pageNumber}
      </h2>
      <p className="text-gray-400">Awaiting implementation...</p>
    </div>
  </div>
);

export default function Storybook() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 30;

  // Background gradients for different acts
  const getBackgroundGradient = (pageNum) => {
    if (pageNum <= 11) {
      // Act 1: Ancient Times - Purple/Deep space
      return 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a1f3a 100%)';
    } else if (pageNum <= 21) {
      // Act 2: Modern Era - Dark red/Warning
      return 'linear-gradient(135deg, #0a0e27 0%, #2a1520 50%, #3a0520 100%)';
    } else {
      // Act 3: Future - Teal/Hope
      return 'linear-gradient(135deg, #0a0e27 0%, #1a3a2f 50%, #2a4a5f 100%)';
    }
  };

  return (
    <section
      className="storybook-container"
      style={{
        scrollSnapType: 'y mandatory',
        overflowY: 'scroll',
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* Progress indicator */}
      <ScrollProgress totalPages={totalPages} currentPage={currentPage} />

      {/* Page 1 - Birth on the Sun */}
      <PageContainer
        id="page-1"
        backgroundColor={getBackgroundGradient(1)}
        onPageEnter={() => setCurrentPage(1)}
      >
        {({ isInView }) => <Page1 isInView={isInView} />}
      </PageContainer>

      {/* Page 2 - The Birth */}
      <PageContainer
        id="page-2"
        backgroundColor={getBackgroundGradient(2)}
        onPageEnter={() => setCurrentPage(2)}
      >
        {({ isInView }) => <Page2 isInView={isInView} />}
      </PageContainer>

      {/* Page 3 - Meet Fiery */}
      <PageContainer
        id="page-3"
        backgroundColor={getBackgroundGradient(3)}
        onPageEnter={() => setCurrentPage(3)}
      >
        {({ isInView }) => <Page3 isInView={isInView} />}
      </PageContainer>

      {/* Pages 4-30 - Placeholders */}
      {Array.from({ length: 27 }, (_, i) => i + 4).map((pageNum) => (
        <PageContainer
          key={pageNum}
          id={`page-${pageNum}`}
          backgroundColor={getBackgroundGradient(pageNum)}
          onPageEnter={() => setCurrentPage(pageNum)}
        >
          {({ isInView }) => (
            <PlaceholderPage pageNumber={pageNum} isInView={isInView} />
          )}
        </PageContainer>
      ))}

      {/* Transition to Data Explorer */}
      <div
        className="flex items-center justify-center bg-gradient-to-b from-[#2a4a5f] to-[var(--deep-space)]"
        style={{
          scrollSnapAlign: 'start',
          height: '50vh',
          minHeight: '400px',
        }}
      >
        <div className="text-center px-4">
          <h3 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--aurora-green)]">
            Ready to Explore?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Dive into real space weather data and simulations
          </p>
          <div className="text-[var(--aurora-blue)] text-4xl animate-bounce">
            ↓
          </div>
        </div>
      </div>
    </section>
  );
}
