import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import LoginScreen from './screens/LoginUser';
import RegisterUserScreen from './screens/RegisterUser';
import SensorView from './screens/Sensors';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-sdk';
import { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import DashboardView from './screens/Dashboards';
import UserInfoView from './screens/UserInfo';
import { Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import ManageSensorView from './screens/ManageSensor';

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function AppTabs(){

  async function handleSignOut() {
    try{
      await signOut(auth)
    }catch (error){
      console.log(error)
    }
  }

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen 
      options={{
        tabBarIcon:() => (<MaterialIcons name="sensors" size={24} color="#648DDB" />),
      }} 
      name='SensorView' 
      component={SensorView}/>

      <BottomTab.Screen 
      options={{
        tabBarIcon:() => (<MaterialIcons name="sensors" size={24} color="#648DDB" />),
      }} 
      name='ManageSensorView' 
      component={ManageSensorView}/>

      <BottomTab.Screen 
      options={{
        tabBarIcon:() => (<AntDesign name="dotchart" size={24} color="#648DDB" />)
      }} 
      name='DashboardView' 
      component={DashboardView}/>

      <BottomTab.Screen 
      options={{
        tabBarIcon:() => (<AntDesign name="user" size={24} color="#648DDB" />),
        headerRight: () => (
        <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons style={{paddingRight:15}} name="logout" size={24} color="#648DDB"/>
        </TouchableOpacity>
      )
      }} 
      name='UserInfoView' 
      component={UserInfoView}/>


    </BottomTab.Navigator>
  )
}

function AuthTabs() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name="RegisterUser" component={RegisterUserScreen}/>
    </Stack.Navigator>
  );
}


export default function App(){
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })

    return unsubscribe
  }, [])
  
  return(
    <NavigationContainer>
      {user ? <AppTabs/> : <AuthTabs />}
    </NavigationContainer>
  )
}