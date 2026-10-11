//import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { UserProvider } from './UserContext';
//import Box from './Components/Box';


import EditProfile from './Screens/EditProfile';
import ProfileScreen from './Screens/ProfileScreen';

 const Stack = createNativeStackNavigator();

export default function AppNavigation() {
 
  return (
   //<UserProvider>
    //<NavigationContainer>
      <Stack.Navigator initialRouteName="ProfileScreen">
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    //</NavigationContainer>
  //</UserProvider>
  );
}
