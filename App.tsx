import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import PlaylistManagementScreen from './screens/PlaylistManagementScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Music Library' }} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Now Playing' }} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} options={{ title: 'Playlist' }} />
        <Stack.Screen name="PlaylistManagement" component={PlaylistManagementScreen} options={{ title: 'Manage Playlists' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

