import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useVault } from '../VaultContext';
import ExperienceCard from '../ExperienceCard';
import ErrorView from '../ErrorView';
import { getErrorMessage } from '../errorHelper';
import api from '../api';

export default function VaultScreen() {
  const { savedIds } = useVault();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchExperiences();
    }, [])
  );

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperiences(Array.isArray(response.data) ? response.data : []);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching experiences: ', error.message);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setLoading(true);
    fetchExperiences();
  };

  const savedExperiences = experiences.filter((item) =>
    savedIds.includes(String(item.id))
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Loading your vault...</Text>
      </View>
    );
  }

  if (errorMessage && experiences.length === 0) {
    return <ErrorView message={errorMessage} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Vault</Text>

      {errorMessage ? (
        <Text style={styles.banner}>Could not refresh. Showing the last loaded data.</Text>
      ) : null}

      <FlatList
        data={savedExperiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ExperienceCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {savedIds.length === 0
              ? 'No saved experiences yet. Tap the heart on an experience to save it.'
              : 'Your saved experiences are no longer available.'}
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  banner: {
    backgroundColor: '#ffe5e5',
    color: 'red',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
  },
});



/*import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useVault } from '../VaultContext';
import ExperienceCard from '../ExperienceCard';
import api from '../api';

export default function VaultScreen() {
  const { savedIds } = useVault();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the latest data every time this tab is opened
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

  // Keep only the experiences whose id is in the saved list
  const savedExperiences = experiences.filter((item) =>
    savedIds.includes(String(item.id))
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Vault</Text>
      <FlatList
        data={savedExperiences}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ExperienceCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No saved experiences yet. Tap the heart on an experience to save it.
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
  },
});
*/