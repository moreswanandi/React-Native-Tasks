import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import AppLoading  from 'expo-app-loading';
//import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light  } from '@expo-google-fonts/inter';

import HomeScreen from './Screens/HomeScreen';
import SecondScreen from './Screens/SecondScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Homepage">
        <Stack.Screen name="Homepage" component={HomeScreen} />
        <Stack.Screen name="SecondPage" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
     
  );
}














/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/
