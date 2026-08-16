import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Chip, ScreenHeader } from '@/components/common/UI';
import { colors } from '@/constants/theme';
import { usePlannerStore } from '@/store/usePlannerStore';
import { Task, TaskType } from '@/types';

type CalendarView='Day'|'Week'|'Month';
const typeColor:Record<TaskType,string>={fixed:colors.peach,flexible:colors.lavender,routine:colors.sage};
const hours=[12,13,14,15,16,17,18,19,20];
const weekDays=['M 10','T 11','W 12','T 13','F 14','S 15','S 16'];
const monthWeekDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const HOUR_HEIGHT=60;
const calendarMinutes=(time:string)=>{const [hour,minute]=time.split(':').map(Number);return hour*60+minute;};
const eventTop=(task:Task)=>Math.max(0,(calendarMinutes(task.scheduledStart)-12*60)*HOUR_HEIGHT/60)+8;
const eventHeight=(task:Task)=>Math.max(38,task.duration*HOUR_HEIGHT/60-4);

export default function Calendar(){
 const [view,setView]=useState<CalendarView>('Week');
 const tasks=usePlannerStore(state=>state.tasks).slice(0,5);
 return <SafeAreaView style={s.safe} edges={['top']}><ScrollView contentContainerStyle={s.page}>
  <ScreenHeader eyebrow={view==='Month'?'August 2026':view==='Day'?'Sunday, 16 August':'August 10 – 16'} title="Calendar" right={<Pressable accessibilityRole="button" onPress={()=>setView('Day')}><Text style={s.today}>Today</Text></Pressable>}/>
  <View style={s.switch}>{(['Day','Week','Month'] as CalendarView[]).map(value=><Chip key={value} label={value} active={view===value} tint={colors.blue} onPress={()=>setView(value)}/>)}</View>
  <View style={s.legend}>{(['fixed','flexible','routine'] as TaskType[]).map(type=><Text key={type} style={s.legendText}><Text style={{color:typeColor[type]}}>● </Text>{type}</Text>)}<Text style={s.legendText}><Text style={{color:colors.yellow}}>● </Text>deadline</Text></View>
  {view==='Day'?<DayView tasks={tasks}/>:view==='Week'?<WeekView tasks={tasks}/>:<MonthView tasks={tasks}/>} 
  <Text style={s.tip}>Day shows the detailed schedule, Week shows where today sits, and Month gives the whole month at a glance.</Text>
 </ScrollView></SafeAreaView>;
}

function DayView({tasks}:{tasks:Task[]}){
 return <Card style={s.calendar}><View style={s.dayViewHeader}><View><Text style={s.dayEyebrow}>SUNDAY</Text><Text style={s.dayTitle}>16 August</Text></View><Text style={s.taskCount}>{tasks.length} plans</Text></View><TimelineGrid tasks={tasks} eventStyle={s.dayEvent}/></Card>;
}

function WeekView({tasks}:{tasks:Task[]}){
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalCalendar}><Card style={{...s.calendar,...s.weekCard}}>
  <View style={s.weekHeader}><View style={s.hourGutter}/>{weekDays.map((day,index)=><View key={day} style={[s.weekDay,index===6&&s.selected]}><Text style={s.weekDayText}>{day}</Text></View>)}</View>
  <View style={s.weekGrid}>{hours.map(hour=><View key={hour} style={s.weekHour}><Text style={s.hourText}>{hour}:00</Text><View style={s.hourLine}/></View>)}
   {tasks.map(task=><View key={task.id} style={[s.event,s.weekEvent,{top:eventTop(task),height:eventHeight(task),backgroundColor:typeColor[task.type]}]}><Text numberOfLines={2} style={[s.eventTitle,task.status==='done'&&s.struck]}>{task.locked?'🔒 ':''}{task.title}</Text><Text style={s.eventTime}>{task.scheduledStart}</Text></View>)}
  </View>
 </Card></ScrollView>;
}

function TimelineGrid({tasks,eventStyle}:{tasks:Task[];eventStyle:object}){
 return <View style={s.dayGrid}>{hours.map(hour=><View key={hour} style={s.dayHour}><Text style={s.hourText}>{hour}:00</Text><View style={s.hourLine}/></View>)}
  <View style={[s.nowLine,{top:(14*60+20-12*60)*HOUR_HEIGHT/60}]}><View style={s.nowDot}/></View>
  {tasks.map(task=><View key={task.id} style={[s.event,eventStyle,{top:eventTop(task),height:eventHeight(task),backgroundColor:typeColor[task.type]}]}><Text numberOfLines={2} style={[s.eventTitle,task.status==='done'&&s.struck]}>{task.locked?'🔒 ':''}{task.title}</Text><Text style={s.eventTime}>{task.scheduledStart} · {task.duration} min</Text></View>)}
 </View>;
}

