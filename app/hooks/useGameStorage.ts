// app/hooks/useGameStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../constants/storage';
import { GameStorage, GameResult } from '../types/game';

export const useGameStorage = () => {
  const saveGameState = async (data: GameStorage) => {
    try {
      const jsonValue = JSON.stringify(data);
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, jsonValue);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_GAME, jsonValue);
      }
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  };

  const loadGameState = async (): Promise<GameStorage | null> => {
    try {
      let jsonValue;
      if (Platform.OS === 'web') {
        jsonValue = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
      } else {
        jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
      }
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error loading game state:', e);
      return null;
    }
  };

  const saveToLeaderboard = async (result: GameResult) => {
    try {
      let leaderboard = await getLeaderboard();
      leaderboard.push(result);
      leaderboard.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      const jsonValue = JSON.stringify(leaderboard);
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, jsonValue);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.LEADERBOARD, jsonValue);
      }
    } catch (e) {
      console.error('Error saving to leaderboard:', e);
    }
  };

  const getLeaderboard = async (): Promise<GameResult[]> => {
    try {
      let jsonValue;
      if (Platform.OS === 'web') {
        jsonValue = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      } else {
        jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      }
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting leaderboard:', e);
      return [];
    }
  };

  const clearGameState = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      }
    } catch (e) {
      console.error('Error clearing game state:', e);
    }
  };

  return {
    saveGameState,
    loadGameState,
    saveToLeaderboard,
    getLeaderboard,
    clearGameState,
  };
};