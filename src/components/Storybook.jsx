import { useState, useEffect } from 'react';
import PageContainer from './storybook/PageContainer';
import ScrollProgress from './storybook/ScrollProgress';

// Import page components
import Page1 from './storybook/pages/Page1';
import Page2 from './storybook/pages/Page2';
import Page3 from './storybook/pages/Page3';
import Page4 from './storybook/pages/Page4';
import Page5 from './storybook/pages/Page5';
import Page6 from './storybook/pages/Page6';
import Page7 from './storybook/pages/Page7';
import Page8 from './storybook/pages/Page8';
import Page9 from './storybook/pages/Page9';
import Page10 from './storybook/pages/Page10';
import Page11 from './storybook/pages/Page11';
import Page12 from './storybook/pages/Page12';
import Page13 from './storybook/pages/Page13';
import Page14 from './storybook/pages/Page14';
import Page15 from './storybook/pages/Page15';
import Page16 from './storybook/pages/Page16';
import Page17 from './storybook/pages/Page17';
import Page18 from './storybook/pages/Page18';
import Page19 from './storybook/pages/Page19';
import Page20 from './storybook/pages/Page20';
import Page21 from './storybook/pages/Page21';
import Page22 from './storybook/pages/Page22';
import Page23 from './storybook/pages/Page23';
import Page24 from './storybook/pages/Page24';
import Page25 from './storybook/pages/Page25';
import Page26 from './storybook/pages/Page26';
import Page27 from './storybook/pages/Page27';
import Page28 from './storybook/pages/Page28';
import Page29 from './storybook/pages/Page29';
import Page30 from './storybook/pages/Page30';

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
    if (pageNum <= 8) {
      // Act 1: Ancient Dance (Pages 1-8) - Purple/Deep space
      return 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a1f3a 100%)';
    } else if (pageNum <= 16) {
      // Act 2: Modern Age (Pages 9-16) - Dark red/Warning
      return 'linear-gradient(135deg, #0a0e27 0%, #2a1520 50%, #3a0520 100%)';
    } else if (pageNum <= 24) {
      // Act 3: Understanding & Resilience (Pages 17-24) - Blue/Teal
      return 'linear-gradient(135deg, #0a0e27 0%, #1a2a3a 50%, #2a3a4f 100%)';
    } else {
      // Act 4: The Future (Pages 25-30) - Bright teal/Green hope
      return 'linear-gradient(135deg, #0a0e27 0%, #1a3a2f 50%, #2a4a5f 100%)';
    }
  };

  const handleNextPage = (pageNum) => {
    const nextPageId = `page-${pageNum + 1}`;
    const nextPageElement = document.getElementById(nextPageId);
    if (nextPageElement) {
      nextPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReplayPage = (pageNum) => {
    // Replay is handled by replayKey in PageContainer
    // This is just a placeholder if we need additional logic
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
        currentPage={1}
        currentPage={1}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(1)}
        onNext={() => handleNextPage(1)}
      >
        {({ isInView, replayKey }) => <Page1 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 2 - The Birth */}
      <PageContainer
        id="page-2"
        backgroundColor={getBackgroundGradient(2)}
        onPageEnter={() => setCurrentPage(2)}
        currentPage={2}
        currentPage={2}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(2)}
        onNext={() => handleNextPage(2)}
      >
        {({ isInView, replayKey }) => <Page2 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 3 - Journey Through Space */}
      <PageContainer
        id="page-3"
        backgroundColor={getBackgroundGradient(3)}
        onPageEnter={() => setCurrentPage(3)}
        currentPage={3}
        currentPage={3}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(3)}
        onNext={() => handleNextPage(3)}
      >
        {({ isInView, replayKey }) => <Page3 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 4 - First Contact */}
      <PageContainer
        id="page-4"
        backgroundColor={getBackgroundGradient(4)}
        onPageEnter={() => setCurrentPage(4)}
        currentPage={4}
        currentPage={4}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(4)}
        onNext={() => handleNextPage(4)}
      >
        {({ isInView, replayKey }) => <Page4 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 5 - Guided to the Poles */}
      <PageContainer
        id="page-5"
        backgroundColor={getBackgroundGradient(5)}
        onPageEnter={() => setCurrentPage(5)}
        currentPage={5}
        currentPage={5}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(5)}
        onNext={() => handleNextPage(5)}
      >
        {({ isInView, replayKey }) => <Page5 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 6 - Aurora Borealis Born */}
      <PageContainer
        id="page-6"
        backgroundColor={getBackgroundGradient(6)}
        onPageEnter={() => setCurrentPage(6)}
        currentPage={6}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(6)}
        onNext={() => handleNextPage(6)}
      >
        {({ isInView, replayKey }) => <Page6 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 7 - Ancient Wonder: Vikings */}
      <PageContainer
        id="page-7"
        backgroundColor={getBackgroundGradient(7)}
        onPageEnter={() => setCurrentPage(7)}
        currentPage={7}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(7)}
        onNext={() => handleNextPage(7)}
      >
        {({ isInView, replayKey }) => <Page7 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 8 - Ancient Wonder: Indigenous Cultures */}
      <PageContainer
        id="page-8"
        backgroundColor={getBackgroundGradient(8)}
        onPageEnter={() => setCurrentPage(8)}
        currentPage={8}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(8)}
        onNext={() => handleNextPage(8)}
      >
        {({ isInView, replayKey }) => <Page8 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 9 - Humans Evolve */}
      <PageContainer
        id="page-9"
        backgroundColor={getBackgroundGradient(9)}
        onPageEnter={() => setCurrentPage(9)}
        currentPage={9}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(9)}
        onNext={() => handleNextPage(9)}
      >
        {({ isInView, replayKey }) => <Page9 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 10 - 1859 Carrington Event */}
      <PageContainer
        id="page-10"
        backgroundColor={getBackgroundGradient(10)}
        onPageEnter={() => setCurrentPage(10)}
        currentPage={10}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(10)}
        onNext={() => handleNextPage(10)}
      >
        {({ isInView, replayKey }) => <Page10 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 11 - Telegraph Chaos */}
      <PageContainer
        id="page-11"
        backgroundColor={getBackgroundGradient(11)}
        onPageEnter={() => setCurrentPage(11)}
        currentPage={11}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(11)}
        onNext={() => handleNextPage(11)}
      >
        {({ isInView, replayKey }) => <Page11 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 12 - The Technological Explosion */}
      <PageContainer
        id="page-12"
        backgroundColor={getBackgroundGradient(12)}
        onPageEnter={() => setCurrentPage(12)}
        currentPage={12}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(12)}
        onNext={() => handleNextPage(12)}
      >
        {({ isInView, replayKey }) => <Page12 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 13 - Modern CME Strike */}
      <PageContainer
        id="page-13"
        backgroundColor={getBackgroundGradient(13)}
        onPageEnter={() => setCurrentPage(13)}
        currentPage={13}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(13)}
        onNext={() => handleNextPage(13)}
      >
        {({ isInView, replayKey }) => <Page13 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 14 - Technology Fails */}
      <PageContainer
        id="page-14"
        backgroundColor={getBackgroundGradient(14)}
        onPageEnter={() => setCurrentPage(14)}
        currentPage={14}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(14)}
        onNext={() => handleNextPage(14)}
      >
        {({ isInView, replayKey }) => <Page14 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 15 - Human Fear */}
      <PageContainer
        id="page-15"
        backgroundColor={getBackgroundGradient(15)}
        onPageEnter={() => setCurrentPage(15)}
        currentPage={15}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(15)}
        onNext={() => handleNextPage(15)}
      >
        {({ isInView, replayKey }) => <Page15 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 16 - Fiery's Confusion */}
      <PageContainer
        id="page-16"
        backgroundColor={getBackgroundGradient(16)}
        onPageEnter={() => setCurrentPage(16)}
        currentPage={16}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(16)}
        onNext={() => handleNextPage(16)}
      >
        {({ isInView, replayKey }) => <Page16 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 17 - Scientists Observe */}
      <PageContainer
        id="page-17"
        backgroundColor={getBackgroundGradient(17)}
        onPageEnter={() => setCurrentPage(17)}
        currentPage={17}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(17)}
        onNext={() => handleNextPage(17)}
      >
        {({ isInView, replayKey }) => <Page17 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 18 - Early Warning Systems */}
      <PageContainer
        id="page-18"
        backgroundColor={getBackgroundGradient(18)}
        onPageEnter={() => setCurrentPage(18)}
        currentPage={18}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(18)}
        onNext={() => handleNextPage(18)}
      >
        {({ isInView, replayKey }) => <Page18 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 19 - Hardened Satellites */}
      <PageContainer
        id="page-19"
        backgroundColor={getBackgroundGradient(19)}
        onPageEnter={() => setCurrentPage(19)}
        currentPage={19}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(19)}
        onNext={() => handleNextPage(19)}
      >
        {({ isInView, replayKey }) => <Page19 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 20 - Protected Power Grids */}
      <PageContainer
        id="page-20"
        backgroundColor={getBackgroundGradient(20)}
        onPageEnter={() => setCurrentPage(20)}
        currentPage={20}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(20)}
        onNext={() => handleNextPage(20)}
      >
        {({ isInView, replayKey }) => <Page20 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 21 - Astronaut Safety */}
      <PageContainer
        id="page-21"
        backgroundColor={getBackgroundGradient(21)}
        onPageEnter={() => setCurrentPage(21)}
        currentPage={21}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(21)}
        onNext={() => handleNextPage(21)}
      >
        {({ isInView, replayKey }) => <Page21 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 22 - Communication Backups */}
      <PageContainer
        id="page-22"
        backgroundColor={getBackgroundGradient(22)}
        onPageEnter={() => setCurrentPage(22)}
        currentPage={22}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(22)}
        onNext={() => handleNextPage(22)}
      >
        {({ isInView, replayKey }) => <Page22 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 23 - Infrastructure Resilience */}
      <PageContainer
        id="page-23"
        backgroundColor={getBackgroundGradient(23)}
        onPageEnter={() => setCurrentPage(23)}
        currentPage={23}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(23)}
        onNext={() => handleNextPage(23)}
      >
        {({ isInView, replayKey }) => <Page23 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 24 - Prepared Aurora */}
      <PageContainer
        id="page-24"
        backgroundColor={getBackgroundGradient(24)}
        onPageEnter={() => setCurrentPage(24)}
        currentPage={24}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(24)}
        onNext={() => handleNextPage(24)}
      >
        {({ isInView, replayKey }) => <Page24 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 25 - Scientists Dream */}
      <PageContainer
        id="page-25"
        backgroundColor={getBackgroundGradient(25)}
        onPageEnter={() => setCurrentPage(25)}
        currentPage={25}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(25)}
        onNext={() => handleNextPage(25)}
      >
        {({ isInView, replayKey }) => <Page25 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 26 - Space Collectors Concept */}
      <PageContainer
        id="page-26"
        backgroundColor={getBackgroundGradient(26)}
        onPageEnter={() => setCurrentPage(26)}
        currentPage={26}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(26)}
        onNext={() => handleNextPage(26)}
      >
        {({ isInView, replayKey }) => <Page26 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 27 - Magnetic Energy Capture */}
      <PageContainer
        id="page-27"
        backgroundColor={getBackgroundGradient(27)}
        onPageEnter={() => setCurrentPage(27)}
        currentPage={27}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(27)}
        onNext={() => handleNextPage(27)}
      >
        {({ isInView, replayKey }) => <Page27 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 28 - Future Vision (2075) */}
      <PageContainer
        id="page-28"
        backgroundColor={getBackgroundGradient(28)}
        onPageEnter={() => setCurrentPage(28)}
        currentPage={28}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(28)}
        onNext={() => handleNextPage(28)}
      >
        {({ isInView, replayKey }) => <Page28 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 29 - Partnership */}
      <PageContainer
        id="page-29"
        backgroundColor={getBackgroundGradient(29)}
        onPageEnter={() => setCurrentPage(29)}
        currentPage={29}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(29)}
        onNext={() => handleNextPage(29)}
      >
        {({ isInView, replayKey }) => <Page29 key={replayKey} isInView={isInView} />}
      </PageContainer>

      {/* Page 30 - Inspirational Ending */}
      <PageContainer
        id="page-30"
        backgroundColor={getBackgroundGradient(30)}
        onPageEnter={() => setCurrentPage(30)}
        currentPage={30}
        totalPages={totalPages}
        onReplay={() => handleReplayPage(30)}
        onNext={() => handleNextPage(30)}
      >
        {({ isInView, replayKey }) => <Page30 key={replayKey} isInView={isInView} />}
      </PageContainer>

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
