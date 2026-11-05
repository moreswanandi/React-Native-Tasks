import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useVault } from './VaultContext';

export default function ExperienceCard({ item, onEdit, onDelete }) {
  const { isSaved, toggleSaved } = useVault();
  const saved = isSaved(item.id);

  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: item.Image }} style={styles.image} />
        <TouchableOpacity style={styles.heartButton} onPress={() => toggleSaved(item.id)}>
          <Text style={styles.heart}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{item.Title}</Text>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.detail}>Category: {item.Category}</Text>
      <Text style={styles.detail}>Location: {item.Location}</Text>
      <Text style={styles.detail}>Budget: ₹{item.Budget}</Text>
      <Text style={styles.detail}>Available time: {item.AvailableTime}</Text>

      {/* Edit/Delete buttons only appear if the screen passes those functions */}
      {onEdit || onDelete ? (
        <View style={styles.buttonRow}>
          {onEdit ? (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : null}
          {onDelete ? (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heart: {
    fontSize: 20,
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