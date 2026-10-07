import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import Box from './Components/Box';

import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';

 const Stack = createNativeStackNavigator();

export default function Temp() {
 
  return (
   
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginScreen} />
        <Stack.Screen name="SignupPage" component={SignupScreen} />
        <Stack.Screen name="Homepage" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

