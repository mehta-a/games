// app/components/Leaderboard.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GameResult } from '../types/game';

type LeaderboardProps = {
  results: GameResult[];
};

export const Leaderboard = ({ results }: LeaderboardProps) => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>Recent Games</Text>
    {results.map((result, index) => (
      <View key={index} style={styles.resultItem}>
        <Text style={styles.resultDate}>
          {new Date(result.timestamp).toLocaleDateString()}
        </Text>
        <Text style={styles.resultText}>
          {result.playerX} (X) vs {result.playerO} (O)
        </Text>
        <Text style={styles.resultText}>
          Score: {result.scoreX} - {result.scoreO}
        </Text>
        <Text style={styles.winnerText}>
          {result.winner 
            ? `Winner: ${result.winner.name} (${result.winner.symbol})`
            : 'Draw'}
        </Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    width: '100%',
    marginTop: 20,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultDate: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 3,
  },
  winnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginTop: 5,
  },
});