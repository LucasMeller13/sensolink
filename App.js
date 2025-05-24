import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/loginUser';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
  );
}