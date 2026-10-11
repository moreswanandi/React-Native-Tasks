import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { UserProvider } from './UserContext';
import HomeScreen from './Screens/HomeScreen';
import VaultScreen from './Screens/VaultScreen';
import ProfileNavigation from './ProfileNavigation';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    //<UserProvider>
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="VaultScreen" component={VaultScreen} />
      <Tab.Screen
        name="ProfileNavigation"
        component={ProfileNavigation}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
    //</UserProvider>
  );
}