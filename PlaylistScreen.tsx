import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const PlaylistScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      if (storedPlaylists !== null) {
        const playlists = JSON.parse(storedPlaylists);
        const currentPlaylist = playlists.find(p => p.id === playlist.id);
        setSongs(currentPlaylist.songs);
      }
    } catch (error) {
      console.error('Error loading songs:', error);
    }
  };

  const playSong = async (song) => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    const { sound } = await Audio.Sound.createAsync({ uri: song.uri });
    await sound.playAsync();
    navigation.navigate('Player', { song, sound, playlist });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.playlistName}>{playlist.name}</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => playSong(item)}>
            <View style={styles.songItem}>
              <Text style={styles.songTitle}>{item.filename}</Text>
              <Text style={styles.songArtist}>{item.artist || 'Unknown Artist'}</Text>
            </View>
          </TouchableOpacity>
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
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  songItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlaylistScreen;

