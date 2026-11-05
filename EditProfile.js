import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../UserContext';

const timeOptions = ['1 hr', '2 hrs', '3 hrs', 'Half Day', 'Full Day'];
const interestOptions = ['Food', 'Adventure', 'Nightlife', 'Chill', 'Games'];

export default function EditProfile() {
  const navigation = useNavigation();
  const { profile, updateProfile } = useUser();

  const [image, setImage] = useState(profile.profileImage);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [budget, setBudget] = useState(String(profile.budgetPref.max));
  const [timePref, setTimePref] = useState(profile.timePref);
  const [interests, setInterests] = useState(profile.interests);
  const [errors, setError] = useState({});


  const pickImage = async () => {

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photos in your phone settings to choose a picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!budget) {
      errors.budget = 'Budget is required';
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    await updateProfile({
      profileImage: image,
      name: name.trim(),
      bio: bio,
      budgetPref: { min: 0, max: Number(budget) },
      timePref: timePref,
      interests: interests,
    });

    navigation.goBack(); // return to the Profile screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.avatarWrapper}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Text style={styles.placeholderIcon}>👤</Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton} onPress={() => pickImage()}>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={(text) => setBio(text)}
          multiline={true}
        />

        <Text style={styles.label}>Max Budget per outing (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          value={budget}
          onChangeText={(text) => setBudget(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        {errors.budget ? <Text style={styles.errorText}>{errors.budget}</Text> : null}

        <Text style={styles.label}>Available Time</Text>
        <View style={styles.chipRow}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.chip, timePref === option && styles.chipSelected]}
              onPress={() => setTimePref(option)}
            >
              <Text style={timePref === option ? styles.chipTextSelected : styles.chipText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Interests</Text>
        <View style={styles.chipRow}>
          {interestOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, interests.includes(item) && styles.chipSelected]}
              onPress={() => toggleInterest(item)}
            >
              <Text style={interests.includes(item) ? styles.chipTextSelected : styles.chipText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Save Changes" onPress={() => handleSave()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'grey',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  chipText: {
    color: 'black',
  },
  chipTextSelected: {
    color: 'white',
  },
});