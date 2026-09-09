import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light  } from '@expo-google-fonts/inter';

export default function HomeScreen() {
    const navigation = useNavigation();
    let [fontsLoaded, error] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
      });
      if (!fontsLoaded) {
        return null;
      }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
      <Text>Home Screen</Text>
      
            <Text style={{ fontFamily: 'Inter_100Thin' }}> Hiii1 </Text>
            <Text style={{ fontFamily: 'Inter_200ExtraLight' }}> Hiii2 </Text>
            <Text style={{ fontFamily: 'Inter_300Light' }}> Hiii3 </Text>
         
      <Button title = "Go to Second Screen" onPress={() => navigation.navigate('SecondPage')} />
    </View>
  )
}