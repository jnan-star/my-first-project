export type TaskType = 'fixed' | 'flexible' | 'routine';
export type TaskStatus = 'todo' | 'inProgress' | 'partial' | 'done';
export type Level = 'low' | 'medium' | 'high';
export interface Task { id:string; title:string; type:TaskType; duration:number; deadline?:string; priority:Level; effort:Level; goalId?:string; scheduledStart:string; scheduledEnd:string; status:TaskStatus; locked:boolean; nextAction?:string; coins:number }
export type GoalStatus = 'focus' | 'maintenance' | 'shelved';
export interface Goal { id:string; title:string; status:GoalStatus; progress:number; currentFocus:string[]; milestones:string[] }
export interface CheckIn { wakeUp:string; energy:number; focusedHours:number; fixedPlan:string }
export type Season = 'Spring'|'Summer'|'Autumn'|'Winter';
export interface Reward { id:string; title:string; cost:number }
export interface FurnitureItem { id:string; title:string; category:'Furniture'|'Decor'|'Plants'|'Wall & Floor'; cost:number; x:number; y:number; owned:boolean }

