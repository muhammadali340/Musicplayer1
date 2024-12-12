import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

const HomeScreen = ({ navigation }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
        });
        setSongs(media.assets);
      }
    })();
  }, []);

  const playSong = async (song) => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    const { sound } = await Audio.Sound.createAsync({ uri: song.uri });
    await sound.playAsync();
    navigation.navigate('Player', { song, sound });
  };

  return (
    <View style={styles.container}>
      <Button title="Manage Playlists" onPress={() => navigation.navigate('PlaylistManagement')} />
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
    backgroundColor: '#f5f5f5',
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

export default HomeScreen;

