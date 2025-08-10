import React, { useState, useCallback, useEffect } from 'react';
import { type GameView, Difficulty } from './types';
import TitleScreen from './views/TitleScreen';
import StoryScreen from './views/StoryScreen';
import ModeSelectScreen from './views/ModeSelectScreen';
import GameScreen from './views/GameScreen';
import ResultModal from './components/ResultModal';
import SakuraPetal from './components/SakuraPetal';

const App: React.FC = () => {
  const [view, setView] = useState<GameView>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [gameResult, setGameResult] = useState<{ baseScore: number, timeBonus: number } | null>(null);

  const handleSelectDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setView('game');
  }, []);

  const handleGameEnd = useCallback((score: { baseScore: number, timeBonus: number }) => {
    setGameResult(score);
    setView('result');
  }, []);

  const handleRestart = useCallback((diff: Difficulty) => {
    setGameResult(null);
    setDifficulty(diff);
    setView('game');
  }, []);

  const handleBackToTitle = useCallback(() => {
    setGameResult(null);
    setView('title');
  }, []);
  
  const handleNavigate = (newView: GameView) => {
    setView(newView);
  }

  const renderView = () => {
    switch (view) {
      case 'title':
        return <TitleScreen onNavigate={(v) => handleNavigate(v)} />;
      case 'story':
        return <StoryScreen onBack={() => handleNavigate('title')} />;
      case 'mode':
        return <ModeSelectScreen onSelectDifficulty={handleSelectDifficulty} onBack={() => handleNavigate('title')} />;
      case 'game':
      case 'result': // Render GameScreen underneath ResultModal
        return <GameScreen difficulty={difficulty} onGameEnd={handleGameEnd} />;
      default:
        return <TitleScreen onNavigate={(v) => handleNavigate(v)} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#1a1a1a] text-white overflow-hidden relative">
        {Array.from({ length: SAKURA_PETAL_COUNT }).map((_, i) => <SakuraPetal key={i} />)}
        {renderView()}
        {view === 'result' && gameResult && (
            <ResultModal 
                difficulty={difficulty} 
                baseScore={gameResult.baseScore} 
                timeBonus={gameResult.timeBonus}
                onRestart={handleRestart}
                onBackToTitle={handleBackToTitle}
            />
        )}
    </div>
  );
};

export default App;