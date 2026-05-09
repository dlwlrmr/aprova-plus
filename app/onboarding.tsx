import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import { Difficulty, UserProfile } from "@/lib/store";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width, height } = Dimensions.get("window");

type Step = "welcome" | "concurso" | "horas" | "trabalha" | "dificuldade" | "creating";

const DIFFICULTIES: { key: Difficulty; label: string; icon: string; desc: string }[] = [
  { key: "procrastination", label: "Procrastinação", icon: "⏳", desc: "Dificuldade em começar e manter o foco" },
  { key: "organization",   label: "Organização",    icon: "📋", desc: "Dificuldade em estruturar os estudos" },
  { key: "consistency",    label: "Constância",     icon: "🔄", desc: "Dificuldade em manter a rotina diária" },
  { key: "focus",          label: "Foco",           icon: "🎯", desc: "Dificuldade em se concentrar nos estudos" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState<Step>("welcome");
  const [concurso, setConcurso] = useState("");
  const [horas, setHoras] = useState(2);
  const [trabalha, setTrabalha] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [creatingProgress, setCreatingProgress] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const transition = (nextStep: Step) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const startCreating = async () => {
    transition("creating");
    // Animate progress bar
    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.02;
      setCreatingProgress(Math.min(prog, 1));
      Animated.timing(progressAnim, {
        toValue: Math.min(prog, 1),
        duration: 100,
        useNativeDriver: false,
      }).start();
      if (prog >= 1) {
        clearInterval(interval);
        finishOnboarding();
      }
    }, 80);
  };

  const finishOnboarding = async () => {
    const profile: UserProfile = {
      name: "",
      concurso: concurso || "Concurso Público",
      horasPerDay: horas,
      trabalha: trabalha ?? false,
      difficulty: difficulty ?? "procrastination",
      onboardingDone: true,
      createdAt: new Date().toISOString(),
    };
    await completeOnboarding(profile);
    router.replace("/(tabs)");
  };

  const getStepProgress = () => {
    const steps: Step[] = ["welcome", "concurso", "horas", "trabalha", "dificuldade"];
    const idx = steps.indexOf(step);
    return idx < 0 ? 0 : idx / (steps.length - 1);
  };

  const s = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
    stepIndicator: { flexDirection: "row", gap: 6, marginBottom: 40 },
    dot: { height: 4, borderRadius: 2 },
    title: { fontSize: 30, fontWeight: "800", color: colors.foreground, marginBottom: 10, lineHeight: 38 },
    subtitle: { fontSize: 16, color: colors.muted, lineHeight: 24, marginBottom: 40 },
    input: {
      backgroundColor: colors.surface2,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 17,
      color: colors.foreground,
      borderWidth: 1.5,
      borderColor: colors.border,
      marginBottom: 16,
    },
    horasRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 32 },
    horasBtn: {
      width: 52, height: 52, borderRadius: 26,
      backgroundColor: colors.surface2,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1.5, borderColor: colors.border,
    },
    horasNum: { fontSize: 48, fontWeight: "800", color: colors.primary },
    horasLabel: { fontSize: 15, color: colors.muted, textAlign: "center" },
    optionBtn: {
      flexDirection: "row", alignItems: "center", gap: 14,
      backgroundColor: colors.surface2,
      borderRadius: 16, padding: 18, marginBottom: 12,
      borderWidth: 1.5, borderColor: colors.border,
    },
    optionBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + "15" },
    optionIcon: { fontSize: 28 },
    optionLabel: { fontSize: 16, fontWeight: "700", color: colors.foreground },
    optionDesc: { fontSize: 13, color: colors.muted, marginTop: 2 },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 18, paddingVertical: 18,
      alignItems: "center", marginTop: "auto",
    },
    primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
    progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.border, marginBottom: 40, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 3, backgroundColor: colors.primary },
    // Creating screen
    creatingContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    creatingTitle: { fontSize: 26, fontWeight: "800", color: colors.foreground, textAlign: "center", marginBottom: 12 },
    creatingSubtitle: { fontSize: 15, color: colors.muted, textAlign: "center", marginBottom: 48 },
    creatingBar: { width: "100%", height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden", marginBottom: 24 },
    creatingFill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
    creatingStep: { fontSize: 14, color: colors.muted, textAlign: "center" },
  });

  const stepProgress = getStepProgress();
  const steps: Step[] = ["welcome", "concurso", "horas", "trabalha", "dificuldade"];

  if (step === "creating") {
    const msgs = [
      "Analisando seu perfil...",
      "Montando sua rotina de estudos...",
      "Configurando seu plano personalizado...",
      "Quase pronto...",
      "Seu plano está pronto! 🎉",
    ];
    const msgIdx = Math.min(Math.floor(creatingProgress * msgs.length), msgs.length - 1);
    return (
      <LinearGradient colors={[colors.background, colors.surface]} style={s.container}>
        <View style={s.creatingContainer}>
          <Text style={{ fontSize: 64, marginBottom: 24 }}>✨</Text>
          <Text style={s.creatingTitle}>Criando seu plano personalizado…</Text>
          <Text style={s.creatingSubtitle}>Estamos preparando tudo para a sua aprovação</Text>
          <View style={s.creatingBar}>
            <Animated.View
              style={[s.creatingFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]}
            />
          </View>
          <Text style={s.creatingStep}>{msgs[msgIdx]}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={s.container}>
      <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Step dots */}
        {step !== "welcome" && (
          <View style={s.stepIndicator}>
            {steps.slice(1).map((st, i) => (
              <View
                key={st}
                style={[
                  s.dot,
                  { flex: 1, backgroundColor: steps.indexOf(step) - 1 >= i ? colors.primary : colors.border },
                ]}
              />
            ))}
          </View>
        )}

        {/* WELCOME */}
        {step === "welcome" && (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ fontSize: 72, textAlign: "center", marginBottom: 24 }}>🎯</Text>
              <Text style={[s.title, { textAlign: "center" }]}>Bem-vindo ao{"\n"}Aprova+</Text>
              <Text style={[s.subtitle, { textAlign: "center" }]}>
                Seu companheiro de estudos para a aprovação no concurso dos seus sonhos.
              </Text>
              <Text style={[s.subtitle, { textAlign: "center", marginBottom: 0 }]}>
                Vamos criar seu plano personalizado em menos de 1 minuto.
              </Text>
            </View>
            <Pressable style={s.primaryBtn} onPress={() => transition("concurso")}>
              <Text style={s.primaryBtnText}>Começar agora →</Text>
            </Pressable>
          </View>
        )}

        {/* CONCURSO */}
        {step === "concurso" && (
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Qual concurso você quer passar?</Text>
            <Text style={s.subtitle}>Seja específico — isso nos ajuda a montar o melhor plano para você.</Text>
            <TextInput
              style={s.input}
              placeholder="Ex: TJSP, Polícia Civil, Receita Federal..."
              placeholderTextColor={colors.muted}
              value={concurso}
              onChangeText={setConcurso}
              returnKeyType="done"
              autoFocus
            />
            <Pressable
              style={[s.primaryBtn, !concurso.trim() && { opacity: 0.5 }]}
              onPress={() => concurso.trim() && transition("horas")}
            >
              <Text style={s.primaryBtnText}>Continuar →</Text>
            </Pressable>
          </View>
        )}

        {/* HORAS */}
        {step === "horas" && (
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Quantas horas por dia você pode estudar?</Text>
            <Text style={s.subtitle}>Seja honesto — um plano realista é melhor do que um plano perfeito.</Text>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={s.horasRow}>
                <Pressable style={s.horasBtn} onPress={() => setHoras(Math.max(1, horas - 1))}>
                  <Text style={{ fontSize: 24, color: colors.primary, fontWeight: "700" }}>−</Text>
                </Pressable>
                <View style={{ alignItems: "center" }}>
                  <Text style={s.horasNum}>{horas}</Text>
                  <Text style={s.horasLabel}>hora{horas !== 1 ? "s" : ""} por dia</Text>
                </View>
                <Pressable style={s.horasBtn} onPress={() => setHoras(Math.min(12, horas + 1))}>
                  <Text style={{ fontSize: 24, color: colors.primary, fontWeight: "700" }}>+</Text>
                </Pressable>
              </View>
              <Text style={[s.horasLabel, { color: colors.muted, fontSize: 13 }]}>
                {horas <= 2 ? "Ótimo começo! Consistência vale mais que quantidade." :
                 horas <= 4 ? "Excelente! Com essa dedicação, você vai longe." :
                 "Impressionante! Lembre-se de descansar também. 💪"}
              </Text>
            </View>
            <Pressable style={s.primaryBtn} onPress={() => transition("trabalha")}>
              <Text style={s.primaryBtnText}>Continuar →</Text>
            </Pressable>
          </View>
        )}

        {/* TRABALHA */}
        {step === "trabalha" && (
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Você trabalha atualmente?</Text>
            <Text style={s.subtitle}>Isso nos ajuda a adaptar seu plano à sua rotina real.</Text>
            <View style={{ flex: 1, justifyContent: "center", gap: 12 }}>
              {[
                { val: true,  icon: "💼", label: "Sim, trabalho",     desc: "Vou adaptar seu plano para encaixar nos seus horários" },
                { val: false, icon: "📚", label: "Não, só estudo",    desc: "Ótimo! Vamos aproveitar ao máximo seu tempo disponível" },
              ].map((opt) => (
                <Pressable
                  key={String(opt.val)}
                  style={[s.optionBtn, trabalha === opt.val && s.optionBtnActive]}
                  onPress={() => setTrabalha(opt.val)}
                >
                  <Text style={s.optionIcon}>{opt.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.optionLabel}>{opt.label}</Text>
                    <Text style={s.optionDesc}>{opt.desc}</Text>
                  </View>
                  {trabalha === opt.val && (
                    <IconSymbol name="checkmark.circle.fill" size={22} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            <Pressable
              style={[s.primaryBtn, trabalha === null && { opacity: 0.5 }]}
              onPress={() => trabalha !== null && transition("dificuldade")}
            >
              <Text style={s.primaryBtnText}>Continuar →</Text>
            </Pressable>
          </View>
        )}

        {/* DIFICULDADE */}
        {step === "dificuldade" && (
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Qual sua maior dificuldade?</Text>
            <Text style={s.subtitle}>Vamos focar nas ferramentas certas para você superar isso.</Text>
            <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
              {DIFFICULTIES.map((opt) => (
                <Pressable
                  key={opt.key}
                  style={[s.optionBtn, difficulty === opt.key && s.optionBtnActive]}
                  onPress={() => setDifficulty(opt.key)}
                >
                  <Text style={s.optionIcon}>{opt.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.optionLabel}>{opt.label}</Text>
                    <Text style={s.optionDesc}>{opt.desc}</Text>
                  </View>
                  {difficulty === opt.key && (
                    <IconSymbol name="checkmark.circle.fill" size={22} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            <Pressable
              style={[s.primaryBtn, !difficulty && { opacity: 0.5 }]}
              onPress={() => difficulty && startCreating()}
            >
              <Text style={s.primaryBtnText}>Criar meu plano ✨</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}
