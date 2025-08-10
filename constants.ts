import { Difficulty, type DifficultyConfig, type ModeConfig, type Vessel } from './types';

export const SAKURA_PETAL_COUNT = 20;

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: { label: "易", timeLimit: 60, targetScore: 2800, color: "border-green-400", bonusPerSecond: 25 },
  [Difficulty.Normal]: { label: "並", timeLimit: 50, targetScore: 3290, color: "border-blue-400", bonusPerSecond: 50 },
  [Difficulty.Hard]: { label: "難", timeLimit: 40, targetScore: 3640, color: "border-red-500", bonusPerSecond: 75 },
};

export const MODES: Record<Difficulty, ModeConfig> = {
  [Difficulty.Easy]: { tolerance: 0.05, speed: 30, showTicks: true, showNumbers: true, showTarget: true },
  [Difficulty.Normal]: { tolerance: 0.03, speed: 50, showTicks: true, showNumbers: true, showTarget: true },
  [Difficulty.Hard]: { tolerance: 0.02, speed: 70, showTicks: false, showNumbers: false, showTarget: false },
};

export const VESSELS: Vessel[] = [
  { cap: 20, base: 20, image: "https://picsum.photos/seed/sake1/100/200" },
  { cap: 40, base: 40, image: "https://picsum.photos/seed/sake2/100/200" },
  { cap: 60, base: 60, image: "https://picsum.photos/seed/sake3/100/200" },
  { cap: 80, base: 80, image: "https://picsum.photos/seed/sake4/100/200" },
  { cap: 100, base: 100, image: "https://picsum.photos/seed/sake5/100/200" },
];

export const STORY_DIALOGUES: string[] = [
  "ふふ…お酌してくれるの？あなたの手から注がれるお酒…格別ね。…あら、顔が赤いわよ？そんなに緊張して、私を酔わせるつもり？それとも自分が酔いたいのかしら。",
  "ねえ知ってる？いま、この酒場では…私のNFTオーナーを決めるために、あなた達が取り合っているらしいわ。ふふ…どちらが勝つのか、楽しみにしているの。",
  "あら、来てくれたのね。最近ちょっと弱気でね…でも、あなたみたいなお得意様が励ましに来てくれると、また頑張れそう。今夜もゆっくりしていってちょうだい。",
];

export const RESULT_DIALOGUES: Record<Difficulty, { achieve: string; fail: string }> = {
  [Difficulty.Easy]: {
    achieve: "ふふ…その調子なら、もっと強くなれるわねぇ…楽しみにしているわ。",
    fail: "まだまだ…これからだわ。焦らず…ゆっくりと、鍛えなさい。",
  },
  [Difficulty.Normal]: {
    achieve: "ようやく…一人前になれたかしら。けれど、油断は…禁物よ。",
    fail: "惜しいわねぇ…あと一歩だったのに。その悔しさ…忘れないでね。",
  },
  [Difficulty.Hard]: {
    achieve: "よくやったわ…ほんの少しだけ、褒めてあげる。だけど…もっと上を目指せるはずよ。",
    fail: "ふふ…この壁を越えてこそ、本物になれるの。逃げずに…挑みなさい。",
  },
};