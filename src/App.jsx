import React, { useState } from 'react';
import Header from './components/Header';
import SelectionMenu from './components/SelectionMenu';
import GameScene from './components/GameScene';
import ResultModal from './components/ResultModal';
import { fortuneDatabase } from './data/fortuneDatabase';

function App() {
  const [currentDeityKey, setCurrentDeityKey] = useState(null);
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectDeity = (key) => {
    setCurrentDeityKey(key);
  };

  const handleBack = () => {
    setCurrentDeityKey(null);
    setResult(null);
    setIsModalOpen(false);
  };

  const handleDrawComplete = (drawResult) => {
    setResult(drawResult);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const currentDeity = currentDeityKey ? fortuneDatabase[currentDeityKey] : null;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Smoke */}
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-30 flex justify-center gap-20">
        <div className="smoke-particle" style={{ left: '20%', animationDuration: '5s', animationDelay: '0s' }}></div>
        <div className="smoke-particle" style={{ left: '50%', animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="smoke-particle" style={{ left: '80%', animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      <Header showBack={!!currentDeityKey} onBack={handleBack} />

      {!currentDeityKey ? (
        <SelectionMenu onSelect={handleSelectDeity} />
      ) : (
        <GameScene deity={currentDeity} onDrawComplete={handleDrawComplete} />
      )}

      <ResultModal
        isOpen={isModalOpen}
        result={result}
        deityName={currentDeity?.name}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
