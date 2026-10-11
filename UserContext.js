import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Create the context (the "global box" that holds the profile)
const UserContext = createContext();

// The key used to save/load the profile on the phone
const STORAGE_KEY = 'userProfile';

// What the profile looks like when nothing has been saved yet
const defaultProfile = {
  name: '',
  bio: '',
  profileImage: '',                    // image URI (a string)
  budgetPref: { min: 0, max: 1000 },   // in rupees
  timePref: '2 hrs',                   // e.g. '2 hrs', 'Half Day'
  interests: [],                       // e.g. ['Food', 'Adventure', 'Chill']
};

// 2. The Provider: wrap your app with this so every screen can use the profile
export function UserProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  // Runs once when the app starts: load saved profile from the phone
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        // AsyncStorage stores text, so convert it back into an object
        setProfile({ ...defaultProfile, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading profile: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Call this with only the fields you want to change,
  // e.g. updateProfile({ name: 'Swanandi' })
  const updateProfile = async (changes) => {
    const newProfile = { ...profile, ...changes };
    setProfile(newProfile); // update the app right away
    try {
      // convert the object to text and save it on the phone
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error saving profile: ', error);
    }
  };

  // Call this on logout so the next user doesn't see old data
  const clearProfile = async () => {
    setProfile(defaultProfile);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing profile: ', error);
    }
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, clearProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. A small helper so screens can write: const { profile } = useUser();
export function useUser() {
  return useContext(UserContext);
}