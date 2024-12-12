import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaylistManagementScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      if (storedPlaylists !== null) {
        setPlaylists(JSON.parse(storedPlaylists));
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const savePlaylists = async (updatedPlaylists) => {
    try {
      await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      const updatedPlaylists = [...playlists, { id: Date.now().toString(), name: newPlaylistName, songs: [] }];
      setPlaylists(updatedPlaylists);
      savePlaylists(updatedPlaylists);
      setNewPlaylistName('');
    }
  };

  const deletePlaylist = (id) => {
    const updatedPlaylists = playlists.filter(playlist => playlist.id !== id);
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  return (
    <View style={styles.container}>
      <View style={styles.createPlaylistContainer}>
        <TextInput
          style={styles.input}
          value={newPlaylistName}
          onChangeText={setNewPlaylistName}
          placeholder="New Playlist Name"
        />
        <TouchableOpacity style={styles.createButton} onPress={createPlaylist}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistItem}>
            <TouchableOpacity onPress={() => navigation.navigate('Playlist', { playlist: item })}>
              <Text style={styles.playlistName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePlaylist(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  createPlaylistContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  createButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  playlistName: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
  },
});

export default PlaylistManagementScreen;

