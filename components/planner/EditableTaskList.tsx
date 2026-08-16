import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Chip, Label } from '@/components/common/UI';
import { colors, radius, shadow } from '@/constants/theme';
import { usePlannerStore } from '@/store/usePlannerStore';
import { Task, TaskType } from '@/types';

const tint:Record<TaskType,string>={fixed:colors.peach,flexible:colors.lavender,routine:colors.sage};

export function EditableTaskList({tasks,mode}:{tasks:Task[];mode:'Cards'|'Timeline'}){
 const {updateTask,editTask,deleteTask,reorderTask}=usePlannerStore();
 const [editing,setEditing]=useState<Task|null>(null);
 const [deleting,setDeleting]=useState<Task|null>(null);
 return <>
  {tasks.map((task,index)=><DraggableTask key={task.id} task={task} index={index} count={tasks.length} mode={mode} onEdit={()=>setEditing(task)} onDelete={()=>setDeleting(task)} onToggle={()=>updateTask(task.id,task.status==='done'?'todo':'done')} onToggleFixed={()=>editTask(task.id,task.locked||task.type==='fixed'?{locked:false,type:'flexible'}:{locked:true,type:'fixed'})} onReorder={reorderTask}/>) }
  <TaskEditor task={editing} close={()=>setEditing(null)} save={(patch)=>{if(editing)editTask(editing.id,patch);setEditing(null)}}/>
  <DeleteTaskDialog task={deleting} cancel={()=>setDeleting(null)} confirm={()=>{if(deleting)deleteTask(deleting.id);setDeleting(null)}}/>
 </>;
}

function DraggableTask({task,index,count,mode,onEdit,onDelete,onToggle,onToggleFixed,onReorder}:{task:Task;index:number;count:number;mode:'Cards'|'Timeline';onEdit:()=>void;onDelete:()=>void;onToggle:()=>void;onToggleFixed:()=>void;onReorder:(id:string,targetIndex:number)=>void}){
 const dragY=useRef(new Animated.Value(0)).current;
 const [dragging,setDragging]=useState(false);
 const rowHeight=mode==='Cards'?88:64;
 const responder=useMemo(()=>PanResponder.create({
  onStartShouldSetPanResponder:()=>!task.locked,
  onMoveShouldSetPanResponder:(_,gesture)=>!task.locked&&Math.abs(gesture.dy)>3,
  onPanResponderGrant:()=>setDragging(true),
  onPanResponderMove:(_,gesture)=>dragY.setValue(gesture.dy),
  onPanResponderRelease:(_,gesture)=>{
   const target=Math.max(0,Math.min(count-1,index+Math.round(gesture.dy/rowHeight)));
   if(target!==index)onReorder(task.id,target);
   Animated.spring(dragY,{toValue:0,useNativeDriver:true,speed:24,bounciness:3}).start(()=>setDragging(false));
  },
  onPanResponderTerminate:()=>Animated.spring(dragY,{toValue:0,useNativeDriver:true}).start(()=>setDragging(false)),
 }),[count,dragY,index,onReorder,rowHeight,task.id,task.locked]);
 return <Animated.View style={[styles.task,mode==='Cards'&&styles.taskCard,task.status==='done'&&styles.taskDone,dragging&&styles.dragging,{transform:[{translateY:dragY}]}]}>
  <View style={styles.timeCol}><Text style={styles.time}>{task.scheduledStart}</Text>{mode==='Timeline'&&index<count-1?<View style={styles.thread}/>:null}</View>
  <View style={[styles.typeLine,{backgroundColor:tint[task.type]}]}/>
  <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${task.title}`} onPress={onEdit} style={styles.taskContent}>
   <Text style={[styles.taskTitle,task.status==='done'&&styles.struck]}>{task.locked?'🔒 ':''}{task.title}</Text>
   <Text style={[styles.taskMeta,task.status==='done'&&styles.struck]}>{task.duration} min · {task.type}</Text>
  </Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel={task.locked?`Make ${task.title} flexible`:`Make ${task.title} a fixed plan`} onPress={onToggleFixed} style={[styles.actionIcon,task.locked&&styles.pinned]}><Ionicons name={task.locked?'pin':'pin-outline'} color={task.locked?colors.coral:colors.muted} size={17}/></Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel={task.status==='done'?`Restore ${task.title}`:`Cross out ${task.title} as done`} onPress={onToggle} style={[styles.actionIcon,task.status==='done'&&styles.doneAction]}><Ionicons name={task.status==='done'?'refresh-outline':'remove-outline'} color={task.status==='done'?colors.green:colors.muted} size={18}/></Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${task.title}`} onPress={onDelete} style={styles.actionIcon}><Ionicons name="trash-outline" color={colors.coral} size={17}/></Pressable>
  <View accessibilityLabel={task.locked?'Unlock this task to move it':'Drag to reschedule'} style={[styles.handle,task.locked&&styles.handleLocked]} {...(!task.locked?responder.panHandlers:{})}>
   <Ionicons name={task.locked?'lock-closed-outline':'reorder-three-outline'} size={20} color={task.locked?colors.muted:colors.ink}/>
  </View>
 </Animated.View>;
}

