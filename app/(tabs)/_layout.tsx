import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
const icons:Record<string,keyof typeof Ionicons.glyphMap>={today:'sunny-outline',calendar:'calendar-clear-outline',goals:'flag-outline','my-space':'airplane-outline'};
export default function TabsLayout(){return <Tabs screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:colors.ink,tabBarInactiveTintColor:'#9B9D99',tabBarStyle:{height:72,paddingTop:7,paddingBottom:9,backgroundColor:colors.paper,borderTopColor:colors.line},tabBarLabelStyle:{fontSize:11,fontWeight:'600'},tabBarIcon:({color,size})=><Ionicons name={icons[route.name]} color={color} size={size}/>})}><Tabs.Screen name="today" options={{title:'Today'}}/><Tabs.Screen name="calendar" options={{title:'Calendar'}}/><Tabs.Screen name="goals" options={{title:'Goals'}}/><Tabs.Screen name="my-space" options={{title:'World Tour'}}/></Tabs>}
