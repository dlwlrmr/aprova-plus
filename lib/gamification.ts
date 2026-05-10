/**
 * Sistema de Gamificação do Aprova+
 * Medalhas, níveis, conquistas e recompensas
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface UserLevel {
  level: number;
  name: string;
  xpRequired: number;
  xpTotal: number;
  color: string;
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

// Níveis do usuário
export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    name: 'Iniciante Disciplinado',
    xpRequired: 0,
    xpTotal: 0,
    color: '#93c5fd',
    icon: '🌱',
  },
  {
    level: 2,
    name: 'Estudante Dedicado',
    xpRequired: 500,
    xpTotal: 500,
    color: '#60a5fa',
    icon: '📚',
  },
  {
    level: 3,
    name: 'Mestre da Revisão',
    xpRequired: 1500,
    xpTotal: 2000,
    color: '#3b82f6',
    icon: '🎓',
  },
  {
    level: 4,
    name: 'Guerreiro Anti-Procrastinação',
    xpRequired: 3000,
    xpTotal: 5000,
    color: '#0ea5e9',
    icon: '⚡',
  },
  {
    level: 5,
    name: 'Lenda do Concurso',
    xpRequired: 5000,
    xpTotal: 10000,
    color: '#06b6d4',
    icon: '👑',
  },
];

// Conquistas disponíveis
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro dia de estudos',
    icon: '🎯',
  },
  {
    id: 'streak_7',
    name: '7 Dias Seguidos',
    description: 'Mantenha uma sequência de 7 dias estudando',
    icon: '🔥',
  },
  {
    id: 'streak_30',
    name: '30 Dias de Ouro',
    description: 'Estude 30 dias consecutivos',
    icon: '✨',
  },
  {
    id: 'streak_100',
    name: 'Lenda Imortal',
    description: 'Atinja 100 dias de sequência',
    icon: '👑',
  },
  {
    id: 'questions_50',
    name: 'Questionador',
    description: 'Responda 50 questões',
    icon: '❓',
  },
  {
    id: 'questions_500',
    name: 'Mestre das Questões',
    description: 'Responda 500 questões',
    icon: '🧠',
  },
  {
    id: 'perfect_day',
    name: 'Dia Perfeito',
    description: 'Complete todas as tarefas do dia',
    icon: '⭐',
  },
  {
    id: 'focus_mode',
    name: 'Guerreiro do Foco',
    description: 'Complete 5 sessões de Pomodoro',
    icon: '🎯',
  },
  {
    id: 'notes_master',
    name: 'Mestre de Anotações',
    description: 'Crie 50 anotações',
    icon: '📝',
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Estude antes das 6 da manhã',
    icon: '🌙',
  },
  {
    id: 'night_owl',
    name: 'Coruja Noturna',
    description: 'Estude depois das 22h',
    icon: '🦉',
  },
  {
    id: 'consistency',
    name: 'A Constância Aprova',
    description: 'Estude pelo menos 1 hora por dia durante 7 dias',
    icon: '💪',
  },
];

// Medalhas especiais
export const BADGES: Badge[] = [
  {
    id: 'first_medal',
    title: 'Primeira Medalha',
    description: 'Desbloqueie sua primeira conquista',
    icon: '🥉',
    rarity: 'common',
  },
  {
    id: 'golden_streak',
    title: 'Sequência de Ouro',
    description: 'Mantenha 14 dias de sequência',
    icon: '🥇',
    rarity: 'rare',
  },
  {
    id: 'platinum_streak',
    title: 'Sequência de Platina',
    description: 'Mantenha 60 dias de sequência',
    icon: '💎',
    rarity: 'epic',
  },
  {
    id: 'eternal_legend',
    title: 'Lenda Eterna',
    description: 'Desbloqueie todas as conquistas',
    icon: '🌟',
    rarity: 'legendary',
  },
];

/**
 * Calcular XP ganho por ação
 */
export function calculateXP(action: string, value?: number): number {
  const xpMap: Record<string, number> = {
    complete_task: 10,
    answer_question: 5,
    complete_pomodoro: 15,
    create_note: 8,
    complete_day: 50,
    complete_week: 200,
    complete_month: 500,
  };

  return xpMap[action] || 0;
}

/**
 * Obter nível baseado em XP total
 */
export function getLevelFromXP(totalXP: number): UserLevel {
  let currentLevel = USER_LEVELS[0];

  for (const level of USER_LEVELS) {
    if (totalXP >= level.xpTotal) {
      currentLevel = level;
    } else {
      break;
    }
  }

  return currentLevel;
}

/**
 * Calcular progresso para próximo nível
 */
export function getProgressToNextLevel(
  totalXP: number
): { current: number; next: number; percentage: number } {
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevelIndex = USER_LEVELS.findIndex((l) => l.level === currentLevel.level) + 1;

  if (nextLevelIndex >= USER_LEVELS.length) {
    return { current: totalXP, next: totalXP, percentage: 100 };
  }

  const nextLevel = USER_LEVELS[nextLevelIndex];
  const xpInCurrentLevel = totalXP - currentLevel.xpTotal;
  const xpNeededForNextLevel = nextLevel.xpRequired;
  const percentage = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return {
    current: xpInCurrentLevel,
    next: xpNeededForNextLevel,
    percentage,
  };
}

/**
 * Verificar se uma conquista foi desbloqueada
 */
export function checkAchievementUnlock(
  achievementId: string,
  stats: {
    streak: number;
    questionsAnswered: number;
    tasksCompleted: number;
    pomodoroSessions: number;
    notesCreated: number;
    totalHours: number;
    perfectDays: number;
  }
): boolean {
  const checks: Record<string, boolean> = {
    first_day: stats.tasksCompleted >= 1,
    streak_7: stats.streak >= 7,
    streak_30: stats.streak >= 30,
    streak_100: stats.streak >= 100,
    questions_50: stats.questionsAnswered >= 50,
    questions_500: stats.questionsAnswered >= 500,
    perfect_day: stats.perfectDays >= 1,
    focus_mode: stats.pomodoroSessions >= 5,
    notes_master: stats.notesCreated >= 50,
    early_bird: false, // Verificar hora do dia
    night_owl: false, // Verificar hora do dia
    consistency: stats.totalHours >= 7, // 1 hora por dia durante 7 dias
  };

  return checks[achievementId] || false;
}

/**
 * Gerar mensagem de desbloqueio de conquista
 */
export function getAchievementUnlockMessage(achievementId: string): string {
  const messages: Record<string, string> = {
    first_day: '🎉 Parabéns! Você deu o primeiro passo!',
    streak_7: '🔥 Incrível! 7 dias de sequência!',
    streak_30: '✨ Você é uma lenda! 30 dias!',
    streak_100: '👑 Imortal! 100 dias de sequência!',
    questions_50: '❓ Você respondeu 50 questões!',
    questions_500: '🧠 Mestre! 500 questões respondidas!',
    perfect_day: '⭐ Dia perfeito! Todas as tarefas concluídas!',
    focus_mode: '🎯 Guerreiro do foco! 5 Pomodoros!',
    notes_master: '📝 50 anotações criadas!',
    early_bird: '🌙 Madrugador! Estudando cedo!',
    night_owl: '🦉 Coruja noturna! Estudando à noite!',
    consistency: '💪 A constância aprova! 7 dias consistentes!',
  };

  return messages[achievementId] || '🎉 Conquista desbloqueada!';
}

/**
 * Obter cor baseada em raridade de medalha
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  };

  return colors[rarity] || '#9ca3af';
}
