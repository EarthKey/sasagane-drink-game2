
import React, { useMemo } from 'react';
import { STORY_DIALOGUES } from '../constants';
import Button from '../components/Button';

interface StoryScreenProps {
  onBack: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ onBack }) => {
  const dialogue = useMemo(() => STORY_DIALOGUES[Math.floor(Math.random() * STORY_DIALOGUES.length)], []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/sasagane_story/800/1200')] bg-cover bg-center opacity-30"></div>
      <div className="relative z-10 max-w-2xl text-center bg-black/60 p-8 rounded-xl shadow-lg backdrop-blur-sm">
        <img src="https://picsum.photos/seed/sasagane_portrait/200/200" alt="Sasagane" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-red-800/50" />
        <p className="text-xl leading-relaxed mb-8 italic">
          "{dialogue}"
        </p>
        <Button onClick={onBack} variant="secondary">戻る</Button>
      </div>
    </div>
  );
};

export default StoryScreen;
