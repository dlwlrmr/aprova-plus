import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import { useThemeContext } from "@/lib/theme-provider";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const colors = useColors();
  const { state, toggleSound, resetApp, updateProfile } = useApp();
  const { colorScheme, setColorScheme } = useThemeContext();
  const router = useRouter();
  const profile = state.profile;
  const [concurso, setConcurso] = useState(profile?.concurso || "");
  const [editingConcurso, setEditingConcurso] = useState(false);

  const handleReset = () => {
    Alert.alert(
      "Reiniciar app",
      "Tem certeza? Todos os seus dados de progresso serão apagados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: async () => {
            await resetApp();
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  const s = StyleSheet.create({
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
    title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
    profileCard: {
      marginHorizontal: 20, marginBottom: 24,
      backgroundColor: colors.surface,
      borderRadius: 20, padding: 20,
      borderWidth: 1.5, borderColor: colors.border,
      flexDirection: "row", alignItems: "center", gap: 16,
    },
    avatar: {
      width: 60, height: 60, borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: "center", justifyContent: "center",
    },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: "800", color: colors.foreground, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
    row: {
      flexDirection: "row", alignItems: "center", gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 14, padding: 16, marginBottom: 8,
      borderWidth: 1.5, borderColor: colors.border,
    },
    rowLabel: { fontSize: 15, fontWeight: "700", color: colors.foreground, flex: 1 },
    rowValue: { fontSize: 14, color: colors.foreground, fontWeight: "600" },
    dangerBtn: {
      marginHorizontal: 20, marginBottom: 32,
      backgroundColor: colors.error + "15",
      borderRadius: 16, padding: 16,
      alignItems: "center",
      borderWidth: 1.5, borderColor: colors.error + "40",
    },
  });

  const difficultyLabel: Record<string, string> = {
    procrastination: "Procrastinação",
    organization: "Organização",
    consistency: "Constância",
    focus: "Foco",
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Perfil</Text>
        </View>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={{ fontSize: 28 }}>🎯</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground }}>
              {profile?.concurso || "Candidato"}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
              Membro desde {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("pt-BR") : "hoje"}
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 14 }}>🔥</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.warning }}>
                  {state.streak} dias
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 14 }}>✅</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.success }}>
                  {state.tasksCompletedTotal} tarefas
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Meu plano */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Meu Plano</Text>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>📋</Text>
            {editingConcurso ? <TextInput value={concurso} onChangeText={setConcurso} placeholder="Ex.: ENEM, OAB, concurso..." placeholderTextColor={colors.muted} style={{flex:1,borderWidth:1.5,borderColor:colors.border,borderRadius:10,padding:10,color:colors.foreground,fontSize:14}}/> : <><Text style={s.rowLabel}>Concurso</Text><Text style={s.rowValue}>{profile?.concurso || "—"}</Text></>}
            <Pressable onPress={async()=>{if(editingConcurso){await updateProfile({concurso:concurso.trim()||"Não definido"});setEditingConcurso(false)}else{setConcurso(profile?.concurso||"");setEditingConcurso(true)}}} hitSlop={10}><Text style={{color:colors.primary,fontWeight:"800"}}>{editingConcurso?"Salvar":"Editar"}</Text></Pressable>
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>⏱️</Text>
            <Text style={s.rowLabel}>Horas por dia</Text>
            <Text style={s.rowValue}>{profile?.horasPerDay || 0}h</Text>
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>💼</Text>
            <Text style={s.rowLabel}>Trabalha</Text>
            <Text style={s.rowValue}>{profile?.trabalha ? "Sim" : "Não"}</Text>
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>🎯</Text>
            <Text style={s.rowLabel}>Foco principal</Text>
            <Text style={s.rowValue}>{difficultyLabel[profile?.difficulty || ""] || "—"}</Text>
          </View>
        </View>

        {/* Preferências */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Preferências</Text>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>🔊</Text>
            <Text style={s.rowLabel}>Sons de feedback</Text>
            <Switch
              value={state.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>{colorScheme === "dark" ? "🌙" : "☀️"}</Text>
            <Text style={s.rowLabel}>Tema escuro</Text>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={(val) => setColorScheme(val ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sobre */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sobre</Text>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>📱</Text>
            <Text style={s.rowLabel}>Versão</Text>
            <Text style={s.rowValue}>1.0.0</Text>
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 20 }}>💜</Text>
            <Text style={s.rowLabel}>Aprova+</Text>
            <Text style={s.rowValue}>Feito com carinho</Text>
          </View>
        </View>

        {/* Reiniciar */}
        <Pressable style={s.dangerBtn} onPress={handleReset}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.error }}>
            🔄 Reiniciar app e refazer onboarding
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
