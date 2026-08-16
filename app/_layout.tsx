import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AIInputSheet } from '@/components/ai/AIInputSheet';
import { colors, shadow } from '@/constants/theme';
export default function RootLayout(){const [ai,setAi]=useState(false);return <SafeAreaProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false}}/><Pressable accessibilityLabel="Open planning assistant" onPress={()=>setAi(true)} style={s.ai}><Text style={s.sparkle}>✦</Text></Pressable><AIInputSheet visible={ai} onClose={()=>setAi(false)}/></SafeAreaProvider>}
const s=StyleSheet.create({ai:{position:'absolute',right:18,bottom:82,width:50,height:50,borderRadius:25,backgroundColor:colors.ink,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:colors.cream,...shadow},sparkle:{color:colors.white,fontSize:22}});

