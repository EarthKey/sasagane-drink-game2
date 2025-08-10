
import React, { useState, useEffect, useMemo } from 'react';
import { Difficulty, type ScoreEntry } from '../types';
import { getScores, saveScore } from '../services/leaderboardService';
import { getHaiku } from '../services/geminiService';
import { DIFFICULTIES, RESULT_DIALOGUES } from '../constants';
import Button from './Button';

interface ResultModalProps {
  difficulty: Difficulty;
  baseScore: number;
  timeBonus: number;
  onRestart: (difficulty: Difficulty) => void;
  onBackToTitle: () => void;
}

const Leaderboard: React.FC<{ difficulty: Difficulty, finalScore: number }> = ({ difficulty, finalScore }) => {
  const [selectedTab, setSelectedTab] = useState<Difficulty>(difficulty);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setScores(getScores(selectedTab));
  }, [selectedTab]);

  const handleSaveScore = async () => {
    setIsSubmitting(true);
    setMessage('');
    const result = await saveScore({ name: playerName, score: finalScore, mode: difficulty });
    setMessage(result.message);
    if (result.updated) {
      setScores(getScores(difficulty)); // Refresh current tab scores
      setSelectedTab(difficulty); // Switch to the relevant tab
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full mt-4 bg-black/30 p-4 rounded-lg">
      <h3 className="text-2xl font-bold text-center text-yellow-300 mb-2">ランキング</h3>
      <div className="flex justify-center border-b border-gray-600 mb-2">
        {Object.values(Difficulty).map(d => (
          <button key={d} onClick={() => setSelectedTab(d)} className={`px-4 py-2 text-lg transition-colors duration-200 ${selectedTab === d ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400 hover:text-white'}`}>
            {DIFFICULTIES[d].label}
          </button>
        ))}
      </div>
      <div className="h-48 overflow-y-auto pr-2">
        <ol className="list-decimal list-inside text-white space-y-1">
          {scores.map((s, i) => (
            <li key={i} className={`flex justify-between items-center p-1 rounded ${i === 0 ? 'text-yellow-300' : ''}`}>
              <span className="truncate">{i + 1}. {s.name}</span>
              <span className="font-mono">{s.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="名前を入力 (1-16文字)"
          maxLength={16}
          className="w-full sm:w-auto flex-grow bg-gray-900/80 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <Button onClick={handleSaveScore} disabled={isSubmitting || !playerName.trim()} className="w-full sm:w-auto">
          {isSubmitting ? '保存中...' : 'スコアを保存'}
        </Button>
      </div>
      {message && <p className="text-center text-yellow-200 mt-2 text-sm">{message}</p>}
    </div>
  );
};

const ResultModal: React.FC<ResultModalProps> = ({ difficulty, baseScore, timeBonus, onRestart, onBackToTitle }) => {
  const finalScore = baseScore + timeBonus;
  const targetScore = DIFFICULTIES[difficulty].targetScore;
  const isSuccess = finalScore >= targetScore;
  const dialogue = isSuccess ? RESULT_DIALOGUES[difficulty].achieve : RESULT_DIALOGUES[difficulty].fail;

  const [haiku, setHaiku] = useState('');
  const [isLoadingHaiku, setIsLoadingHaiku] = useState(false);

  const handleGetHaiku = async () => {
    setIsLoadingHaiku(true);
    const generatedHaiku = await getHaiku(DIFFICULTIES[difficulty].label, finalScore, isSuccess);
    setHaiku(generatedHaiku);
    setIsLoadingHaiku(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/80 border-2 border-yellow-600/50 rounded-2xl shadow-2xl w-full max-w-2xl text-white p-6 relative overflow-hidden animate-fade-in">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-800/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-600/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            {isSuccess ? '達成' : '未達成'}
          </h2>
          <p className="text-center text-lg mb-4 italic">"{dialogue}"</p>
          
          <div className="bg-black/20 p-4 rounded-lg mb-4 text-center">
            <div className="text-xl">基本スコア: <span className="font-mono text-2xl text-yellow-300">{baseScore.toLocaleString()}</span></div>
            <div className="text-xl">時間ボーナス: <span className="font-mono text-2xl text-yellow-300">{timeBonus.toLocaleString()}</span></div>
            <hr className="my-2 border-gray-600"/>
            <div className="text-2xl font-bold">最終スコア: <span className="font-mono text-4xl text-yellow-200">{finalScore.toLocaleString()}</span></div>
            <div className="text-sm text-gray-400 mt-1">目標スコア: {targetScore.toLocaleString()}</div>
          </div>
          
          {!haiku && !isLoadingHaiku && (
             <div className="text-center my-4">
                <Button onClick={handleGetHaiku} variant="secondary">ささがねに一句詠んでもらう</Button>
            </div>
          )}
          {isLoadingHaiku && <p className="text-center my-4 text-yellow-200">ささがねが一句考えています...</p>}
          {haiku && <div className="my-4 p-3 bg-black/40 rounded-lg text-center text-xl italic text-yellow-100">"{haiku}"</div>}

          <Leaderboard difficulty={difficulty} finalScore={finalScore} />
          
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => onRestart(difficulty)}>もう一度 ({DIFFICULTIES[difficulty].label})</Button>
            <Button onClick={onBackToTitle} variant="secondary">タイトルへ</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
