import AsyncStorage from "@react-native-async-storage/async-storage";

export type Difficulty = "procrastination" | "organization" | "consistency" | "focus";
export type LessonStatus = "pendente" | "continuar" | "concluida";

export interface UserProfile {
  name: string; concurso: string; horasPerDay: number; trabalha: boolean;
  difficulty: Difficulty; onboardingDone: boolean; createdAt: string;
}
export interface DayTask { id:string; title:string; subject:string; durationMin:number; done:boolean; isReview?:boolean; }
export interface Note { id:string; title:string; content:string; area:string; concurso:string; createdAt:number; updatedAt:number; tags:string[]; }
export interface Lesson {
  id:string; title:string; status:LessonStatus; questions:number; correct:number; wrong:number; note:string; updatedAt:number;
}
export interface Subject {
  id:string; name:string; weeklyHours:number; notes:string; lessons:Lesson[];
}
export interface StudyCycle { name:string; subjects:Subject[]; }
export interface AppState {
  profile:UserProfile|null; streak:number; lastStudyDate:string|null; totalHours:number;
  weeklyHours:number[]; todayTasks:DayTask[]; tiredModeActive:boolean; soundEnabled:boolean;
  tasksCompletedTotal:number; notes:Note[]; questionsAnswered:{[key:string]:number};
  cycle:StudyCycle;
}
export const emptyCycle=():StudyCycle=>({name:"Meu ciclo",subjects:[]});
const defaultState:AppState={
  profile:null,streak:0,lastStudyDate:null,totalHours:0,weeklyHours:[0,0,0,0,0,0,0],
  todayTasks:[],tiredModeActive:false,soundEnabled:true,tasksCompletedTotal:0,notes:[],questionsAnswered:{},cycle:emptyCycle()
};
const STORAGE_KEY="@aprova_plus_state";

export async function loadState():Promise<AppState>{
  try{const raw=await AsyncStorage.getItem(STORAGE_KEY);if(!raw)return defaultState;
    const parsed=JSON.parse(raw);return {...defaultState,...parsed,cycle:parsed.cycle||emptyCycle()};
  }catch{return defaultState;}
}
export async function saveState(state:Partial<AppState>):Promise<void>{
  try{const current=await loadState();await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify({...current,...state}));}catch{}
}
export async function clearState(){await AsyncStorage.removeItem(STORAGE_KEY);}
export function generateTodayTasks(profile:UserProfile,tiredMode:boolean):DayTask[]{
  const subjects=profile.concurso?getSubjectsForConcurso(profile.concurso):["Português","Matemática","Direito Constitucional","Informática"];
  const maxTasks=tiredMode?2:Math.min(Math.ceil(profile.horasPerDay*1.5),5);
  const durationMin=tiredMode?20:Math.round((profile.horasPerDay*60)/maxTasks);
  return subjects.slice(0,maxTasks).map((subject,i)=>({id:`task_${Date.now()}_${i}`,title:`Estudar ${subject}`,subject,durationMin,done:false,isReview:i===maxTasks-1}));
}
function getSubjectsForConcurso(concurso:string){const l=concurso.toLowerCase();
  if(l.includes("tjsp")||l.includes("tribunal"))return ["Português","Direito Constitucional","Direito Administrativo","Informática","Revisão Geral"];
  if(l.includes("policia")||l.includes("pc")||l.includes("pm"))return ["Português","Matemática","Direito Penal","Legislação Específica","Revisão"];
  if(l.includes("receita")||l.includes("fiscal"))return ["Português","Matemática","Direito Tributário","Contabilidade","Revisão"];
  return ["Português","Matemática","Direito Constitucional","Conhecimentos Gerais","Revisão"];
}
export function createLesson(title:string):Lesson=>({id:`lesson_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,title,status:"pendente",questions:0,correct:0,wrong:0,note:"",updatedAt:Date.now()});
export function createSubject(name:string):Subject=>({id:`subject_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,name,weeklyHours:0,notes:"",lessons:[]});
export function updateStreak(state:AppState){const today=new Date().toISOString().split("T")[0];if(state.lastStudyDate===today)return{streak:state.streak,lastStudyDate:today};const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];return{streak:state.lastStudyDate===yesterday?state.streak+1:1,lastStudyDate:today};}
