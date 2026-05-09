import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";

const { width } = Dimensions.get("window");
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function AnimatedBar({ value, maxValue, color, label }: { value: number; maxValue: number; color: string; label: string }) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const barHeight = 120;
  const targetHeight = maxValue > 0 ? (value / maxValue) * barHeight : 0;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [targetHeight]);

  const colors = useColors();
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>
        {value > 0 ? value.toFixed(1) : ""}
      </Text>
      <View style={{ height: barHeight, justifyContent: "flex-end" }}>
        <Animated.View
          style={{
            width: 28, borderRadius: 6,
            backgroundColor: color,
            height: heightAnim,
            minHeight: value > 0 ? 4 : 0,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>{label}</Text>
    </View>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  const colors = useColors();
  return (
    <View style={{
      flex: 1, backgroundColor: colors.surface,
      borderRadius: 16, padding: 16,
      borderWidth: 1.5, borderColor: colors.border,
      alignItems: "center", gap: 6,
    }}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={{ fontSize: 22, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>{label}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const colors = useColors();
  const { state } = useApp();

  const totalHours = state.totalHours;
  const streak = state.streak;
  const tasksCompleted = state.tasksCompletedTotal;
  const weeklyHours = state.weeklyHours;
  const maxWeeklyHours = Math.max(...weeklyHours, 0.1);

  const today = new Date().getDay();
  const progressPercent = state.todayTasks.length > 0
    ? Math.round((state.todayTasks.filter((t) => t.done).length / state.todayTasks.length) * 100)
    : 0;

  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const s = StyleSheet.create({
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
    title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
    subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 14 },
    statsRow: { flexDirection: "row", gap: 12 },
    streakCard: {
      marginHorizontal: 20, marginBottom: 24,
      backgroundColor: colors.warning + "15",
      borderRadius: 20, padding: 20,
      borderWidth: 1.5, borderColor: colors.warning + "40",
      flexDirection: "row", alignItems: "center", gap: 16,
    },
    chartCard: {
      backgroundColor: colors.surface,
      borderRadius: 20, padding: 20,
      borderWidth: 1.5, borderColor: colors.border,
    },
    todayProgress: {
      marginHorizontal: 20, marginBottom: 24,
      backgroundColor: colors.surface,
      borderRadius: 20, padding: 20,
      borderWidth: 1.5, borderColor: colors.border,
    },
    progressBar: { height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: "hidden", marginTop: 12 },
    progressFill: { height: "100%", borderRadius: 5, backgroundColor: colors.primary },
  });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Seu Progresso</Text>
          <Text style={s.subtitle}>Você está avançando. Continue assim! 💪</Text>
        </View>

        {/* Streak */}
        <View style={s.streakCard}>
          <Text style={{ fontSize: 48 }}>🔥</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.warning }}>
              {streak} {streak === 1 ? "dia" : "dias"}
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {streak === 0
                ? "Comece hoje sua sequência!"
                : streak < 7
                ? "Sequência em andamento — não pare agora!"
                : streak < 30
                ? "Incrível! Você está criando um hábito poderoso."
                : "Lendário! Você é uma máquina de estudos. 🏆"}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Resumo geral</Text>
          <View style={s.statsRow}>
            <StatCard
              icon="⏱️"
              value={totalHours < 1 ? `${Math.round(totalHours * 60)}min` : `${totalHours.toFixed(1)}h`}
              label="Total estudado"
              color={colors.primary}
            />
            <StatCard
              icon="✅"
              value={String(tasksCompleted)}
              label="Tarefas concluídas"
              color={colors.success}
            />
          </View>
        </View>

        {/* Progresso de hoje */}
        <View style={s.todayProgress}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>Hoje</Text>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.primary }}>{progressPercent}%</Text>
          </View>
          <View style={s.progressBar}>
            <Animated.View
              style={[s.progressFill, {
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              }]}
            />
          </View>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
            {state.todayTasks.filter((t) => t.done).length} de {state.todayTasks.length} tarefas concluídas
          </Text>
        </View>

        {/* Gráfico semanal */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Horas esta semana</Text>
          <View style={s.chartCard}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", paddingTop: 8 }}>
              {DAYS.map((day, i) => (
                <AnimatedBar
                  key={day}
                  value={weeklyHours[i] || 0}
                  maxValue={maxWeeklyHours}
                  color={i === today ? colors.primary : colors.primary + "50"}
                  label={day}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Conquistas */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Conquistas</Text>
          <View style={{ gap: 10 }}>
            {[
              { icon: "🌱", label: "Primeiro passo", desc: "Completou o onboarding", unlocked: true },
              { icon: "🔥", label: "3 dias seguidos", desc: "Manteve streak por 3 dias", unlocked: streak >= 3 },
              { icon: "⚡", label: "Uma semana", desc: "7 dias consecutivos de estudo", unlocked: streak >= 7 },
              { icon: "🏆", label: "Um mês", desc: "30 dias consecutivos", unlocked: streak >= 30 },
              { icon: "📚", label: "10 tarefas", desc: "Completou 10 tarefas", unlocked: tasksCompleted >= 10 },
              { icon: "🎯", label: "50 tarefas", desc: "Completou 50 tarefas", unlocked: tasksCompleted >= 50 },
            ].map((achievement) => (
              <View
                key={achievement.label}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 14,
                  backgroundColor: achievement.unlocked ? colors.surface : colors.surface + "80",
                  borderRadius: 14, padding: 14,
                  borderWidth: 1.5,
                  borderColor: achievement.unlocked ? colors.primary + "40" : colors.border,
                  opacity: achievement.unlocked ? 1 : 0.5,
                }}
              >
                <Text style={{ fontSize: 28 }}>{achievement.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>{achievement.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{achievement.desc}</Text>
                </View>
                {achievement.unlocked && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
