import { FurnitureItem, Goal, Reward, Task } from '@/types';
export const initialTasks: Task[] = [
 {id:'rp',title:'Write RP Outline',type:'flexible',duration:80,deadline:'Friday',priority:'high',effort:'high',goalId:'phd',scheduledStart:'14:00',scheduledEnd:'15:20',status:'todo',locked:false,nextAction:'Create 3 rough headings',coins:45},
 {id:'break',title:'Mindful break',type:'routine',duration:15,priority:'low',effort:'low',scheduledStart:'15:20',scheduledEnd:'15:35',status:'todo',locked:false,coins:5},
 {id:'cantonese',title:'Cantonese',type:'routine',duration:30,priority:'medium',effort:'medium',goalId:'language',scheduledStart:'15:35',scheduledEnd:'16:05',status:'todo',locked:false,nextAction:'Review today’s 10 words',coins:20},
 {id:'meeting',title:'Research meeting',type:'fixed',duration:60,priority:'high',effort:'medium',scheduledStart:'17:00',scheduledEnd:'18:00',status:'todo',locked:true,coins:25},
 {id:'data',title:'Combine Data',type:'flexible',duration:90,deadline:'Sunday',priority:'high',effort:'high',goalId:'work',scheduledStart:'19:00',scheduledEnd:'20:30',status:'todo',locked:false,nextAction:'Merge the first two files',coins:50},
];
export const initialGoals: Goal[] = [
 {id:'phd',title:'PhD Application',status:'focus',progress:65,currentFocus:['Supervisor outreach','RP development'],milestones:['Research proposal ready','Contact 5 supervisors','Submit applications']},
 {id:'work',title:'Work',status:'focus',progress:42,currentFocus:['Complete analysis'],milestones:['Combine datasets','Review findings']},
 {id:'language',title:'Cantonese',status:'maintenance',progress:60,currentFocus:['Daily listening'],milestones:['A2 conversation practice']},
 {id:'coding',title:'AI Coding',status:'shelved',progress:24,currentFocus:['Rest without guilt'],milestones:['Return when there is space']},
];
export const initialRewards: Reward[] = [{id:'coffee',title:'Specialty coffee',cost:150},{id:'movie',title:'Movie night',cost:250},{id:'game',title:'New game',cost:800},{id:'dinner',title:'Nice dinner',cost:1000},{id:'trip',title:'Trip fund',cost:5000}];
export const initialFurniture: FurnitureItem[] = [{id:'plant',title:'Plant',category:'Plants',cost:120,x:78,y:58,owned:true},{id:'lamp',title:'Lamp',category:'Decor',cost:80,x:20,y:48,owned:true},{id:'chair',title:'Chair',category:'Furniture',cost:150,x:60,y:68,owned:true},{id:'sofa',title:'Sofa',category:'Furniture',cost:300,x:12,y:72,owned:false},{id:'table',title:'Table',category:'Furniture',cost:120,x:43,y:76,owned:true},{id:'books',title:'Bookshelf',category:'Furniture',cost:200,x:82,y:32,owned:true}];
