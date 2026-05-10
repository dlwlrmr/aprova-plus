/**
 * Notificações Inteligentes e Emocionais
 * Mensagens motivacionais para aumentar retenção e conexão emocional
 */

export interface EmotionalNotification {
  id: string;
  title: string;
  body: string;
  emoji: string;
  type: 'motivation' | 'reminder' | 'achievement' | 'streak' | 'challenge';
  priority: 'low' | 'normal' | 'high';
  triggerTime?: string; // HH:mm format
}

/**
 * Notificações por contexto
 */
export const EMOTIONAL_NOTIFICATIONS = {
  // Notificações de lembrete
  reminders: [
    {
      id: 'reminder_morning',
      title: 'Bom dia! 🌅',
      body: 'Só 15 minutos hoje para manter sua sequência viva.',
      emoji: '☀️',
      type: 'reminder' as const,
      priority: 'normal' as const,
      triggerTime: '07:00',
    },
    {
      id: 'reminder_afternoon',
      title: 'Pausa para estudar 📚',
      body: 'Seu futuro agradece cada minuto de dedicação.',
      emoji: '⏰',
      type: 'reminder' as const,
      priority: 'normal' as const,
      triggerTime: '14:00',
    },
    {
      id: 'reminder_evening',
      title: 'Última chance do dia 🌙',
      body: 'Não deixe seu sonho esfriar. Estude agora!',
      emoji: '🔥',
      type: 'reminder' as const,
      priority: 'high' as const,
      triggerTime: '20:00',
    },
  ],

  // Notificações de motivação
  motivation: [
    {
      id: 'motivation_1',
      title: 'Você está indo muito bem! 💪',
      body: 'Cada dia de estudo te aproxima da aprovação.',
      emoji: '💪',
      type: 'motivation' as const,
      priority: 'normal' as const,
    },
    {
      id: 'motivation_2',
      title: 'Sua sequência está viva 🔥',
      body: 'Não quebra agora, você está no caminho certo!',
      emoji: '🔥',
      type: 'motivation' as const,
      priority: 'high' as const,
    },
    {
      id: 'motivation_3',
      title: 'A constância aprova ✨',
      body: 'Você é mais forte do que pensa. Continue!',
      emoji: '✨',
      type: 'motivation' as const,
      priority: 'normal' as const,
    },
    {
      id: 'motivation_4',
      title: 'Você já avançou muito! 📈',
      body: 'Olhe para trás e veja o quanto evoluiu.',
      emoji: '📈',
      type: 'motivation' as const,
      priority: 'normal' as const,
    },
    {
      id: 'motivation_5',
      title: 'Foco total! 🎯',
      body: 'Seus objetivos estão mais pertos do que nunca.',
      emoji: '🎯',
      type: 'motivation' as const,
      priority: 'normal' as const,
    },
  ],

  // Notificações de conquistas
  achievements: [
    {
      id: 'achievement_first_day',
      title: 'Parabéns! 🎉',
      body: 'Você completou seu primeiro dia. Que comece a jornada!',
      emoji: '🎉',
      type: 'achievement' as const,
      priority: 'high' as const,
    },
    {
      id: 'achievement_week',
      title: 'Uma semana inteira! 🌟',
      body: 'Você estudou 7 dias seguidos. Você é incrível!',
      emoji: '🌟',
      type: 'achievement' as const,
      priority: 'high' as const,
    },
    {
      id: 'achievement_month',
      title: 'Um mês de ouro! 👑',
      body: 'Parabéns por 30 dias de dedicação. Você é uma lenda!',
      emoji: '👑',
      type: 'achievement' as const,
      priority: 'high' as const,
    },
    {
      id: 'achievement_questions',
      title: 'Questionador! ❓',
      body: 'Você respondeu 50 questões. Seu conhecimento cresce!',
      emoji: '❓',
      type: 'achievement' as const,
      priority: 'normal' as const,
    },
  ],

  // Notificações de streak
  streak: [
    {
      id: 'streak_warning',
      title: 'Sua sequência está em risco! ⚠️',
      body: 'Você não estudou hoje. Não deixe queimar!',
      emoji: '⚠️',
      type: 'streak' as const,
      priority: 'high' as const,
    },
    {
      id: 'streak_saved',
      title: 'Sequência salva! 🔥',
      body: 'Você manteve viva sua sequência de estudos!',
      emoji: '🔥',
      type: 'streak' as const,
      priority: 'high' as const,
    },
    {
      id: 'streak_milestone',
      title: 'Novo recorde! 🚀',
      body: 'Você bateu seu recorde pessoal de sequência!',
      emoji: '🚀',
      type: 'streak' as const,
      priority: 'high' as const,
    },
  ],

  // Notificações de desafio
  challenge: [
    {
      id: 'challenge_daily',
      title: 'Desafio do dia! 💪',
      body: 'Responda 10 questões hoje e ganhe bônus de XP!',
      emoji: '💪',
      type: 'challenge' as const,
      priority: 'normal' as const,
    },
    {
      id: 'challenge_pomodoro',
      title: 'Desafio Pomodoro! ⏱️',
      body: 'Complete 5 sessões de Pomodoro e desbloqueie uma medalha!',
      emoji: '⏱️',
      type: 'challenge' as const,
      priority: 'normal' as const,
    },
    {
      id: 'challenge_notes',
      title: 'Desafio de Anotações! 📝',
      body: 'Crie 5 anotações hoje e ganhe pontos bônus!',
      emoji: '📝',
      type: 'challenge' as const,
      priority: 'normal' as const,
    },
  ],
};

