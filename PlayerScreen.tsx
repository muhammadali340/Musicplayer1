import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  return BackgroundFetch.Result.NewData;
});

const PlayerScreen = ({ route, navigation }) => {
  const { song, sound, playlist } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setupPlayer();
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });

      await TrackPlayer.add({
        id: song.id,
        url: song.uri,
        title: song.filename,
        artist: song.artist || 'Unknown Artist',
        artwork: require('../assets/album-art-placeholder.png'),
      });

      TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
        setIsPlaying(state.state === State.Playing);
      });

      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
        setPosition(data.position);
        setDuration(data.duration);
      });

      await TrackPlayer.play();
    } catch (error) {
      console.error('Error setting up player:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const seekTo = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const skipToNext = async () => {
    // Implement logic to play the next song in the playlist
  };

  const skipToPrevious = async () => {
    // Implement logic to play the previous song in the playlist
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/album-art-placeholder.png')} style={styles.albumArt} />
      <Text style={styles.songTitle}>{song.filename}</Text>
      <Text style={styles.songArtist}>{song.artist || 'Unknown Artist'}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#b3b3b3"
        thumbTintColor="#1DB954"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={32} color="#1DB954" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="#1DB954" />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward" size={32} color="#1DB954" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  albumArt: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  songArtist: {
    fontSize: 18,
    color: '#b3b3b3',
    marginBottom: 30,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  timeContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  timeText: {
    color: '#b3b3b3',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PlayerScreen;

