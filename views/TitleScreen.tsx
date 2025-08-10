
import React from 'react';
import Button from '../components/Button';

interface TitleScreenProps {
  onNavigate: (view: 'mode' | 'story') => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-4">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tavern/1200/800')] bg-cover bg-center opacity-20 blur-sm"></div>
      <div className="relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-100 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-2" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          ささがね
        </h1>
        <h2 className="text-3xl md:text-4xl text-white mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
          晩酌ゲーム
        </h2>
        <div className="space-y-4">
          <Button onClick={() => onNavigate('mode')} className="w-64">
            始める
          </Button>
          <Button onClick={() => onNavigate('story')} variant="secondary" className="w-64">
            あらすじ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
