
import React from 'react';
import { Difficulty, type DifficultyConfig } from '../types';
import { DIFFICULTIES } from '../constants';

interface DifficultyCardProps {
  difficulty: Difficulty;
  config: DifficultyConfig;
  onClick: (difficulty: Difficulty) => void;
}

const DifficultyCard: React.FC<DifficultyCardProps> = ({ difficulty, config, onClick }) => {
  return (
    <button
      onClick={() => onClick(difficulty)}
      className={`bg-gray-900/70 border-2 ${config.color} rounded-lg p-6 w-full max-w-sm text-white text-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:shadow-2xl hover:shadow-red-900/30`}
    >
      <h3 className="text-4xl font-bold mb-2">{config.label}</h3>
      <div className="text-gray-300">
        <p>制限時間: {config.timeLimit}秒</p>
        <p>目標スコア: {config.targetScore.toLocaleString()}点</p>
      </div>
    </button>
  );
};

interface ModeSelectScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({ onSelectDifficulty, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
       <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tavern/1200/800')] bg-cover bg-center opacity-20 blur-sm"></div>
       <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-8">難易度を選択</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map(d => (
            <DifficultyCard key={d} difficulty={d} config={DIFFICULTIES[d]} onClick={onSelectDifficulty} />
          ))}
        </div>
        <button onClick={onBack} className="mt-12 text-gray-400 hover:text-white transition-colors duration-200">
            &larr; タイトルへ戻る
        </button>
      </div>
    </div>
  );
};

export default ModeSelectScreen;
