# Design — Aprova+

## Identidade Visual

**Paleta de cores:**
- Primary: `#6C3CE1` (roxo vibrante — transmite modernidade e premium)
- Secondary: `#F5A623` (âmbar dourado — transmite conquista e energia)
- Background: `#0D0D1A` (dark) / `#F8F7FF` (light)
- Surface: `#1A1A2E` (dark) / `#FFFFFF` (light)
- Accent: `#00D4AA` (verde-água — progresso e sucesso)
- Foreground: `#ECEDFF` (dark) / `#1A1A2E` (light)
- Muted: `#8888AA` (dark) / `#6B6B8A` (light)

**Tipografia:** Sistema nativo (SF Pro / Roboto) com pesos variados para hierarquia clara.

**Estilo:** Minimalista premium com gradientes sutis, cards com bordas arredondadas (16-24px), sombras suaves.

---

## Telas

| Tela | Descrição |
|------|-----------|
| Onboarding (4 steps) | Boas-vindas, concurso, horas/dia, dificuldade + tela "criando plano" |
| Hoje (Home) | Checklist do dia, progresso, frases motivacionais, botão continuar |
| Progresso | Gráficos de evolução, horas estudadas, streak, conquistas |
| Anti-Procrastinação | Pomodoro, mini metas, modo foco, desafios |
| Modo Cansado | Metas reduzidas, estudos leves, motivação especial |
| Comece Rápido | Guia para iniciantes, montagem de rotina |
| Configurações | Perfil, notificações, tema |

---

## Fluxos Principais

**Primeiro uso:** Splash → Onboarding (4 perguntas) → Tela "criando seu plano" → Home (Hoje)

**Uso diário:** Home → marcar tarefas → ver progresso → streak atualizado

**Modo Cansado:** Home → botão "Estou cansado" → metas reduzidas → pomodoro curto

**Anti-Procrastinação:** Tab → escolher mini meta → modo foco → recompensa visual

---

## Navegação

Tab bar com 4 abas:
1. **Hoje** (house.fill) — tela principal
2. **Progresso** (chart.bar.fill) — evolução e streak
3. **Foco** (timer) — anti-procrastinação e pomodoro
4. **Perfil** (person.fill) — configurações e conquistas
