import { View, Text, Image, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { profile, loading } = useUser();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {profile.profileImage ? (
        <Image source={{ uri: profile.profileImage }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>👤</Text>
        </View>
      )}

      <Text style={styles.name}>{profile.name || 'Your Name'}</Text>
      <Text style={styles.bio}>{profile.bio || 'No bio added yet'}</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Max Budget</Text>
          <Text style={styles.cardValue}>₹{profile.budgetPref.max} / outing</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Available Time</Text>
          <Text style={styles.cardValue}>{profile.timePref} Max</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Interests</Text>
      <View style={styles.chipRow}>
        {profile.interests.length === 0 ? (
          <Text>No interests selected yet</Text>
        ) : (
          profile.interests.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.buttonBox}>
        <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'grey', 
    flexGrow: 1 
    },
  image: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginBottom: 15 
    },
  placeholder: { 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center' 
    },
  placeholderIcon: { 
    fontSize: 60 
    },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'black', 
    marginBottom: 5 
    },
  bio: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 20 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '48%', alignItems: 'center', elevation: 5 },
  cardLabel: { fontSize: 14, color: 'gray', marginBottom: 5 },
  cardValue: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'black', alignSelf: 'flex-start', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: 30 },
  chip: { backgroundColor: 'white', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  chipText: { color: 'black' },
  buttonBox: { width: '100%' },
});


/*import {View, Text, StyleSheet} from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.box}>
          <Text style={styles.text}>
            Welcome to the Profile Screen
          </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    padding: 20,
  },
  text: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
*/