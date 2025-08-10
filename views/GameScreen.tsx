
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty } from '../types';
import { DIFFICULTIES, MODES, VESSELS } from '../constants';
import ResultModal from '../components/ResultModal';

const Countdown: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(5);
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      const timer = setTimeout(() => {
        setCount(-1);
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
      <div className="text-white text-9xl font-bold animate-ping-pong">
        {count > 0 ? count : 'START'}
      </div>
      <style>{`
        @keyframes ping-pong {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .animate-ping-pong { animation: ping-pong 1s ease-in-out; }
      `}</style>
    </div>
  );
};

interface Feedback {
  type: 'success' | 'fail';
  text: string;
}

const GameScreen: React.FC<{ difficulty: Difficulty; onGameEnd: (score: { baseScore: number, timeBonus: number }) => void; }> = ({ difficulty, onGameEnd }) => {
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'judging' | 'ended'>('countdown');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTIES[difficulty].timeLimit);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [vesselIndex, setVesselIndex] = useState(0);
  const [fill, setFill] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const vessel = VESSELS[vesselIndex];
  const modeConfig = MODES[difficulty];

  const pour = useCallback((timestamp: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      setFill(prevFill => {
        const newFill = prevFill + modeConfig.speed * deltaTime;
        return Math.min(newFill, vessel.cap * 1.5); // Allow overfilling
      });
    }
    lastTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(pour);
  }, [modeConfig.speed, vessel.cap]);

  const startPour = () => {
    if (phase !== 'playing') return;
    setIsPouring(true);
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(pour);
  };
  
  const stopPour = useCallback(() => {
    if (!isPouring) return;
    setIsPouring(false);
    if(requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setPhase('judging');
  }, [isPouring]);

  const handleGameEnd = useCallback((finalScore: number) => {
    setPhase('ended');
    const bonusPerSecond = DIFFICULTIES[difficulty].bonusPerSecond;
    const timeBonus = timeLeft > 0 ? timeLeft * bonusPerSecond : 0;
    onGameEnd({ baseScore: finalScore, timeBonus });
  }, [difficulty, onGameEnd, timeLeft]);

  // Main Game Timer
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (phase === 'playing' && timeLeft <= 0) {
      handleGameEnd(score);
    }
  }, [phase, timeLeft, handleGameEnd, score]);
  
  // Judging logic
  useEffect(() => {
    if (phase !== 'judging') return;

    const diff = Math.abs(fill - vessel.cap);
    const isSuccess = diff <= vessel.cap * modeConfig.tolerance;

    let scoreChange = 0;
    let feedbackText = '';
    
    if (isSuccess) {
      const comboBonus = 100 * combo;
      scoreChange = vessel.base + comboBonus;
      setScore(s => s + scoreChange);
      setCombo(c => c + 1);
      feedbackText = `Perfect! +${scoreChange.toLocaleString()}`;
      setFeedback({ type: 'success', text: feedbackText });
    } else {
      const missRatio = diff / vessel.cap;
      const penalty = Math.round(vessel.base * 0.5 * missRatio);
      scoreChange = -penalty;
      setScore(s => Math.max(0, s + scoreChange));
      setCombo(0);
      feedbackText = `Miss... -${penalty.toLocaleString()}`;
      setFeedback({ type: 'fail', text: feedbackText });
    }

    const timer = setTimeout(() => {
      setFeedback(null);
      if (vesselIndex < VESSELS.length - 1) {
        setVesselIndex(i => i + 1);
        setFill(0);
        setPhase('playing');
      } else {
        handleGameEnd(score + (isSuccess ? scoreChange : 0));
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, fill]);

  const fillPercentage = (fill / vessel.cap) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4 select-none" onMouseDown={startPour} onMouseUp={stopPour} onMouseLeave={stopPour} onTouchStart={startPour} onTouchEnd={stopPour}>
      {phase === 'countdown' && <Countdown onComplete={() => setPhase('playing')} />}
      
      <div className="absolute top-4 left-4 text-left bg-black/30 p-3 rounded-lg">
        <div className="text-2xl">Time: <span className="font-mono">{timeLeft}</span></div>
        <div className="text-2xl">Score: <span className="font-mono">{score.toLocaleString()}</span></div>
        {combo > 0 && <div className="text-xl text-yellow-300 animate-pulse">Combo: {combo}x</div>}
      </div>
      <div className="absolute top-4 right-4 text-right">
        Vessel {vesselIndex + 1} / {VESSELS.length}
      </div>
       <img src="https://picsum.photos/seed/sasagane_game/150/150" alt="Sasagane" className={`absolute bottom-4 right-4 w-36 h-36 transition-transform duration-300 ${feedback?.type === 'success' ? 'transform scale-110' : ''}`} />

      {feedback && (
        <div className={`absolute top-1/3 text-6xl font-bold animate-fade-out ${feedback.type === 'success' ? 'text-pink-300' : 'text-gray-400'}`}>
            {feedback.text}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="w-24 h-[60vh] bg-gray-800 border-4 border-gray-600 rounded-lg overflow-hidden relative">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-200 to-amber-400 transition-height duration-100"
            style={{ height: `${Math.min(fillPercentage, 100)}%` }}
          ></div>

          {modeConfig.showTarget && (
            <div className="absolute w-full h-1 bg-yellow-400 bottom-[100%]">
              <div className="absolute -left-4 w-4 h-1 bg-yellow-400"></div>
              <div className="absolute -right-4 w-4 h-1 bg-yellow-400"></div>
            </div>
          )}
          
          {modeConfig.showTicks && Array.from({ length: 10 }).map((_, i) => (
             <div key={i} className="absolute w-full h-px bg-gray-500" style={{bottom: `${(i+1)*10}%`}}></div>
          ))}

        </div>
        <div className="mt-4 text-xl">Capacity: {vessel.cap}</div>
        {modeConfig.showNumbers && <div className="text-lg font-mono">Fill: {fill.toFixed(1)}</div>}
      </div>
       <style>{`
        .animate-fade-out { animation: fadeOut 1.5s forwards; }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-50px); } }
      `}</style>
    </div>
  );
};

export default GameScreen;
