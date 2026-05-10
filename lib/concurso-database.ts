/**
 * Database completo com questões, vídeoaulas, livros e recursos
 * para Banco do Brasil, INSS e TJ SP
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

export interface VideoAula {
  id: string;
  concurso: string;
  area: string;
  title: string;
  channel: string;
  level: "iniciante" | "intermediário" | "avançado";
  youtubeUrl: string;
  duration: string; // "12:34"
  description: string;
}

export interface Livro {
  id: string;
  concurso: string;
  area: string;
  title: string;
  author: string;
  description: string;
  level: "iniciante" | "intermediário" | "avançado";
  isbn?: string;
  rating: number;
}

// ============================================
// BANCO DO BRASIL
// ============================================

export const BANCO_DO_BRASIL_QUESTIONS: Question[] = [
  {
    id: "bb-q1",
    concurso: "Banco do Brasil",
    area: "Conhecimentos Bancários",
    difficulty: "fácil",
    text: "Qual é a principal função de um banco comercial?",
    options: [
      "Apenas guardar dinheiro dos clientes",
      "Intermediar operações de crédito e captação de recursos",
      "Emitir moeda",
      "Fiscalizar outras instituições financeiras",
    ],
    correctAnswer: 1,
    explanation:
      "Os bancos comerciais têm como principal função intermediar operações de crédito, captando recursos de poupadores e emprestando para tomadores de crédito.",
    source: "Lei 4.595/1964",
  },
  {
    id: "bb-q2",
    concurso: "Banco do Brasil",
    area: "Conhecimentos Bancários",
    difficulty: "médio",
    text: "O que é taxa SELIC?",
    options: [
      "Taxa de juros cobrada em empréstimos pessoais",
      "Taxa média de juros das operações de crédito",
      "Taxa básica de juros da economia, definida pelo Banco Central",
      "Taxa de câmbio do dólar americano",
    ],
    correctAnswer: 2,
    explanation:
      "A SELIC (Sistema Especial de Liquidação e de Custódia) é a taxa básica de juros da economia brasileira, definida pelo Banco Central e usada como referência para todas as outras taxas.",
    source: "Banco Central do Brasil",
  },
  {
    id: "bb-q3",
    concurso: "Banco do Brasil",
    area: "Atendimento ao Cliente",
    difficulty: "fácil",
    text: "Qual é o princípio mais importante no atendimento bancário?",
    options: [
      "Vender o máximo de produtos",
      "Satisfação e confiança do cliente",
      "Cumprir metas de vendas",
      "Minimizar custos operacionais",
    ],
    correctAnswer: 1,
    explanation:
      "A satisfação e confiança do cliente são os pilares do atendimento bancário de qualidade, gerando relacionamento duradouro e fidelização.",
    source: "Políticas de Atendimento BB",
  },
  {
    id: "bb-q4",
    concurso: "Banco do Brasil",
    area: "Produtos e Serviços",
    difficulty: "médio",
    text: "Qual é a diferença entre conta corrente e conta poupança?",
    options: [
      "Não há diferença, são a mesma coisa",
      "Conta corrente é para movimentação frequente, poupança para guardar dinheiro",
      "Conta poupança rende mais juros",
      "Conta corrente não cobra tarifas",
    ],
    correctAnswer: 1,
    explanation:
      "A conta corrente é destinada a movimentações frequentes (depósitos, saques, transferências), enquanto a poupança é para guardar dinheiro e receber rendimentos.",
    source: "Produtos BB",
  },
  {
    id: "bb-q5",
    concurso: "Banco do Brasil",
    area: "Segurança e Compliance",
    difficulty: "médio",
    text: "O que é compliance no setor bancário?",
    options: [
      "Um tipo de empréstimo",
      "Conformidade com leis, regulações e políticas internas",
      "Um produto de investimento",
      "Uma taxa cobrada pelos bancos",
    ],
    correctAnswer: 1,
    explanation:
      "Compliance significa estar em conformidade com todas as leis, regulações, normas internas e éticas, garantindo operações legais e seguras.",
    source: "Regulação Bancária",
  },
];

export const BANCO_DO_BRASIL_VIDEOS: VideoAula[] = [
  {
    id: "bb-v1",
    concurso: "Banco do Brasil",
    area: "Conhecimentos Bancários",
    title: "Sistema Financeiro Nacional - Conceitos Básicos",
    channel: "Professor Vinícius Oliveira",
    level: "iniciante",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo1",
    duration: "15:42",
    description: "Aula completa sobre o sistema financeiro brasileiro, instituições e regulação.",
  },
  {
    id: "bb-v2",
    concurso: "Banco do Brasil",
    area: "Conhecimentos Bancários",
    title: "SELIC, Taxa de Juros e Inflação",
    channel: "Economia Descomplicada",
    level: "intermediário",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo2",
    duration: "22:15",
    description: "Entenda como funciona a taxa SELIC e sua relação com a economia.",
  },
  {
    id: "bb-v3",
    concurso: "Banco do Brasil",
    area: "Atendimento ao Cliente",
    title: "Excelência no Atendimento Bancário",
    channel: "Instituto de Desenvolvimento Bancário",
    level: "intermediário",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo3",
    duration: "18:30",
    description: "Técnicas e estratégias para atendimento de excelência em instituições financeiras.",
  },
  {
    id: "bb-v4",
    concurso: "Banco do Brasil",
    area: "Produtos e Serviços",
    title: "Produtos Bancários - Contas, Cartões e Investimentos",
    channel: "BB Educação",
    level: "iniciante",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo4",
    duration: "25:00",
    description: "Visão geral dos principais produtos e serviços oferecidos pelo Banco do Brasil.",
  },
];

export const BANCO_DO_BRASIL_LIVROS: Livro[] = [
  {
    id: "bb-l1",
    concurso: "Banco do Brasil",
    area: "Conhecimentos Bancários",
    title: "Sistema Financeiro Nacional",
    author: "Fortuna, Eduardo",
    description: "Referência completa sobre o sistema financeiro brasileiro, instituições e mercados.",
    level: "intermediário",
    isbn: "978-8535929683",
    rating: 4.7,
  },
  {
    id: "bb-l2",
    concurso: "Banco do Brasil",
    area: "Produtos e Serviços",
    title: "Produtos e Serviços Bancários",
    author: "Securato, José Roberto",
    description: "Análise detalhada de todos os produtos e serviços bancários modernos.",
    level: "intermediário",
    isbn: "978-8535921434",
    rating: 4.5,
  },
  {
    id: "bb-l3",
    concurso: "Banco do Brasil",
    area: "Atendimento ao Cliente",
    title: "Excelência em Atendimento",
    author: "Giangrande, Vera",
    description: "Técnicas práticas para melhorar o atendimento e relacionamento com clientes.",
    level: "iniciante",
    rating: 4.6,
  },
];

// ============================================
// INSS
// ============================================

export const INSS_QUESTIONS: Question[] = [
  {
    id: "inss-q1",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    difficulty: "fácil",
    text: "O que é o INSS?",
    options: [
      "Instituto Nacional de Segurança Social",
      "Instituto Nacional de Seguridade Social",
      "Instituto Nacional de Saúde Social",
      "Instituto Nacional de Serviços Sociais",
    ],
    correctAnswer: 1,
    explanation:
      "INSS significa Instituto Nacional de Seguridade Social, órgão responsável pela administração do regime geral de previdência social no Brasil.",
    source: "Lei 8.213/1991",
  },
  {
    id: "inss-q2",
    concurso: "INSS",
    area: "Benefícios Previdenciários",
    difficulty: "médio",
    text: "Qual é o tempo mínimo de contribuição para aposentadoria por tempo de contribuição?",
    options: [
      "25 anos",
      "30 anos para mulheres e 35 para homens",
      "20 anos",
      "Não há tempo mínimo",
    ],
    correctAnswer: 1,
    explanation:
      "A aposentadoria por tempo de contribuição exige 30 anos de contribuição para mulheres e 35 anos para homens, conforme a legislação previdenciária.",
    source: "Lei 8.213/1991 - Art. 48",
  },
  {
    id: "inss-q3",
    concurso: "INSS",
    area: "Benefícios Previdenciários",
    difficulty: "fácil",
    text: "O que é auxílio-doença?",
    options: [
      "Benefício pago ao aposentado",
      "Benefício temporário para quem fica incapacitado para trabalhar",
      "Benefício para desempregados",
      "Benefício para crianças",
    ],
    correctAnswer: 1,
    explanation:
      "Auxílio-doença é um benefício temporário pago ao segurado que fica incapacitado para trabalhar por doença ou acidente.",
    source: "Lei 8.213/1991",
  },
  {
    id: "inss-q4",
    concurso: "INSS",
    area: "Segurados e Contribuintes",
    difficulty: "médio",
    text: "Quem é considerado segurado obrigatório do INSS?",
    options: [
      "Apenas empregados",
      "Empregados, contribuintes individuais, trabalhadores rurais e domésticos",
      "Apenas funcionários públicos",
      "Apenas autônomos",
    ],
    correctAnswer: 1,
    explanation:
      "Segurados obrigatórios são empregados, contribuintes individuais, trabalhadores rurais, domésticos e outros, conforme lei.",
    source: "Lei 8.213/1991 - Art. 11",
  },
  {
    id: "inss-q5",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    difficulty: "difícil",
    text: "O que é carência previdenciária?",
    options: [
      "Falta de dinheiro",
      "Número mínimo de contribuições exigidas para concessão de benefício",
      "Período de desemprego",
      "Falta de documentação",
    ],
    correctAnswer: 1,
    explanation:
      "Carência é o número mínimo de contribuições mensais exigidas para que o segurado tenha direito a determinado benefício.",
    source: "Lei 8.213/1991 - Art. 24",
  },
];

export const INSS_VIDEOS: VideoAula[] = [
  {
    id: "inss-v1",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    title: "Introdução ao INSS e Previdência Social",
    channel: "Professor Márcio Flávio",
    level: "iniciante",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo5",
    duration: "20:15",
    description: "Conceitos básicos sobre o INSS, história e estrutura da previdência social.",
  },
  {
    id: "inss-v2",
    concurso: "INSS",
    area: "Benefícios Previdenciários",
    title: "Benefícios do INSS - Aposentadoria e Auxílios",
    channel: "INSS Educação",
    level: "intermediário",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo6",
    duration: "28:45",
    description: "Análise completa dos benefícios previdenciários: aposentadoria, auxílio-doença, pensão.",
  },
  {
    id: "inss-v3",
    concurso: "INSS",
    area: "Segurados e Contribuintes",
    title: "Categorias de Segurados do INSS",
    channel: "Direito Previdenciário Fácil",
    level: "iniciante",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo7",
    duration: "16:30",
    description: "Entenda as diferentes categorias de segurados e suas obrigações.",
  },
  {
    id: "inss-v4",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    title: "Reforma da Previdência - Mudanças Importantes",
    channel: "Análise Jurídica",
    level: "avançado",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo8",
    duration: "32:00",
    description: "Análise das mudanças trazidas pela reforma da previdência de 2019.",
  },
];

export const INSS_LIVROS: Livro[] = [
  {
    id: "inss-l1",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    title: "Direito Previdenciário Simplificado",
    author: "Ibrahim, Fábio Zambitte",
    description: "Guia completo e didático sobre direito previdenciário e legislação do INSS.",
    level: "iniciante",
    isbn: "978-8535930184",
    rating: 4.8,
  },
  {
    id: "inss-l2",
    concurso: "INSS",
    area: "Benefícios Previdenciários",
    title: "Benefícios Previdenciários - Teoria e Prática",
    author: "Rocha, Daniela Teixeira",
    description: "Análise detalhada de todos os benefícios previdenciários com jurisprudência.",
    level: "intermediário",
    isbn: "978-8535921427",
    rating: 4.6,
  },
  {
    id: "inss-l3",
    concurso: "INSS",
    area: "Legislação Previdenciária",
    title: "Lei 8.213/1991 - Comentada",
    author: "Martins, Sérgio Pinto",
    description: "Lei de benefícios da previdência social comentada artigo por artigo.",
    level: "avançado",
    isbn: "978-8535922189",
    rating: 4.7,
  },
];

// ============================================
// TJ SP (TRIBUNAL DE JUSTIÇA DE SÃO PAULO)
// ============================================

export const TJSP_QUESTIONS: Question[] = [
  {
    id: "tjsp-q1",
    concurso: "TJ SP",
    area: "Direito Constitucional",
    difficulty: "médio",
    text: "Qual artigo da CF/88 trata dos direitos e garantias fundamentais?",
    options: [
      "Artigo 1º",
      "Artigo 5º",
      "Artigo 10º",
      "Artigo 37º",
    ],
    correctAnswer: 1,
    explanation:
      "O artigo 5º da Constituição Federal de 1988 é dedicado aos direitos e garantias fundamentais, sendo fundamental para concursos de direito.",
    source: "CF/88 - Art. 5º",
  },
  {
    id: "tjsp-q2",
    concurso: "TJ SP",
    area: "Direito Processual Civil",
    difficulty: "fácil",
    text: "Qual é o prazo para contestação em ação civil ordinária?",
    options: [
      "5 dias",
      "10 dias",
      "15 dias",
      "30 dias",
    ],
    correctAnswer: 2,
    explanation:
      "Conforme CPC/2015, o prazo para contestação é de 15 dias, contados da citação válida.",
    source: "CPC/2015 - Art. 335",
  },
  {
    id: "tjsp-q3",
    concurso: "TJ SP",
    area: "Direito Penal",
    difficulty: "médio",
    text: "O que é dolo eventual?",
    options: [
      "Vontade direta de praticar o crime",
      "Representação do resultado e aceitação do risco",
      "Falta de vontade de praticar o crime",
      "Negligência na execução",
    ],
    correctAnswer: 1,
    explanation:
      "Dolo eventual ocorre quando o agente representa o resultado criminoso como possível e, mesmo assim, realiza a ação, aceitando o risco.",
    source: "CP - Art. 18",
  },
  {
    id: "tjsp-q4",
    concurso: "TJ SP",
    area: "Direito Administrativo",
    difficulty: "fácil",
    text: "Qual é o princípio que exige conformidade com a lei?",
    options: [
      "Princípio da Moralidade",
      "Princípio da Legalidade",
      "Princípio da Publicidade",
      "Princípio da Eficiência",
    ],
    correctAnswer: 1,
    explanation:
      "O princípio da legalidade é fundamental no direito administrativo, exigindo que toda ação administrativa tenha fundamento legal.",
    source: "CF/88 - Art. 37",
  },
  {
    id: "tjsp-q5",
    concurso: "TJ SP",
    area: "Direito Civil",
    difficulty: "médio",
    text: "Qual é a maioridade civil no Brasil?",
    options: [
      "16 anos",
      "18 anos",
      "21 anos",
      "25 anos",
    ],
    correctAnswer: 1,
    explanation:
      "A maioridade civil no Brasil é aos 18 anos, conforme Código Civil Brasileiro.",
    source: "CC - Art. 5º",
  },
];

export const TJSP_VIDEOS: VideoAula[] = [
  {
    id: "tjsp-v1",
    concurso: "TJ SP",
    area: "Direito Constitucional",
    title: "Direito Constitucional Simplificado - Parte 1",
    channel: "Professor Pedro Lenza",
    level: "iniciante",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo9",
    duration: "24:30",
    description: "Aula introdutória sobre direito constitucional com foco em concursos.",
  },
  {
    id: "tjsp-v2",
    concurso: "TJ SP",
    area: "Direito Processual Civil",
    title: "CPC 2015 - Processo Civil Moderno",
    channel: "Professor Fredie Didier Jr.",
    level: "intermediário",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo10",
    duration: "31:15",
    description: "Análise completa do novo código de processo civil.",
  },
  {
    id: "tjsp-v3",
    concurso: "TJ SP",
    area: "Direito Penal",
    title: "Direito Penal - Teoria Geral do Crime",
    channel: "Professor Rogério Sanches",
    level: "intermediário",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo11",
    duration: "28:45",
    description: "Conceitos fundamentais de direito penal para concursos.",
  },
  {
    id: "tjsp-v4",
    concurso: "TJ SP",
    area: "Direito Administrativo",
    title: "Direito Administrativo - Princípios e Atos",
    channel: "Professor Celso Antônio",
    level: "avançado",
    youtubeUrl: "https://www.youtube.com/watch?v=exemplo12",
    duration: "35:20",
    description: "Análise profunda de direito administrativo com jurisprudência.",
  },
];

export const TJSP_LIVROS: Livro[] = [
  {
    id: "tjsp-l1",
    concurso: "TJ SP",
    area: "Direito Constitucional",
    title: "Direito Constitucional Simplificado",
    author: "Lenza, Pedro",
    description: "Referência clássica para concursos com explicações claras e objetivas.",
    level: "intermediário",
    isbn: "978-8535930184",
    rating: 4.8,
  },
  {
    id: "tjsp-l2",
    concurso: "TJ SP",
    area: "Direito Processual Civil",
    title: "Curso de Processo Civil",
    author: "Didier Jr., Fredie",
    description: "Análise completa do processo civil moderno com jurisprudência.",
    level: "avançado",
    isbn: "978-8535921434",
    rating: 4.7,
  },
  {
    id: "tjsp-l3",
    concurso: "TJ SP",
    area: "Direito Penal",
    title: "Direito Penal - Parte Geral",
    author: "Sanches, Rogério",
    description: "Guia prático de direito penal para concursos com casos reais.",
    level: "intermediário",
    isbn: "978-8535922189",
    rating: 4.6,
  },
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

export const CONCURSOS = [
  { id: "banco-brasil", name: "Banco do Brasil", emoji: "🏦" },
  { id: "inss", name: "INSS", emoji: "🏛️" },
  { id: "tjsp", name: "TJ SP", emoji: "⚖️" },
];

export function getQuestionsByConcurso(concurso: string): Question[] {
  if (concurso.includes("Banco do Brasil")) return BANCO_DO_BRASIL_QUESTIONS;
  if (concurso.includes("INSS")) return INSS_QUESTIONS;
  if (concurso.includes("TJ SP")) return TJSP_QUESTIONS;
  return [];
}

export function getVideosByConcurso(concurso: string): VideoAula[] {
  if (concurso.includes("Banco do Brasil")) return BANCO_DO_BRASIL_VIDEOS;
  if (concurso.includes("INSS")) return INSS_VIDEOS;
  if (concurso.includes("TJ SP")) return TJSP_VIDEOS;
  return [];
}

export function getLivrosByConcurso(concurso: string): Livro[] {
  if (concurso.includes("Banco do Brasil")) return BANCO_DO_BRASIL_LIVROS;
  if (concurso.includes("INSS")) return INSS_LIVROS;
  if (concurso.includes("TJ SP")) return TJSP_LIVROS;
  return [];
}

export function getAreasByConcurso(concurso: string): string[] {
  const questions = getQuestionsByConcurso(concurso);
  const areas = new Set(questions.map((q) => q.area));
  return Array.from(areas);
}

export function getQuestionsByArea(concurso: string, area: string): Question[] {
  return getQuestionsByConcurso(concurso).filter((q) => q.area === area);
}

export function getVideosByArea(concurso: string, area: string): VideoAula[] {
  return getVideosByConcurso(concurso).filter((v) => v.area === area);
}

export function getLivrosByArea(concurso: string, area: string): Livro[] {
  return getLivrosByConcurso(concurso).filter((l) => l.area === area);
}
