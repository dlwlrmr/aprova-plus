import { supabase } from './supabase';

/**
 * Sistema de "Questão do Dia"
 * Questão única por dia, expansível e com histórico
 */

export interface DailyQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  questionId: string;
  concurso: string;
  subject: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  completed: boolean;
  correct: boolean | null;
  userAnswer: string | null;
  completedAt?: number;
}

export interface QuestionStats {
  totalAnswered: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  streak: number;
  lastAnsweredDate?: string;
}

/**
 * Obter questão do dia
 */
export async function getDailyQuestion(concurso: string): Promise<DailyQuestion | null> {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Verificar se já existe questão do dia
    const { data: existingQuestion, error: fetchError } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('date', today)
      .eq('concurso', concurso)
      .single();

    if (existingQuestion) {
      return existingQuestion;
    }

    // Se não existe, criar uma nova
    // Selecionar questão aleatória do banco
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('concurso', concurso)
      .order('RANDOM()')
      .limit(1);

    if (questionsError || !questions || questions.length === 0) {
      console.error('Erro ao buscar questão aleatória:', questionsError);
      return null;
    }

    const questionId = questions[0].id;

    // Obter detalhes da questão
    const { data: questionData, error: detailError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (detailError || !questionData) {
      console.error('Erro ao buscar detalhes da questão:', detailError);
      return null;
    }

    // Criar entrada de questão do dia
    const dailyQuestion: DailyQuestion = {
      id: `${today}-${concurso}`,
      date: today,
      questionId,
      concurso,
      subject: questionData.subject || 'Geral',
      difficulty: questionData.difficulty || 'médio',
      completed: false,
      correct: null,
      userAnswer: null,
    };

    // Salvar no Supabase
    const { error: insertError } = await supabase
      .from('daily_questions')
      .insert([dailyQuestion]);

    if (insertError) {
      console.error('Erro ao salvar questão do dia:', insertError);
      return null;
    }

    return dailyQuestion;
  } catch (error) {
    console.error('Erro ao obter questão do dia:', error);
    return null;
  }
}

/**
 * Responder questão do dia
 */
export async function answerDailyQuestion(
  dailyQuestionId: string,
  userAnswer: string,
  correct: boolean,
  userId: string
): Promise<boolean> {
  try {
    const completedAt = Date.now();

    const { error } = await supabase
      .from('daily_questions')
      .update({
        completed: true,
        correct,
        userAnswer,
        completedAt,
      })
      .eq('id', dailyQuestionId);

    if (error) {
      console.error('Erro ao responder questão do dia:', error);
      return false;
    }

    // Registrar estatísticas
    await recordQuestionStats(userId, correct);

    return true;
  } catch (error) {
    console.error('Erro ao registrar resposta:', error);
    return false;
  }
}

/**
 * Registrar estatísticas de questões respondidas
 */
export async function recordQuestionStats(userId: string, correct: boolean): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Obter estatísticas do dia
    const { data: todayStats, error: fetchError } = await supabase
      .from('question_stats')
      .select('*')
      .eq('userId', userId)
      .eq('date', today)
      .single();

    if (todayStats) {
      // Atualizar estatísticas do dia
      const newCorrect = correct ? todayStats.correct + 1 : todayStats.correct;
      const newIncorrect = !correct ? todayStats.incorrect + 1 : todayStats.incorrect;
      const newTotal = newCorrect + newIncorrect;
      const accuracy = (newCorrect / newTotal) * 100;

      await supabase
        .from('question_stats')
        .update({
          correct: newCorrect,
          incorrect: newIncorrect,
          accuracy,
        })
        .eq('userId', userId)
        .eq('date', today);
    } else {
      // Criar novo registro
      const newCorrect = correct ? 1 : 0;
      const newIncorrect = !correct ? 1 : 0;

      await supabase
        .from('question_stats')
        .insert([
          {
            userId,
            date: today,
            correct: newCorrect,
            incorrect: newIncorrect,
            accuracy: correct ? 100 : 0,
          },
        ]);
    }
  } catch (error) {
    console.error('Erro ao registrar estatísticas:', error);
  }
}

/**
 * Obter estatísticas de questões do usuário
 */
export async function getUserQuestionStats(userId: string): Promise<QuestionStats> {
  try {
    const { data: stats, error } = await supabase
      .from('question_stats')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false });

    if (error || !stats) {
      return {
        totalAnswered: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        streak: 0,
      };
    }

    const totalAnswered = stats.reduce((sum, s) => sum + (s.correct + s.incorrect), 0);
    const correct = stats.reduce((sum, s) => sum + s.correct, 0);
    const incorrect = stats.reduce((sum, s) => sum + s.incorrect, 0);
    const accuracy = totalAnswered > 0 ? (correct / totalAnswered) * 100 : 0;

    // Calcular streak (dias consecutivos respondendo questão do dia)
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < stats.length; i++) {
      const statDate = new Date(stats[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (
        statDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]
      ) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalAnswered,
      correct,
      incorrect,
      accuracy,
      streak,
      lastAnsweredDate: stats[0]?.date,
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      totalAnswered: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0,
      streak: 0,
    };
  }
}

/**
 * Obter histórico de questões do dia respondidas
 */
export async function getDailyQuestionHistory(
  userId: string,
  limit = 30
): Promise<DailyQuestion[]> {
  try {
    const { data, error } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('userId', userId)
      .eq('completed', true)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}

/**
 * Verificar se usuário respondeu questão do dia
 */
export async function hasAnsweredTodayQuestion(
  userId: string,
  concurso: string
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_questions')
      .select('completed')
      .eq('date', today)
      .eq('concurso', concurso)
      .eq('userId', userId)
      .single();

    if (error) {
      return false;
    }

    return data?.completed || false;
  } catch (error) {
    return false;
  }
}

/**
 * Obter streak de questões do dia
 */
export async function getDailyQuestionStreak(userId: string): Promise<number> {
  try {
    const stats = await getUserQuestionStats(userId);
    return stats.streak;
  } catch (error) {
    console.error('Erro ao obter streak:', error);
    return 0;
  }
}

/**
 * Obter questões favoritas do usuário
 */
export async function getUserFavoriteQuestions(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('favorite_questions')
      .select('questionId, questions(*)')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Erro ao obter favoritas:', error);
      return [];
    }

    return data?.map((fav: any) => fav.questions) || [];
  } catch (error) {
    console.error('Erro ao buscar favoritas:', error);
    return [];
  }
}

/**
 * Adicionar questão aos favoritos
 */
export async function addToFavorites(userId: string, questionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('favorite_questions')
      .insert([{ userId, questionId }]);

    if (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return false;
  }
}

/**
 * Remover questão dos favoritos
 */
export async function removeFromFavorites(userId: string, questionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('favorite_questions')
      .delete()
      .eq('userId', userId)
      .eq('questionId', questionId);

    if (error) {
      console.error('Erro ao remover dos favoritos:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return false;
  }
}
