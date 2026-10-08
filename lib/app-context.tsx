import React,{createContext,useContext,useEffect,useState}from"react";
import{AppState,DayTask,UserProfile,StudyCycle,Subject,Lesson,createSubject,generateTodayTasks,loadState,saveState,updateStreak,emptyCycle}from"./store";
import{AuthService}from"./auth-service";import{SyncService}from"./sync-service";
interface AppContextValue{
 state:AppState;isLoading:boolean;isAuthenticated:boolean;userId:string|null;userEmail:string|null;
 completeOnboarding:(profile:UserProfile)=>Promise<void>;toggleTask:(id:string)=>Promise<void>;toggleTiredMode:()=>Promise<void>;toggleSound:()=>Promise<void>;addStudyTime:(m:number)=>Promise<void>;resetApp:()=>Promise<void>;
 login:(e:string,p:string)=>Promise<void>;logout:()=>Promise<void>;signup:(e:string,p:string,n:string)=>Promise<void>;syncToSupabase:()=>Promise<void>;
 saveCycle:(cycle:StudyCycle)=>Promise<void>;advanceCycle:()=>Promise<void>;moveSubject:(subjectId:string,direction:-1|1)=>Promise<void>;updateProfile:(patch:Partial<UserProfile>)=>Promise<void>;updateLesson:(subjectId:string,lessonId:string,patch:Partial<Lesson>)=>Promise<void>;updateSubject:(subjectId:string,patch:Partial<Subject>)=>Promise<void>;addSubject:(name:string)=>Promise<void>;deleteSubject:(subjectId:string)=>Promise<void>;
}
const AppContext=createContext<AppContextValue|null>(null);
const fresh:AppState={profile:null,streak:0,lastStudyDate:null,totalHours:0,weeklyHours:[0,0,0,0,0,0,0],todayTasks:[],tiredModeActive:false,soundEnabled:true,tasksCompletedTotal:0,notes:[],questionsAnswered:{},cycle:emptyCycle()};
export function AppProvider({children}:{children:React.ReactNode}){
 const[state,setState]=useState<AppState>(fresh);const[isLoading,setIsLoading]=useState(true);const[isAuthenticated,setIsAuthenticated]=useState(false);const[userId,setUserId]=useState<string|null>(null);const[userEmail,setUserEmail]=useState<string|null>(null);
 useEffect(()=>{(async()=>{try{const{session,user}=await AuthService.restoreSession();if(session&&user){setIsAuthenticated(true);setUserId(user.id);setUserEmail(user.email||null);await loadSupabaseData(user.id)}setState(await loadState())}catch{setState(await loadState())}finally{setIsLoading(false)}})()},[]);
 const loadSupabaseData=async(uid:string)=>{try{const p=await AuthService.getUserProfile(uid);if(p)setState(s=>({...s,profile:{name:p.name,concurso:p.concurso,horasPerDay:p.horasPerDay,trabalha:p.trabalha,difficulty:p.difficulty,onboardingDone:true,createdAt:p.createdAt}}));const{data}=await SyncService.getUserProgress(uid,1);if(data?.length)setState(s=>({...s,totalHours:data[0].horasEstudadas,tasksCompletedTotal:data[0].tarefasConcluidas,streak:data[0].streak}));}catch{}};
 const persist=async(next:AppState)=>{setState(next);await saveState(next)};
 const completeOnboarding=async(profile:UserProfile)=>{const next={...state,profile,todayTasks:generateTodayTasks(profile,false)};await persist(next);if(isAuthenticated&&userId)await AuthService.updateUserProfile(userId,{name:profile.name,concurso:profile.concurso,horasPerDay:profile.horasPerDay,trabalha:profile.trabalha,difficulty:profile.difficulty}as any)};
 const toggleTask=async(id:string)=>{const tasks=state.todayTasks.map(t=>t.id===id?{...t,done:!t.done}:t);const done=tasks.find(t=>t.id===id)?.done;const streak=done?updateStreak(state):{streak:state.streak,lastStudyDate:state.lastStudyDate};await persist({...state,todayTasks:tasks,tasksCompletedTotal:state.tasksCompletedTotal+(done?1:-1),...streak})};
 const toggleTiredMode=async()=>{const active=!state.tiredModeActive;await persist({...state,tiredModeActive:active,todayTasks:state.profile?generateTodayTasks(state.profile,active):state.todayTasks})};
 const toggleSound=async()=>persist({...state,soundEnabled:!state.soundEnabled});
 const addStudyTime=async(m:number)=>{const weekly=[...state.weeklyHours];weekly[new Date().getDay()]=(weekly[new Date().getDay()]||0)+m/60;await persist({...state,totalHours:state.totalHours+m/60,weeklyHours:weekly,...updateStreak(state)})};
 const resetApp=async()=>{await persist(fresh);if(isAuthenticated)await logout()};
 const login=async(e:string,p:string)=>{const r=await AuthService.login(e,p);if(r.error||!r.user)throw new Error(r.error||"Falha ao fazer login");setIsAuthenticated(true);setUserId(r.user.id);setUserEmail(r.user.email||null);await loadSupabaseData(r.user.id)};
 const logout=async()=>{const r=await AuthService.logout();if(r.error)throw new Error(r.error);setIsAuthenticated(false);setUserId(null);setUserEmail(null);await persist(fresh)};
 const signup=async(e:string,p:string,n:string)=>{const r=await AuthService.signup(e,p,{email:e,name:n,concurso:"",horasPerDay:2,trabalha:false,difficulty:"procrastination"});if(r.error||!r.user)throw new Error(r.error||"Falha ao criar conta");setIsAuthenticated(true);setUserId(r.user.id);setUserEmail(r.user.email||null)};
 const syncToSupabase=async()=>{if(!isAuthenticated||!userId)return;await SyncService.syncDailyProgress(userId,{horasEstudadas:state.totalHours,tarefasConcluidas:state.tasksCompletedTotal,streak:state.streak}as any)};
 const saveCycle=async(cycle:StudyCycle)=>persist({...state,cycle});
 const advanceCycle=async()=>{const subjects=state.cycle.subjects;if(!subjects.length)return;const cursor=state.cycle.cursor||0;let next=(cursor+1)%subjects.length;let checked=0;while(checked<subjects.length&&subjects[next].lessons.every(l=>l.status==="concluida")){next=(next+1)%subjects.length;checked++;}await saveCycle({...state.cycle,cursor:next});};
 const moveSubject=async(subjectId:string,direction:-1|1)=>{const subjects=[...state.cycle.subjects];const i=subjects.findIndex(s=>s.id===subjectId);const j=i+direction;if(i<0||j<0||j>=subjects.length)return;[subjects[i],subjects[j]]=[subjects[j],subjects[i]];await saveCycle({...state.cycle,subjects})};
 const updateProfile=async(patch:Partial<UserProfile>)=>{const profile=state.profile?{...state.profile,...patch}:null;if(!profile)return;await persist({...state,profile});if(isAuthenticated&&userId)await AuthService.updateUserProfile(userId,patch as any)};
 const updateLesson=async(sid:string,lid:string,patch:Partial<Lesson>)=>{const cycle={...state.cycle,subjects:state.cycle.subjects.map(s=>s.id===sid?{...s,lessons:s.lessons.map(l=>l.id===lid?{...l,...patch,updatedAt:Date.now()}:l)}:s)};await saveCycle(cycle)};
 const updateSubject=async(sid:string,patch:Partial<Subject>)=>saveCycle({...state.cycle,subjects:state.cycle.subjects.map(s=>s.id===sid?{...s,...patch}:s)});
 const addSubject=async(name:string)=>{const n=name.trim();if(!n)return;await saveCycle({...state.cycle,subjects:[...state.cycle.subjects,createSubject(n)]})};
 const deleteSubject=async(sid:string)=>saveCycle({...state.cycle,subjects:state.cycle.subjects.filter(s=>s.id!==sid)});
 return <AppContext.Provider value={{state,isLoading,isAuthenticated,userId,userEmail,completeOnboarding,toggleTask,toggleTiredMode,toggleSound,addStudyTime,resetApp,login,logout,signup,syncToSupabase,saveCycle,advanceCycle,moveSubject,updateProfile,updateLesson,updateSubject,addSubject,deleteSubject}}>{children}</AppContext.Provider>
}
export function useApp(){const c=useContext(AppContext);if(!c)throw new Error("useApp must be used within AppProvider");return c}
