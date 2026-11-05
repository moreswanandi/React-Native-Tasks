import { View, Text, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';
import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../api';
import ExperienceCard from '../ExperienceCard';
import ErrorView from '../ErrorView';
import { getErrorMessage } from '../errorHelper';

const categories = ['All', 'Food', 'Adventure', 'Nightlife', 'Chill', 'Games'];
const locations = ['All', 'Mumbai', 'Pune', 'Goa'];
const budgets = [
  { label: 'Any', max: null },
  { label: 'Up to ₹300', max: 300 },
  { label: 'Up to ₹500', max: 500 },
  { label: 'Up to ₹1000', max: 1000 },
];

function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={selected ? styles.chipTextSelected : styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Home() {

  const navigation = useNavigation();
  const { profile, loading: profileLoading } = useUser();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchExperiences();
    }, [])
  );

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      // Only accept a proper list, otherwise use an empty one
      setExperiences(Array.isArray(response.data) ? response.data : []);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Called by the "Try Again" button
  const retry = () => {
    setLoading(true);
    fetchExperiences();
  };

  const confirmDelete = (item) => {
    Alert.alert('Delete experience', 'Delete "' + item.Title + '"?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExperience(item.id) },
    ]);
  };

  const deleteExperience = async (id) => {
    try {
      await api.delete('/experiences/' + id);
      setExperiences(experiences.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting experience: ', error.message);
      Alert.alert('Could not delete', getErrorMessage(error));
    }
  };

  const filteredExperiences = experiences.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.Category === selectedCategory;
    const locationMatch = selectedLocation === 'All' || item.Location === selectedLocation;
    const budgetMatch = selectedBudget === null || Number(item.Budget) <= selectedBudget;
    return categoryMatch && locationMatch && budgetMatch;
  });

  const renderItem = ({ item }) => (
    <ExperienceCard
      item={item}
      onEdit={() => navigation.navigate('ExperienceForm', { experience: item })}
      onDelete={() => confirmDelete(item)}
    />
  );

  if (profileLoading) return <Text>Loading...</Text>;

  // 1. Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Loading experiences...</Text>
      </View>
    );
  }

  // 2. Error state (nothing to show, so show the error screen)
  if (errorMessage && experiences.length === 0) {
    return <ErrorView message={errorMessage} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Hi, {profile.name || 'Guest'} 👋</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ExperienceForm')}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map((c) => (
            <Chip key={c} label={c} selected={selectedCategory === c} onPress={() => setSelectedCategory(c)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {locations.map((l) => (
            <Chip key={l} label={l} selected={selectedLocation === l} onPress={() => setSelectedLocation(l)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Budget</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {budgets.map((b) => (
            <Chip key={b.label} label={b.label} selected={selectedBudget === b.max} onPress={() => setSelectedBudget(b.max)} />
          ))}
        </ScrollView>
      </View>

      {/* Refresh failed but we still have older data to show */}
      {errorMessage ? (
        <Text style={styles.banner}>Could not refresh. Showing the last loaded data.</Text>
      ) : null}

      <Text style={styles.resultCount}>{filteredExperiences.length} experiences found</Text>

      <FlatList
        data={filteredExperiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {experiences.length === 0
              ? 'No experiences yet. Tap + Add to create one.'
              : 'No experiences match your filters.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'gray',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 6,
  },
  filterRow: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 10,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: 'black',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  chipTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  banner: {
    backgroundColor: '#ffe5e5',
    color: 'red',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultCount: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});




/*import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainScreen from './Screens/MainScreen';
import VaultScreen from './Screens/VaultScreen';
import ProfileScreen from './Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
 
  return (
   
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="MainScreen" component={MainScreen} />   
        <Tab.Screen name="VaultScreen" component={VaultScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}
*/





/*
import {View, Text, StyleSheet, Button} from 'react-native';
import { useUser } from '../UserContext';
import { useState, useEffect } from 'react';
import api from '../api';

//import React from 'react';
//import { collection, getFirestore } from '@react-native-firebase/firestore';
//import { useEffect, useState } from 'react';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Home() {

  const { profile, loading: profileLoading } = useUser();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      console.log('First experience: ', response.data[0]);
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <Text>Loading...</Text>;

  /*const [data, setData] = useState(null);

  useEffect(() => {
        getDatabase();
    }, []);

    const getDatabase = async () => {
      try { 
        const data = await getFirestore().collection("testing").doc("S2QTx36XQrYwGPrAbjtr").get();
        //console.log("Data from Firestore: ", data.data());
        setData(data.data());
      } 
      catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };
    

  return (
     <View style={styles.box}>
      <Text style={styles.text}>Welcome {profile.name || 'Guest'}</Text>
      <Text>Bio: {profile.bio}</Text>
      <Text>Budget: ₹{profile.budgetPref.min} - ₹{profile.budgetPref.max}</Text>
      <Text>Time: {profile.timePref}</Text>
      <Text>Interests: {profile.interests.join(', ')}</Text>
       <Text style={styles.text}>
        {loading ? 'Loading...' : 'Experiences fetched: ' + experiences.length}
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
/*
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';
import { useState, useEffect } from 'react';
import api from '../api';

export default function Home() {

  const { profile, loading: profileLoading } = useUser();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  //for each experience, display the image, title, description, category, location, budget, and available time in a card-like view
  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.Image }} style={styles.image} />
    <Text style={styles.title}>{item.Title}</Text>
    <Text style={styles.description}>{item.Description}</Text>
    <Text style={styles.detail}>Category: {item.Category}</Text>
    <Text style={styles.detail}>Location: {item.Location}</Text>
    <Text style={styles.detail}>Budget: ₹{item.Budget}</Text>
    <Text style={styles.detail}>Available time: {item.AvailableTime}</Text>
  </View>
);
  if (profileLoading) return <Text>Loading...</Text>;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome {profile.name || 'Guest'}</Text>
      <FlatList
        data={experiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    padding: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  description: {
    color: 'gray',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: 'black',
    marginBottom: 2,
  },
});
*/

/*

import { View, Text, Image, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';
import { useState, useEffect } from 'react';
import api from '../api';

// The filter choices (spelling must match your API data)
const categories = ['All', 'Food', 'Adventure', 'Nightlife', 'Chill', 'Games'];
const locations = ['All', 'Mumbai', 'Pune', 'Goa'];
const budgets = [
  { label: 'Any', max: null },
  { label: 'Up to ₹300', max: 300 },
  { label: 'Up to ₹500', max: 500 },
  { label: 'Up to ₹1000', max: 1000 },
];

// A small reusable chip button
function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={selected ? styles.chipTextSelected : styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Home() {

  const { profile, loading: profileLoading } = useUser();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Which filters are currently chosen
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Keep only the experiences that match ALL the chosen filters
  const filteredExperiences = experiences.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.Category === selectedCategory;
    const locationMatch = selectedLocation === 'All' || item.Location === selectedLocation;
    const budgetMatch = selectedBudget === null || Number(item.Budget) <= selectedBudget;
    return categoryMatch && locationMatch && budgetMatch;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.Image }} style={styles.image} />
      <Text style={styles.title}>{item.Title}</Text>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.detail}>Category: {item.Category}</Text>
      <Text style={styles.detail}>Location: {item.Location}</Text>
      <Text style={styles.detail}>Budget: ₹{item.Budget}</Text>
      <Text style={styles.detail}>Available time: {item.AvailableTime}</Text>
    </View>
  );

  if (profileLoading) return <Text>Loading...</Text>;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

    return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi, {profile.name || 'Guest'} 👋</Text>

  
      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map((c) => (
            <Chip key={c} label={c} selected={selectedCategory === c} onPress={() => setSelectedCategory(c)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {locations.map((l) => (
            <Chip key={l} label={l} selected={selectedLocation === l} onPress={() => setSelectedLocation(l)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Budget</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {budgets.map((b) => (
            <Chip key={b.label} label={b.label} selected={selectedBudget === b.max} onPress={() => setSelectedBudget(b.max)} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultCount}>{filteredExperiences.length} experiences found</Text>

      <FlatList
        data={filteredExperiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No experiences match your filters</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  filterPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 6,
  },
  filterRow: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 10,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: 'black',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  chipTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  resultCount: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  description: {
    color: 'gray',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: 'black',
    marginBottom: 2,
  },
});

*/
/*
import { View, Text, Image, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';
import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../api';
import ExperienceCard from '../ExperienceCard';

const categories = ['All', 'Food', 'Adventure', 'Nightlife', 'Chill', 'Games'];
const locations = ['All', 'Mumbai', 'Pune', 'Goa'];
const budgets = [
  { label: 'Any', max: null },
  { label: 'Up to ₹300', max: 300 },
  { label: 'Up to ₹500', max: 500 },
  { label: 'Up to ₹1000', max: 1000 },
];

function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={selected ? styles.chipTextSelected : styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Home() {

  const navigation = useNavigation();
  const { profile, loading: profileLoading } = useUser();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Runs when the screen first opens AND every time we come back to it
  useFocusEffect(
    useCallback(() => {
      fetchExperiences();
    }, [])
  );

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ask before deleting
  const confirmDelete = (item) => {
    Alert.alert('Delete experience', 'Delete "' + item.Title + '"?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExperience(item.id) },
    ]);
  };

  const deleteExperience = async (id) => {
    try {
      await api.delete('/experiences/' + id);
      // remove it from the list on screen right away
      setExperiences(experiences.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting experience: ', error.message);
      Alert.alert('Error', 'Could not delete the experience. Please try again.');
    }
  };

  const filteredExperiences = experiences.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.Category === selectedCategory;
    const locationMatch = selectedLocation === 'All' || item.Location === selectedLocation;
    const budgetMatch = selectedBudget === null || Number(item.Budget) <= selectedBudget;
    return categoryMatch && locationMatch && budgetMatch;
  });

    const renderItem = ({ item }) => (
    <ExperienceCard
      item={item}
      onEdit={() => navigation.navigate('ExperienceForm', { experience: item })}
      onDelete={() => confirmDelete(item)}
    />
  );

  if (profileLoading) return <Text>Loading...</Text>;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Hi, {profile.name || 'Guest'} 👋</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ExperienceForm')}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterPanel}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map((c) => (
            <Chip key={c} label={c} selected={selectedCategory === c} onPress={() => setSelectedCategory(c)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {locations.map((l) => (
            <Chip key={l} label={l} selected={selectedLocation === l} onPress={() => setSelectedLocation(l)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Budget</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {budgets.map((b) => (
            <Chip key={b.label} label={b.label} selected={selectedBudget === b.max} onPress={() => setSelectedBudget(b.max)} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultCount}>{filteredExperiences.length} experiences found</Text>

      <FlatList
        data={filteredExperiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No experiences match your filters</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 6,
  },
  filterRow: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 10,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: 'black',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  chipTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  resultCount: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  /*card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  description: {
    color: 'gray',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: 'black',
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editText: {
    color: 'black',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ffe5e5',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
*/
