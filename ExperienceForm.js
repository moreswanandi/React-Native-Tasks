import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import { getErrorMessage } from '../errorHelper';

const categories = ['Food', 'Adventure', 'Nightlife', 'Chill', 'Games'];
const locations = ['Mumbai', 'Pune', 'Goa'];
const timeOptions = ['1 hr', '2 hrs', '3 hrs', 'Half Day', 'Full Day'];

// A row of chips where only one can be selected
function OptionRow({ options, selected, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, selected === option && styles.chipSelected]}
          onPress={() => onSelect(option)}
        >
          <Text style={selected === option ? styles.chipTextSelected : styles.chipText}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ExperienceForm() {
  const navigation = useNavigation();
  const route = useRoute();

  // If an experience was passed in, we are editing. Otherwise we are adding.
  const existing = route.params?.experience;

  const [title, setTitle] = useState(existing ? existing.Title : '');
  const [description, setDescription] = useState(existing ? existing.Description : '');
  const [budget, setBudget] = useState(existing ? String(existing.Budget) : '');
  const [category, setCategory] = useState(existing ? existing.Category : '');
  const [location, setLocation] = useState(existing ? existing.Location : '');
  const [availableTime, setAvailableTime] = useState(existing ? existing.AvailableTime : '');
  const [image, setImage] = useState(existing ? existing.Image : '');
  const [errors, setError] = useState({});
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    let errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!budget) errors.budget = 'Budget is required';
    if (!category) errors.category = 'Please pick a category';
    if (!location) errors.location = 'Please pick a location';
    if (!availableTime) errors.availableTime = 'Please pick a time';
    setError(errors);
    return Object.keys(errors).length === 0;
  };

    const handleSave = async () => {
    if (!validateForm()) return;

    const data = {
      Title: title.trim(),
      Description: description.trim(),
      Category: category,
      Location: location,
      Budget: Number(budget),
      AvailableTime: availableTime,
      Image: image.trim() || 'https://picsum.photos/600/400',
    };

    setSaving(true);
    try {
      if (existing) {
        await api.put('/experiences/' + existing.id, data);
      } else {
        await api.post('/experiences', data);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving experience: ', error.message);
      Alert.alert('Could not save', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>{existing ? 'Edit Experience' : 'Add Experience'}</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="e.g. Street Food Walk" value={title} onChangeText={(text) => setTitle(text)} />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="What is this experience about?"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
        />

        <Text style={styles.label}>Budget (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          value={budget}
          onChangeText={(text) => setBudget(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        {errors.budget ? <Text style={styles.errorText}>{errors.budget}</Text> : null}

        <Text style={styles.label}>Category</Text>
        <OptionRow options={categories} selected={category} onSelect={setCategory} />
        {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}

        <Text style={styles.label}>Location</Text>
        <OptionRow options={locations} selected={location} onSelect={setLocation} />
        {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}

        <Text style={styles.label}>Available Time</Text>
        <OptionRow options={timeOptions} selected={availableTime} onSelect={setAvailableTime} />
        {errors.availableTime ? <Text style={styles.errorText}>{errors.availableTime}</Text> : null}

        <Text style={styles.label}>Image link (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={image}
          onChangeText={(text) => setImage(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title={saving ? 'Saving...' : existing ? 'Update Experience' : 'Add Experience'}
          onPress={() => handleSave()}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    padding: 10,
  },
  multiline: {
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
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#eeeeee',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: 'black',
  },
  chipText: {
    color: 'black',
  },
  chipTextSelected: {
    color: 'white',
  },
});