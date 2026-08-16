import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialFurniture, initialGoals, initialRewards, initialTasks } from '@/data/mock';
import { CheckIn, FurnitureItem, Goal, Reward, Season, Task, TaskStatus } from '@/types';

type TaskEdit = Partial<Pick<Task, 'title' | 'type' | 'duration' | 'scheduledStart' | 'locked'>>;
type Store = { tasks:Task[]; goals:Goal[]; checkIn:CheckIn; coins:number; lifeProgress:number; season:Season; furniture:FurnitureItem[]; rewards:Reward[]; travelFund:number; visitedDestinations:string[]; currentDestination:string; setCheckIn:(v:Partial<CheckIn>)=>void; setSeason:(s:Season)=>void; updateTask:(id:string,status:TaskStatus)=>void; editTask:(id:string,patch:TaskEdit)=>void; reorderTask:(id:string,targetIndex:number)=>void; replan:(hours:number)=>void; addParsedTasks:(tasks:Task[])=>void; buyItem:(id:string)=>void; moveItem:(id:string,x:number,y:number)=>void; addReward:(title:string,cost:number)=>void; deleteReward:(id:string)=>void; redeemReward:(cost:number)=>void; fundTravel:(amount:number)=>void; startTrip:(id:string,cost:number)=>void };

const addMinutes = (time:string,duration:number) => {
 const [hours,minutes]=time.split(':').map(Number);
 if(!Number.isFinite(hours)||!Number.isFinite(minutes)) return time;
 const total=(hours*60+minutes+duration)%(24*60);
 return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
};
export const usePlannerStore = create<Store>()(persist((set)=>({
 tasks:initialTasks,goals:initialGoals,checkIn:{wakeUp:'12:40',energy:3,focusedHours:4,fixedPlan:'17:00 Research meeting'},coins:460,lifeProgress:38,season:'Autumn',furniture:initialFurniture,rewards:initialRewards,travelFund:140,visitedDestinations:['london'],currentDestination:'london',
 setCheckIn:(v)=>set(s=>({checkIn:{...s.checkIn,...v}})), setSeason:(season)=>set({season}),
 updateTask:(id,status)=>set(s=>{const task=s.tasks.find(t=>t.id===id); const earned=status==='done'&&task&&task.status!=='done'?task.coins:0; return {tasks:s.tasks.map(t=>t.id===id?{...t,status}:t),coins:s.coins+earned,lifeProgress:Math.min(100,s.lifeProgress+(earned?1:0))}}),
 editTask:(id,patch)=>set(s=>({tasks:s.tasks.map(task=>{if(task.id!==id)return task; const next={...task,...patch}; return {...next,scheduledEnd:addMinutes(next.scheduledStart,next.duration)};})})),
 reorderTask:(id,targetIndex)=>set(s=>{
  const fromIndex=s.tasks.findIndex(task=>task.id===id);
  if(fromIndex<0||s.tasks[fromIndex].locked)return s;
  const movableIndices=s.tasks.map((task,index)=>task.locked?-1:index).filter(index=>index>=0);
  const fromRank=movableIndices.indexOf(fromIndex);
  const nearestTarget=movableIndices.reduce((best,index)=>Math.abs(index-targetIndex)<Math.abs(best-targetIndex)?index:best,movableIndices[0]);
  const targetRank=movableIndices.indexOf(nearestTarget);
  if(fromRank===targetRank)return s;
  const reordered=movableIndices.map(index=>s.tasks[index]);
  const [moved]=reordered.splice(fromRank,1);
  reordered.splice(targetRank,0,moved);
  const slots=s.tasks.map(task=>task.scheduledStart);
  const tasks=[...s.tasks];
  movableIndices.forEach((index,rank)=>{const task=reordered[rank];tasks[index]={...task,scheduledStart:slots[index],scheduledEnd:addMinutes(slots[index],task.duration)};});
  return {tasks};
 }),
 replan:(hours)=>set(s=>({checkIn:{...s.checkIn,focusedHours:hours},tasks:s.tasks.map((t,i)=>t.locked?t:{...t,scheduledStart:['14:30','15:20','16:00','17:00','18:30'][i]||t.scheduledStart})})),
 addParsedTasks:(tasks)=>set(s=>({tasks:[...s.tasks,...tasks]})),
 buyItem:(id)=>set(s=>{const item=s.furniture.find(i=>i.id===id); if(!item||item.owned||s.coins<item.cost)return s; return {coins:s.coins-item.cost,furniture:s.furniture.map(i=>i.id===id?{...i,owned:true}:i)}}),
 moveItem:(id,x,y)=>set(s=>({furniture:s.furniture.map(i=>i.id===id?{...i,x,y}:i)})),
 addReward:(title,cost)=>set(s=>({rewards:[...s.rewards,{id:Date.now().toString(),title,cost}]})),deleteReward:(id)=>set(s=>({rewards:s.rewards.filter(r=>r.id!==id)})),redeemReward:(cost)=>set(s=>s.coins<cost?s:{coins:s.coins-cost}),
 fundTravel:(amount)=>set(s=>s.coins<amount?s:{coins:s.coins-amount,travelFund:(s.travelFund??0)+amount}),
 startTrip:(id,cost)=>set(s=>(s.travelFund??0)<cost?s:{travelFund:(s.travelFund??0)-cost,currentDestination:id,visitedDestinations:Array.from(new Set([...(s.visitedDestinations??[]),id])),lifeProgress:Math.min(100,s.lifeProgress+2)}),
}),{name:'cozy-planner-v1',storage:createJSONStorage(()=>AsyncStorage)}));

