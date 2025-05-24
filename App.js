import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/loginUser';
import RegisterUserScreen from './screens/registerUser';

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='RegisterUser'>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}