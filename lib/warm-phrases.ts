export const DAILY_PHRASES = [
  "Você está indo bem 💛",
  "Constância vale mais que perfeição.",
  "Seu futuro agradece cada minuto de hoje.",
  "Só mais um pouquinho hoje — você consegue.",
  "Cada página virada é um passo mais perto.",
  "Você não precisa ser perfeito, só precisa continuar.",
  "Pequenos avanços todos os dias constroem grandes conquistas.",
  "A aprovação começa aqui, agora, com você.",
  "Confie no processo. Você está no caminho certo.",
  "Hoje você escolheu seu futuro. Isso é muito.",
];

export const TASK_COMPLETED_PHRASES = [
  "Isso! Mais uma conquista no seu caminho! 🎉",
  "Você arrasou! Continue assim.",
  "Missão cumprida! Seu esforço está valendo.",
  "Excelente! Cada tarefa concluída te aproxima da aprovação.",
  "Que orgulho! Você está construindo algo incrível.",
  "Feito! Você é consistente, e isso faz toda a diferença.",
  "Mais uma! Você está em chamas hoje 🔥",
  "Perfeito! Seu futuro eu vai te agradecer.",
];

export const STREAK_MILESTONE_PHRASES: Record<number, string> = {
  3:  "3 dias seguidos! Você está criando um hábito poderoso 🔥",
  7:  "Uma semana inteira! Você é incrível 🏆",
  14: "Duas semanas de constância! Isso é dedicação de verdade.",
  30: "30 dias! Você transformou estudo em estilo de vida. Parabéns! 🌟",
  60: "60 dias! Você é uma máquina de aprovação. Impressionante! 💪",
};

export const TIRED_MODE_PHRASES = [
  "Tudo bem estar cansado. Você ainda apareceu — isso é o que importa. 💙",
  "Dias difíceis também contam. Vá no seu ritmo hoje.",
  "Você não precisa ser 100% hoje. 20% já é vitória.",
  "Cuide de você. Amanhã você volta mais forte.",
  "Descansar também faz parte do processo. Seja gentil consigo.",
];

export const NO_ACTIVITY_PHRASES = [
  "Sentimos sua falta! Que tal retomar hoje? 💛",
  "Seu plano está esperando por você. Vamos lá?",
  "Um passo pequeno hoje vale mais do que zero. Você consegue.",
  "A aprovação não espera, mas você pode recomeçar agora mesmo.",
];

export function getRandomDailyPhrase(): string {
  const today = new Date().getDay();
  return DAILY_PHRASES[today % DAILY_PHRASES.length];
}

export function getRandomTaskCompletedPhrase(): string {
  return TASK_COMPLETED_PHRASES[Math.floor(Math.random() * TASK_COMPLETED_PHRASES.length)];
}

export function getStreakMilestonePhrase(streak: number): string | null {
  return STREAK_MILESTONE_PHRASES[streak] ?? null;
}

export function getRandomTiredPhrase(): string {
  return TIRED_MODE_PHRASES[Math.floor(Math.random() * TIRED_MODE_PHRASES.length)];
}

export function getRandomNoActivityPhrase(): string {
  return NO_ACTIVITY_PHRASES[Math.floor(Math.random() * NO_ACTIVITY_PHRASES.length)];
}
