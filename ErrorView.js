import { View, Text, Button, StyleSheet } from 'react-native';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title="Try Again" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f2f2f2',
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});