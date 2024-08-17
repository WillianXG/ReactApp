import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import NotesScreen from '../screens/Notes';
import { ExpoRouter } from 'expo-router';
import Routes from '@/routes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Routes />
  );
}

