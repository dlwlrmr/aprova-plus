import React, { useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import { getQuestionsByConcurso, getResourcesByConcurso, getAreasByConcurso } from "@/lib/questions-database";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type StudyTab = "questoes" | "recursos" | "anotacoes";

function QuestionCard({ question, onAnswer }: { question: any; onAnswer: (correct: boolean) => void }) {
  const colors = useColors();
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === question.correctAnswer;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }
    onAnswer(isCorrect);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View
          style={{
            backgroundColor: colors.primary + "20",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
            {question.difficulty === "fácil" ? "🟢" : question.difficulty === "médio" ? "🟡" : "🔴"} {question.difficulty}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.muted, flex: 1 }}>{question.area}</Text>
      </View>

      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 14, lineHeight: 22 }}>
        {question.text}
      </Text>

      <View style={{ gap: 8, marginBottom: 14 }}>
        {question.options.map((option: string, i: number) => {
          const isCorrect = i === question.correctAnswer;
          const isSelected = i === selected;
          let bgColor = colors.surface2;
          let borderColor = colors.border;
          let textColor = colors.foreground;

          if (answered && isCorrect) {
            bgColor = colors.success + "20";
            borderColor = colors.success;
            textColor = colors.success;
          } else if (answered && isSelected && !isCorrect) {
            bgColor = colors.error + "20";
            borderColor = colors.error;
            textColor = colors.error;
          } else if (isSelected && !answered) {
            bgColor = colors.primary + "20";
            borderColor = colors.primary;
          }

          return (
            <Pressable
              key={i}
              style={{
                backgroundColor: bgColor,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                opacity: answered && !isCorrect && !isSelected ? 0.6 : 1,
              }}
              onPress={() => handleAnswer(i)}
              disabled={answered}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: textColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && answered && isCorrect && (
                  <Text style={{ fontSize: 12, color: colors.success }}>✓</Text>
                )}
                {isSelected && answered && !isCorrect && (
                  <Text style={{ fontSize: 12, color: colors.error }}>✗</Text>
                )}
              </View>
              <Text style={{ fontSize: 14, color: textColor, fontWeight: "600", flex: 1 }}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View
          style={{
            backgroundColor: colors.primary + "10",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1.5,
            borderColor: colors.primary + "30",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary, marginBottom: 4 }}>
            💡 Explicação
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  const colors = useColors();
  const typeEmoji: Record<string, string> = {
    livro: "📚",
    vídeoaula: "🎥",
    artigo: "📄",
    simulado: "🧪",
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <Text style={{ fontSize: 32 }}>{typeEmoji[resource.type]}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 2 }}>
            {resource.title}
          </Text>
          {resource.author && (
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>por {resource.author}</Text>
          )}
          <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18, marginBottom: 8 }}>
            {resource.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.warning }}>
              ⭐ {resource.rating.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>({resource.reviews} avaliações)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function StudyScreen() {
  const colors = useColors();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<StudyTab>("questoes");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);

  const concurso = state.profile?.concurso || "";
  const questions = getQuestionsByConcurso(concurso);
  const resources = getResourcesByConcurso(concurso);
  const areas = getAreasByConcurso(concurso);
  const filteredQuestions = selectedArea ? questions.filter((q) => q.area === selectedArea) : questions;

  const s = StyleSheet.create({
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
    subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
    tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginVertical: 16 },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface2,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { fontSize: 13, fontWeight: "700", color: colors.muted },
    tabTextActive: { color: "#fff" },
  });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Questões & Estudo</Text>
          <Text style={s.subtitle}>Pratique, aprenda e domine o concurso.</Text>
        </View>

        {/* Tabs */}
        <View style={s.tabRow}>
          {(["questoes", "recursos", "anotacoes"] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                {tab === "questoes" ? "❓ Questões" : tab === "recursos" ? "📚 Recursos" : "📝 Anotações"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Questões */}
        {activeTab === "questoes" && (
          <View style={{ paddingHorizontal: 20 }}>
            {areas.length > 0 && (
              <>
                <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 10, fontWeight: "600" }}>
                  Filtrar por área
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <Pressable
                    style={{
                      backgroundColor: !selectedArea ? colors.primary : colors.surface2,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      marginRight: 8,
                      borderWidth: 1.5,
                      borderColor: !selectedArea ? colors.primary : colors.border,
                    }}
                    onPress={() => setSelectedArea(null)}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: !selectedArea ? "#fff" : colors.muted,
                      }}
                    >
                      Todas
                    </Text>
                  </Pressable>
                  {areas.map((area) => (
                    <Pressable
                      key={area}
                      style={{
                        backgroundColor: selectedArea === area ? colors.primary : colors.surface2,
                        borderRadius: 12,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        marginRight: 8,
                        borderWidth: 1.5,
                        borderColor: selectedArea === area ? colors.primary : colors.border,
                      }}
                      onPress={() => setSelectedArea(area)}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: selectedArea === area ? "#fff" : colors.muted,
                        }}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}

            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onAnswer={(correct) => {
                    // Aqui você pode salvar a resposta no estado
                  }}
                />
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📚</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                  Nenhuma questão disponível
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
                  Em breve adicionaremos mais questões para {concurso}.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Recursos */}
        {activeTab === "recursos" && (
          <View style={{ paddingHorizontal: 20 }}>
            {resources.length > 0 ? (
              resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📖</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                  Nenhum recurso disponível
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
                  Estamos preparando os melhores recursos para você.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Anotações */}
        {activeTab === "anotacoes" && (
          <View style={{ paddingHorizontal: 20 }}>
            {!showNewNote ? (
              <Pressable
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  marginBottom: 20,
                }}
                onPress={() => setShowNewNote(true)}
              >
                <Text style={{ fontSize: 15, fontWeight: "800", color: "#fff" }}>+ Nova anotação</Text>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              >
                <TextInput
                  placeholder="Título da anotação"
                  placeholderTextColor={colors.muted}
                  value={newNoteTitle}
                  onChangeText={setNewNoteTitle}
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: colors.foreground,
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                />
                <TextInput
                  placeholder="O que você aprendeu?"
                  placeholderTextColor={colors.muted}
                  value={newNoteContent}
                  onChangeText={setNewNoteContent}
                  multiline
                  numberOfLines={6}
                  style={{
                    fontSize: 14,
                    color: colors.foreground,
                    marginBottom: 12,
                    paddingBottom: 8,
                  }}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface2,
                      borderRadius: 12,
                      paddingVertical: 10,
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: colors.border,
                    }}
                    onPress={() => {
                      setShowNewNote(false);
                      setNewNoteTitle("");
                      setNewNoteContent("");
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.muted }}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (newNoteTitle.trim() && newNoteContent.trim()) {
                        // Aqui você salvaria a anotação
                        setShowNewNote(false);
                        setNewNoteTitle("");
                        setNewNoteContent("");
                      }
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Salvar</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {state.notes.length > 0 ? (
              state.notes.map((note) => (
                <View
                  key={note.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1.5,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>
                        {note.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                        {note.area} • {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                    <Pressable>
                      <Text style={{ fontSize: 16 }}>✕</Text>
                    </Pressable>
                  </View>
                  <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>{note.content}</Text>
                  {note.tags.length > 0 && (
                    <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
                      {note.tags.map((tag) => (
                        <View
                          key={tag}
                          style={{
                            backgroundColor: colors.primary + "20",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📝</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                  Nenhuma anotação ainda
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
                  Crie sua primeira anotação para registrar o que aprendeu.
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
