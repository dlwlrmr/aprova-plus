import React, { useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { AuthService } from "@/lib/auth-service";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const colors = useColors();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handleModeChange = (newMode: AuthMode) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setMode(newMode);
      setError("");
      setEmail("");
      setPassword("");
      setName("");
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    const { user, error: authError } = await AuthService.login(email, password);

    if (authError) {
      setError(authError);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else if (user) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace("/(tabs)");
    }

    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    // Ir para onboarding com dados do signup
    router.replace({
      pathname: "/onboarding",
      params: { email, name, password },
    });
  };

  const s = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: "center" },
    header: { marginBottom: 40, alignItems: "center" },
    logo: { fontSize: 64, marginBottom: 16 },
    title: { fontSize: 32, fontWeight: "900", color: colors.foreground, marginBottom: 12 },
    slogan: { fontSize: 16, color: colors.primary, textAlign: "center", fontWeight: "600", marginBottom: 16, fontStyle: "italic" },
    subtitle: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 20, lineHeight: 20 },
    tabs: { flexDirection: "row", gap: 12, marginBottom: 32 },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface2,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { fontSize: 14, fontWeight: "700", color: colors.muted },
    tabTextActive: { color: "#fff" },
    input: {
      backgroundColor: colors.surface2,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 12,
    },
    inputPlaceholder: { color: colors.muted },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { fontSize: 16, fontWeight: "800", color: "#fff" },
    error: {
      backgroundColor: colors.error + "20",
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.error,
      padding: 12,
      marginBottom: 16,
    },
    errorText: { fontSize: 13, color: colors.error, fontWeight: "600" },
    footer: { marginTop: 24, alignItems: "center" },
    footerText: { fontSize: 13, color: colors.muted },
    footerLink: { color: colors.primary, fontWeight: "700" },
  });

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={s.container}>
      <SafeAreaView style={s.container} edges={["top", "left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.content}>
            {/* Header */}
            <View style={s.header}>
              <Text style={s.logo}>🎯</Text>
              <Text style={s.title}>Aprova+</Text>
              <Text style={s.slogan}>A constância aprova</Text>
              <Text style={s.subtitle}>
                {mode === "login" ? "Bem-vindo de volta! Sua jornada continua aqui." : "Comece sua jornada para a aprovação no concurso dos seus sonhos."}
              </Text>
            </View>

            {/* Tabs */}
            <View style={s.tabs}>
              <Pressable
                style={[s.tab, mode === "login" && s.tabActive]}
                onPress={() => handleModeChange("login")}
              >
                <Text style={[s.tabText, mode === "login" && s.tabTextActive]}>Login</Text>
              </Pressable>
              <Pressable
                style={[s.tab, mode === "signup" && s.tabActive]}
                onPress={() => handleModeChange("signup")}
              >
                <Text style={[s.tabText, mode === "signup" && s.tabTextActive]}>Cadastro</Text>
              </Pressable>
            </View>

            {/* Error */}
            {error && (
              <View style={s.error}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Login Form */}
              {mode === "login" && (
                <>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    style={s.input}
                  />
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor={colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                    style={s.input}
                  />
                  <Pressable
                    style={[s.button, loading && s.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text style={s.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
                  </Pressable>
                </>
              )}

              {/* Signup Form */}
              {mode === "signup" && (
                <>
                  <TextInput
                    placeholder="Nome completo"
                    placeholderTextColor={colors.muted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                    style={s.input}
                  />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    style={s.input}
                  />
                  <TextInput
                    placeholder="Senha (mínimo 6 caracteres)"
                    placeholderTextColor={colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                    style={s.input}
                  />
                  <Pressable
                    style={[s.button, loading && s.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                  >
                    <Text style={s.buttonText}>{loading ? "Criando conta..." : "Criar conta"}</Text>
                  </Pressable>
                </>
              )}
            </Animated.View>

            {/* Footer */}
            <View style={s.footer}>
              <Text style={s.footerText}>
                {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
                <Text
                  style={s.footerLink}
                  onPress={() => handleModeChange(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Cadastre-se" : "Faça login"}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
