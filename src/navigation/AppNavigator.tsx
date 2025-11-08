import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { TimeSignatureScreen } from '../screens/TimeSignature/TimeSignatureScreen';
import { SoundLibraryScreen } from '../screens/SoundLibrary/SoundLibraryScreen';
import { ModifySoundScreen } from '../screens/ModifySound/ModifySoundScreen';
import { PresetsScreen } from '../screens/Presets/PresetsScreen';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="TimeSignature"
          component={TimeSignatureScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="SoundLibrary"
          component={SoundLibraryScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ModifySound"
          component={ModifySoundScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="Presets" component={PresetsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