type TaskPatch=Partial<Pick<Task,'title'|'type'|'duration'|'scheduledStart'|'locked'>>;
function TaskEditor({task,close,save}:{task:Task|null;close:()=>void;save:(patch:TaskPatch)=>void}){
 const [title,setTitle]=useState('');
 const [start,setStart]=useState('');
 const [duration,setDuration]=useState('');
 const [type,setType]=useState<TaskType>('flexible');
 const [locked,setLocked]=useState(false);
 useEffect(()=>{if(task){setTitle(task.title);setStart(task.scheduledStart);setDuration(String(task.duration));setType(task.type);setLocked(task.locked);}},[task]);
 const validTime=/^([01]\d|2[0-3]):[0-5]\d$/.test(start);
 const validDuration=Number(duration)>0;
 return <Modal visible={!!task} transparent animationType="slide" onRequestClose={close}>
  <Pressable style={styles.backdrop} onPress={close}/>
  <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={styles.sheet}>
   <View style={styles.editorHeader}><View><Label>Edit plan</Label><Text style={styles.editorTitle}>Adjust this task</Text></View><Pressable accessibilityLabel="Close editor" onPress={close}><Ionicons name="close" size={25} color={colors.ink}/></Pressable></View>
   <Label>Task name</Label><TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="What do you want to do?"/>
   <View style={styles.fields}><View style={styles.field}><Label>Start time</Label><TextInput value={start} onChangeText={setStart} style={[styles.input,!validTime&&styles.inputError]} placeholder="14:30" inputMode="numeric"/></View><View style={styles.field}><Label>Minutes</Label><TextInput value={duration} onChangeText={setDuration} style={[styles.input,!validDuration&&styles.inputError]} placeholder="45" inputMode="numeric"/></View></View>
   <Label>Type</Label><View style={styles.chips}>{(['flexible','routine','fixed'] as TaskType[]).map(value=><Chip key={value} label={value} active={type===value} tint={tint[value]} onPress={()=>{setType(value);if(value==='fixed')setLocked(true)}}/>)}</View>
   <Pressable onPress={()=>setLocked(value=>!value)} style={styles.lockRow}><Ionicons name={locked?'lock-closed':'lock-open-outline'} size={20} color={locked?colors.coral:colors.green}/><View style={{flex:1}}><Text style={styles.lockTitle}>{locked?'Fixed in place':'Can be moved'}</Text><Text style={styles.lockHelp}>{locked?'Unlock it before dragging.':'Use the drag handle to reschedule it.'}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted}/></Pressable>
   <Button style={!title.trim()||!validTime||!validDuration?styles.disabled:undefined} onPress={!title.trim()||!validTime||!validDuration?undefined:()=>save({title:title.trim(),scheduledStart:start,duration:Number(duration),type,locked})}>Save changes</Button>
  </KeyboardAvoidingView>
 </Modal>;
}