function MonthView({tasks}:{tasks:Task[]}){
 const days=Array.from({length:42},(_,index)=>index-5);
 return <Card style={{...s.calendar,...s.monthCard}}><View style={s.monthHeader}>{monthWeekDays.map(day=><Text key={day} style={s.monthWeekDay}>{day}</Text>)}</View><View style={s.monthGrid}>{days.map((day,index)=>{
  const inMonth=day>=1&&day<=31;const isToday=day===16;
  return <View key={index} style={[s.monthCell,isToday&&s.monthToday,!inMonth&&s.outside]}>{inMonth&&<><Text style={[s.monthNumber,isToday&&s.monthNumberToday]}>{day}</Text>{isToday&&<View style={s.monthTasks}>{tasks.slice(0,3).map(task=><Text numberOfLines={1} key={task.id} style={[s.monthTask,task.status==='done'&&s.struck]}><Text style={{color:typeColor[task.type]}}>● </Text>{task.title}</Text>)}{tasks.length>3&&<Text style={s.moreTasks}>+{tasks.length-3} more</Text>}</View>}</>}</View>;
 })}</View></Card>;
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:colors.cream},page:{padding:20,paddingBottom:120},today:{fontSize:12,fontWeight:'700',color:colors.green,borderWidth:1,borderColor:colors.sage,borderRadius:20,paddingHorizontal:12,paddingVertical:7},switch:{flexDirection:'row',gap:7,marginBottom:15},legend:{flexDirection:'row',gap:10,flexWrap:'wrap',marginBottom:12},legendText:{fontSize:10,color:colors.muted,textTransform:'capitalize'},calendar:{padding:10,overflow:'hidden'},dayViewHeader:{height:55,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:8,borderBottomWidth:1,borderColor:colors.line},dayEyebrow:{fontSize:9,fontWeight:'800',letterSpacing:1,color:colors.muted},dayTitle:{fontSize:18,fontWeight:'800',color:colors.ink,marginTop:2},taskCount:{fontSize:11,color:colors.green,backgroundColor:colors.sage,paddingHorizontal:10,paddingVertical:6,borderRadius:12},dayGrid:{height:hours.length*HOUR_HEIGHT,position:'relative'},dayHour:{height:HOUR_HEIGHT,flexDirection:'row',alignItems:'flex-start'},weekGrid:{height:hours.length*HOUR_HEIGHT,position:'relative'},weekHour:{height:HOUR_HEIGHT,flexDirection:'row',alignItems:'flex-start'},hourGutter:{width:48},hourText:{width:48,fontSize:9,color:colors.muted,marginTop:-5},hourLine:{flex:1,borderTopWidth:1,borderColor:colors.line},nowLine:{position:'absolute',left:48,right:0,height:1,backgroundColor:colors.coral,zIndex:4},nowDot:{width:7,height:7,borderRadius:4,backgroundColor:colors.coral,marginTop:-3},event:{position:'absolute',borderRadius:10,padding:7,borderLeftWidth:3,borderLeftColor:'rgba(70,70,70,.25)',overflow:'hidden'},dayEvent:{left:58,right:8},eventTitle:{fontSize:10,fontWeight:'800',color:colors.ink},eventTime:{fontSize:8,color:colors.muted,marginTop:3},struck:{textDecorationLine:'line-through'},horizontalCalendar:{paddingBottom:4},weekCard:{width:760},weekHeader:{height:38,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:colors.line},weekDay:{width:100,alignItems:'center',paddingVertical:7,borderRadius:11},weekDayText:{fontSize:10,color:colors.muted,fontWeight:'800'},selected:{backgroundColor:colors.yellow},weekEvent:{left:48+6*100+5,width:90},monthCard:{padding:0},monthHeader:{flexDirection:'row',borderBottomWidth:1,borderColor:colors.line},monthWeekDay:{width:'14.2857%',textAlign:'center',fontSize:9,fontWeight:'800',color:colors.muted,paddingVertical:10},monthGrid:{flexDirection:'row',flexWrap:'wrap'},monthCell:{width:'14.2857%',minHeight:82,borderRightWidth:1,borderBottomWidth:1,borderColor:colors.line,padding:6},monthToday:{backgroundColor:'#FFF8DA'},outside:{backgroundColor:'rgba(240,237,230,.35)'},monthNumber:{fontSize:11,fontWeight:'700',color:colors.muted},monthNumberToday:{color:colors.ink,backgroundColor:colors.yellow,borderRadius:10,alignSelf:'flex-start',paddingHorizontal:6,paddingVertical:2},monthTasks:{marginTop:4,gap:2},monthTask:{fontSize:7,fontWeight:'700',color:colors.ink},moreTasks:{fontSize:7,color:colors.coral,fontWeight:'800'},tip:{fontSize:12,textAlign:'center',color:colors.muted,lineHeight:18,marginTop:14,paddingHorizontal:20},
});

