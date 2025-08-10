
import { Difficulty, type ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'sasagane_leaderboard';

const normalizeName = (name: string): string => {
  return name.normalize('NFKC').trim().toLowerCase();
};

const escapeHtml = (s: string): string => {
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m as keyof typeof escapeHtml.map]));
};
escapeHtml.map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};


export const getScores = (mode: Difficulty): ScoreEntry[] => {
  try {
    const allScores: ScoreEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    return allScores
      .filter(entry => entry.mode === mode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  } catch (error) {
    console.error("Failed to get scores from localStorage", error);
    return [];
  }
};

export const saveScore = async ({ name, score, mode }: { name: string; score: number; mode: Difficulty }): Promise<{ updated: boolean; message: string }> => {
  if (!name || name.length < 1 || name.length > 16) {
    return { updated: false, message: "名前は1～16文字で入力してください。" };
  }

  const norm = normalizeName(name);
  if (!norm) {
     return { updated: false, message: "無効な名前です。" };
  }

  try {
    const allScores: ScoreEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    const existingEntryIndex = allScores.findIndex(entry => entry.mode === mode && normalizeName(entry.name) === norm);

    if (existingEntryIndex !== -1) {
      if (score > allScores[existingEntryIndex].score) {
        // Update existing score
        allScores[existingEntryIndex] = { name: escapeHtml(name.trim()), score, mode, at: Date.now() };
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(allScores));
        return { updated: true, message: "ハイスコアを更新しました！" };
      } else {
        return { updated: false, message: "既存のスコアを超えられませんでした。" };
      }
    } else {
      // Add new score
      allScores.push({ name: escapeHtml(name.trim()), score, mode, at: Date.now() });
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(allScores));
      return { updated: true, message: "ランキングに登録しました！" };
    }
  } catch (error) {
    console.error("Failed to save score to localStorage", error);
    return { updated: false, message: "スコアの保存に失敗しました。" };
  }
};
