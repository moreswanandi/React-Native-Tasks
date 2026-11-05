import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VaultContext = createContext();

// The name this data is saved under on the phone
const STORAGE_KEY = 'savedExperienceIds';

export function VaultProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);

  // Runs once when the app starts: load the saved list from the phone
  useEffect(() => {
    loadSavedIds();
  }, []);

  const loadSavedIds = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setSavedIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved experiences: ', error);
    }
  };

  // Write the list to the phone
  const saveToStorage = async (ids) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving experiences: ', error);
    }
  };

  const isSaved = (id) => savedIds.includes(String(id));

  const toggleSaved = (id) => {
    const key = String(id);
    let newIds;

    if (savedIds.includes(key)) {
      newIds = savedIds.filter((savedId) => savedId !== key);
    } else {
      newIds = [...savedIds, key];
    }

    setSavedIds(newIds);     // update the app right away
    saveToStorage(newIds);   // and remember it on the phone
  };

  return (
    <VaultContext.Provider value={{ savedIds, isSaved, toggleSaved }}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  return useContext(VaultContext);
}
