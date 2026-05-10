/**
 * Database de questões, recursos e dicas por concurso
 */

export interface Question {
  id: string;
  concurso: string;
  area: string;
  difficulty: "fácil" | "médio" | "difícil";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  source?: string;
}

export interface Resource {
  id: string;
  concurso: string;
  type: "livro" | "vídeoaula" | "artigo" | "simulado";
  title: string;
  author?: string;
  description: string;
  url?: string;
  rating: number;
  reviews: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  area: string;
  concurso: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

// Banco de questões por concurso
export const QUESTIONS_DATABASE: Question[] = [
  // TJSP
  {
    id: "q1",
    concurso: "TJSP",
    area: "Direito Constitucional",
    difficulty: "médio",
    text: "Qual artigo da Constituição Federal trata dos direitos e garantias fundamentais?",
    options: [
      "Artigo 1º",
      "Artigo 5º",
      "Artigo 10º",
      "Artigo 15º",
    ],
    correctAnswer: 1,
    explanation: "O artigo 5º da Constituição Federal de 1988 trata dos direitos e garantias fundamentais, sendo um dos mais importantes da Carta Magna.",
    source: "CF/88",
  },
  {
    id: "q2",
    concurso: "TJSP",
    area: "Direito Processual Civil",
    difficulty: "fácil",
    text: "Qual é o prazo para contestação em uma ação civil ordinária?",
    options: [
      "5 dias",
      "10 dias",
      "15 dias",
      "30 dias",
    ],
    correctAnswer: 3,
    explanation: "Conforme o CPC, o prazo para contestação é de 15 dias, contados da citação válida.",
    source: "CPC/2015",
  },
  {
    id: "q3",
    concurso: "TJSP",
    area: "Direito Penal",
    difficulty: "difícil",
    text: "O que é dolo eventual?",
    options: [
      "A vontade direta de praticar o crime",
      "A representação do resultado e a aceitação do risco",
      "A falta de vontade de praticar o crime",
      "A negligência na execução do crime",
    ],
    correctAnswer: 1,
    explanation: "Dolo eventual é quando o agente representa o resultado criminoso como possível e, mesmo assim, realiza a ação, aceitando o risco de produzi-lo.",
    source: "CP",
  },

  // OAB
  {
    id: "q4",
    concurso: "OAB",
    area: "Direito Administrativo",
    difficulty: "médio",
    text: "Qual é o princípio que exige que a administração pública atue sempre em conformidade com a lei?",
    options: [
      "Princípio da Moralidade",
      "Princípio da Legalidade",
      "Princípio da Publicidade",
      "Princípio da Eficiência",
    ],
    correctAnswer: 1,
    explanation: "O princípio da legalidade é fundamental no direito administrativo, exigindo que toda ação administrativa tenha fundamento legal.",
    source: "CF/88 - Art. 37",
  },
  {
    id: "q5",
    concurso: "OAB",
    area: "Direito Civil",
    difficulty: "fácil",
    text: "Qual é a maioridade civil no Brasil?",
    options: [
      "16 anos",
      "18 anos",
      "21 anos",
      "25 anos",
    ],
    correctAnswer: 1,
    explanation: "A maioridade civil no Brasil é aos 18 anos, conforme o Código Civil Brasileiro.",
    source: "CC - Art. 5º",
  },

  // Concursos Federais
  {
    id: "q6",
    concurso: "Concursos Federais",
    area: "Português",
    difficulty: "médio",
    text: "Qual é o sujeito da oração: 'Chegou a hora da verdade'?",
    options: [
      "Hora",
      "Verdade",
      "Indeterminado",
      "Oculto",
    ],
    correctAnswer: 0,
    explanation: "O sujeito é 'a hora', que é o termo que realiza a ação de chegar. É um sujeito simples e determinado.",
    source: "Sintaxe da Oração",
  },
  {
    id: "q7",
    concurso: "Concursos Federais",
    area: "Matemática",
    difficulty: "fácil",
    text: "Qual é o resultado de 15% de 200?",
    options: [
      "20",
      "25",
      "30",
      "35",
    ],
    correctAnswer: 2,
    explanation: "15% de 200 = (15/100) × 200 = 0,15 × 200 = 30",
    source: "Porcentagem",
  },
];

// Recursos por concurso
export const RESOURCES_DATABASE: Resource[] = [
  // TJSP
  {
    id: "r1",
    concurso: "TJSP",
    type: "livro",
    title: "Direito Constitucional Simplificado",
    author: "Pedro Lenza",
    description: "Livro clássico para concursos com explicações claras e objetivas sobre direito constitucional.",
    rating: 4.8,
    reviews: 1250,
  },
  {
    id: "r2",
    concurso: "TJSP",
    type: "vídeoaula",
    title: "Curso Completo de Direito Processual Civil",
    author: "Professora Marina",
    description: "Vídeoaulas em profundidade cobrindo todo o CPC com exemplos práticos.",
    url: "https://youtube.com/exemplo",
    rating: 4.7,
    reviews: 890,
  },
  {
    id: "r3",
    concurso: "TJSP",
    type: "simulado",
    title: "Simulado TJSP 2024",
    description: "Simulado com 100 questões inéditas seguindo o padrão das provas reais.",
    rating: 4.6,
    reviews: 450,
  },

  // OAB
  {
    id: "r4",
    concurso: "OAB",
    type: "livro",
    title: "Manual de Direito Administrativo",
    author: "Celso Antônio Bandeira de Mello",
    description: "Referência obrigatória para OAB com análise profunda dos princípios administrativos.",
    rating: 4.9,
    reviews: 2100,
  },
  {
    id: "r5",
    concurso: "OAB",
    type: "vídeoaula",
    title: "Revisão OAB - Direito Civil",
    author: "Professor João",
    description: "Revisão rápida e objetiva dos principais tópicos de direito civil para OAB.",
    url: "https://youtube.com/exemplo",
    rating: 4.5,
    reviews: 650,
  },

  // Concursos Federais
  {
    id: "r6",
    concurso: "Concursos Federais",
    type: "livro",
    title: "Português para Concursos",
    author: "Fernanda Câmara",
    description: "Guia completo de português com foco em concursos públicos.",
    rating: 4.7,
    reviews: 1800,
  },
  {
    id: "r7",
    concurso: "Concursos Federais",
    type: "vídeoaula",
    title: "Matemática Financeira Descomplicada",
    author: "Professor Carlos",
    description: "Aulas de matemática financeira com foco em questões de concursos.",
    url: "https://youtube.com/exemplo",
    rating: 4.6,
    reviews: 920,
  },
];

// Filtrar questões por concurso
export function getQuestionsByConcurso(concurso: string): Question[] {
  return QUESTIONS_DATABASE.filter((q) => q.concurso === concurso);
}

// Filtrar questões por área
export function getQuestionsByArea(concurso: string, area: string): Question[] {
  return QUESTIONS_DATABASE.filter((q) => q.concurso === concurso && q.area === area);
}

// Filtrar questões por dificuldade
export function getQuestionsByDifficulty(concurso: string, difficulty: string): Question[] {
  return QUESTIONS_DATABASE.filter((q) => q.concurso === concurso && q.difficulty === difficulty);
}

// Obter todas as áreas de um concurso
export function getAreasByConcurso(concurso: string): string[] {
  const areas = new Set(
    QUESTIONS_DATABASE.filter((q) => q.concurso === concurso).map((q) => q.area)
  );
  return Array.from(areas);
}

// Obter recursos por concurso
export function getResourcesByConcurso(concurso: string): Resource[] {
  return RESOURCES_DATABASE.filter((r) => r.concurso === concurso);
}

// Obter recursos por tipo
export function getResourcesByType(concurso: string, type: string): Resource[] {
  return RESOURCES_DATABASE.filter((r) => r.concurso === concurso && r.type === type);
}
