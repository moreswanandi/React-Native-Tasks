import {View, Text, Button, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { StyleSheet } from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from '../firebase.config';



export default function Login() {
   /* useEffect(() => {
        
    }, []);
    */

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setError] = useState({});

    const validateForm = () => {
        let errors = {};
        if(!email) {
            errors.email = 'Email is required';
        }else if(!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid';
        }
        
        if(!password) {
            errors.password = 'Password is required';
        } else if(password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    }

    /*const handleLogin = async () => {
    try 
    {
        if (validateForm()) {
      await signInWithEmailAndPassword(auth, email, password);  
      navigation.navigate("Home");
        }
    } 
    catch (error) 
    {
      console.error("Login error: ", error.message);
      alert(error.message);
    }
  };*/

  const handleLogin = async () => {
    if (!validateForm()) {
        return;
    }
    try 
    {

        //const isUserLoggedIn = await auth().signInWithEmailAndPassword(email, password);
        await signInWithEmailAndPassword(auth, email, password);

        if (validateForm()) {
      navigation.navigate("TabNavigator");
        }
    } 
    catch (error) 
    {
      console.error("Login error: ", error.message);
      alert(error.message);
    }
  };


   /* const handleLogin = () => {
        if(validateForm()) {
            navigation.navigate('Homepage');
        }
    }*/

  return (
    <KeyboardAvoidingView behaviour="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} style={styles.container}>
        <View style={styles.box}>
      <Text style={styles.welcomeText}>
        Welcome Back
      </Text>
      <Text style={styles.label}> Email </Text>
      <TextInput
        style={styles.Input}
        placeholder="email@example.com"
        value={email} onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        autoCorrect={false}
        //keyboardType="email-address"
      />
      {
        errors.email ? <Text style={{color: 'red'}}>{errors.email}</Text> : null
      }
      <Text style={styles.label}> Password </Text>
      <TextInput
        style={styles.Input}
        placeholder="Enter your password"
        value={password} onChangeText={text => setPassword(text)}
        secureTextEntry={true}
      />
      {
        errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null
      }
      <Text> Note : The password should have at least 6 characters</Text>
      <Button title = "Continue" onPress={() => handleLogin()} />
        <Text> Don't have an account? </Text>
        <Button title = "Signup" onPress={() => navigation.navigate('SignupScreen')} />
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    Input: {
        height: 40,
        borderColor: 'gray', 
        borderWidth: 1, 
        borderRadius: 5, 
        marginBottom: 15,
        padding : 10
    },
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'white',
        paddingHorizontal: 20,
        backgroundColor : 'grey'
    },
    welcomeText: {
        flex: 0.5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'black'
    },
    box: {
        backgroundColor: 'white',
        padding : 20,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    }

})