function DeleteTaskDialog({task,cancel,confirm}:{task:Task|null;cancel:()=>void;confirm:()=>void}){
 return <Modal visible={!!task} transparent animationType="fade" onRequestClose={cancel}><Pressable style={styles.confirmBackdrop} onPress={cancel}/><View style={styles.confirmCard}><View style={styles.deleteIcon}><Ionicons name="trash-outline" size={23} color={colors.coral}/></View><Text style={styles.confirmTitle}>Delete this task?</Text><Text style={styles.confirmCopy}>“{task?.title}” will be removed from Today, Fixed plans, and Calendar.</Text><View style={styles.confirmActions}><Button kind="ghost" style={{flex:1}} onPress={cancel}>Cancel</Button><Pressable accessibilityRole="button" onPress={confirm} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Delete task</Text></Pressable></View></View></Modal>;
}

const styles=StyleSheet.create({
 task:{flexDirection:'row',minHeight:64,alignItems:'flex-start',position:'relative'},taskCard:{backgroundColor:colors.paper,borderWidth:1,borderColor:colors.line,borderRadius:radius.md,padding:12,marginBottom:8},taskDone:{opacity:.58},struck:{textDecorationLine:'line-through',textDecorationStyle:'solid'},dragging:{zIndex:20,opacity:.96,...shadow},timeCol:{width:52,alignItems:'flex-start',height:'100%'},time:{fontSize:12,fontWeight:'700',color:colors.muted},thread:{position:'absolute',left:5,top:21,bottom:-10,width:1,backgroundColor:colors.line},typeLine:{width:4,height:38,borderRadius:3,marginRight:12},taskContent:{flex:1,minHeight:42},taskTitle:{fontSize:14,fontWeight:'700',color:colors.ink},taskMeta:{fontSize:11,color:colors.muted,marginTop:4,textTransform:'capitalize'},actionIcon:{width:28,height:32,alignItems:'center',justifyContent:'center',marginTop:-5},pinned:{backgroundColor:colors.peach,borderRadius:10},doneAction:{backgroundColor:colors.sage,borderRadius:10},handle:{width:28,height:32,alignItems:'center',justifyContent:'center',marginTop:-5,cursor:'grab' as never},handleLocked:{opacity:.65},backdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(50,48,44,.3)'},sheet:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:colors.cream,borderTopLeftRadius:28,borderTopRightRadius:28,padding:24,paddingBottom:Platform.OS==='ios'?42:28,gap:10},editorHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:4},editorTitle:{fontSize:25,fontWeight:'700',color:colors.ink,marginTop:4},input:{backgroundColor:colors.paper,borderWidth:1,borderColor:colors.line,borderRadius:12,paddingHorizontal:13,paddingVertical:12,fontSize:15,color:colors.ink},inputError:{borderColor:colors.coral},fields:{flexDirection:'row',gap:10},field:{flex:1},chips:{flexDirection:'row',gap:7,flexWrap:'wrap',marginBottom:2},lockRow:{flexDirection:'row',alignItems:'center',gap:11,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:13,marginVertical:4},lockTitle:{fontSize:14,fontWeight:'700',color:colors.ink},lockHelp:{fontSize:11,color:colors.muted,marginTop:2},disabled:{opacity:.45},confirmBackdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(50,48,44,.4)'},confirmCard:{position:'absolute',left:24,right:24,top:'32%',backgroundColor:colors.cream,borderRadius:24,padding:22,alignItems:'center',...shadow},deleteIcon:{width:48,height:48,borderRadius:24,backgroundColor:colors.peach,alignItems:'center',justifyContent:'center',marginBottom:12},confirmTitle:{fontSize:22,fontWeight:'800',color:colors.ink},confirmCopy:{fontSize:13,lineHeight:19,color:colors.muted,textAlign:'center',marginTop:7},confirmActions:{flexDirection:'row',gap:10,marginTop:20,width:'100%'},deleteButton:{flex:1,minHeight:46,borderRadius:14,backgroundColor:colors.coral,alignItems:'center',justifyContent:'center'},deleteButtonText:{color:colors.white,fontSize:14,fontWeight:'800'},
});

