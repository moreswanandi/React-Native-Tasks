import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './UserContext';
//import Box from './Components/Box';

import TabNavigator from './TabNavigator';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';

 const Stack = createNativeStackNavigator();

export default function AppNavigation() {
 
  return (
   <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  </UserProvider>
  );
}