/**
 * Obter notificação aleatória por tipo
 */
export function getRandomNotification(
  type: 'motivation' | 'reminders' | 'achievement' | 'streak' | 'challenge'
): EmotionalNotification {
  const key = type === 'reminders' ? 'reminders' : type === 'achievement' ? 'achievements' : type;
  const notifications = (EMOTIONAL_NOTIFICATIONS as any)[key] || [];
  return notifications[Math.floor(Math.random() * notifications.length)];
}

/**
 * Obter notificação contextual baseada em ações do usuário
 */
export function getContextualNotification(context: {
  lastStudyTime?: number;
  streak?: number;
  questionsAnswered?: number;
  pomodoroSessions?: number;
  notesCreated?: number;
  perfectDays?: number;
}): EmotionalNotification | null {
  const now = Date.now();
  const lastStudyTime = context.lastStudyTime || 0;
  const timeSinceLastStudy = now - lastStudyTime;
  const hoursWithoutStudy = timeSinceLastStudy / (1000 * 60 * 60);

  // Se não estudou hoje
  if (hoursWithoutStudy > 24 && context.streak && context.streak > 0) {
    return EMOTIONAL_NOTIFICATIONS.streak[0]; // Streak warning
  }

  // Se estudou hoje
  if (hoursWithoutStudy < 24 && context.streak && context.streak > 0) {
    return EMOTIONAL_NOTIFICATIONS.streak[1]; // Streak saved
  }

  // Se atingiu milestone de streak
  if (context.streak && context.streak % 7 === 0) {
    return EMOTIONAL_NOTIFICATIONS.streak[2]; // Streak milestone
  }

  // Se respondeu muitas questões
  if (context.questionsAnswered && context.questionsAnswered % 50 === 0) {
    return EMOTIONAL_NOTIFICATIONS.achievements[3]; // Questions achievement
  }

  // Retornar notificação aleatória de motivação
  return getRandomNotification('motivation');
}

/**
 * Gerar mensagem personalizada baseada em dados do usuário
 */
export function generatePersonalizedMessage(userData: {
  name?: string;
  streak?: number;
  level?: number;
  concurso?: string;
}): string {
  const messages = [
    `${userData.name || 'Estudante'}, sua sequência de ${userData.streak || 0} dias é incrível! 🔥`,
    `Você está no nível ${userData.level || 1}! Continue assim! 📈`,
    `${userData.concurso || 'Seu concurso'} está cada vez mais perto! 🎯`,
    `Cada minuto de estudo te aproxima da aprovação! 💪`,
    `Você é mais forte do que pensa! Continue! ✨`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Obter horário recomendado para notificação
 */
export function getRecommendedNotificationTime(userPreference?: string): string {
  if (userPreference) return userPreference;

  // Horários padrão: manhã (7h), tarde (14h), noite (20h)
  const hour = new Date().getHours();

  if (hour < 12) return '07:00'; // Manhã
  if (hour < 18) return '14:00'; // Tarde
  return '20:00'; // Noite
}

/**
 * Verificar se é hora de enviar notificação
 */
export function shouldSendNotification(
  lastNotificationTime: number,
  minIntervalMinutes = 60
): boolean {
  const now = Date.now();
  const timeSinceLastNotification = now - lastNotificationTime;
  const minutesSinceLastNotification = timeSinceLastNotification / (1000 * 60);

  return minutesSinceLastNotification >= minIntervalMinutes;
}

/**
 * Categorizar notificação por urgência
 */
export function getNotificationUrgency(notification: EmotionalNotification): number {
  const urgencyMap = {
    low: 1,
    normal: 2,
    high: 3,
  };

  return urgencyMap[notification.priority] || 2;
}
