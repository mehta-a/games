// app/index.tsx
import { Text, View, StyleSheet, Pressable, Dimensions, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { PlayerNameInput } from './components/PlayerNameInput';
import { Leaderboard } from './components/Leaderboard';
import { useGameStorage } from './hooks/useGameStorage';
import { GameState, GameResult } from './types/game';
import { Stack } from 'expo-router';

<Stack.Screen options={{ title: "TicTacToe" }} />


export default function App() {

  const [gameState, setGameState] = useState<GameState>('welcome');
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [leaderboard, setLeaderboard] = useState<GameResult[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const gameStorage = useGameStorage();

  useEffect(() => {
    loadGame();
    loadLeaderboard();
  }, []);

  const loadGame = async () => {
    const savedState = await gameStorage.loadGameState();
    if (savedState) {
      setGameState(savedState.gameState);
      setBoard(savedState.board);
      setCurrentPlayer(savedState.currentPlayer);
      setScore(savedState.score);
      setPlayerX(savedState.playerX);
      setPlayerO(savedState.playerO);
    }
  };

  const loadLeaderboard = async () => {
    const results = await gameStorage.getLeaderboard();
    setLeaderboard(results);
  };

  const saveGame = async () => {
    await gameStorage.saveGameState({
      gameState,
      board,
      currentPlayer,
      score,
      playerX,
      playerO,
    });
  };

  useEffect(() => {
    saveGame();
  }, [gameState, board, currentPlayer, score]);

  const checkWinner = (gameBoard: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        return gameBoard[a];
      }
    }
    return null;
  };

  const handlePress = (index: number) => {
    if (board[index] !== '' || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setScore(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const startNewGame = async () => {
    if (!playerX || !playerO) {
      alert('Please enter names for both players');
      return;
    }
    
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameState('playing');
    await gameStorage.clearGameState();
  };

  const endGame = async () => {
    const winner = checkWinner(board);
    const result: GameResult = {
      winner: winner ? {
        name: winner === 'X' ? playerX : playerO,
        symbol: winner as 'X' | 'O'
      } : null,
      timestamp: new Date().toISOString(),
      playerX,
      playerO,
      scoreX: score.X,
      scoreO: score.O
    };
    
    await gameStorage.saveToLeaderboard(result);
    await loadLeaderboard();
    
    setGameState('ended');
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
  };

  const resetToWelcome = async () => {
    setGameState('welcome');
    setScore({ X: 0, O: 0 });
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setPlayerX('');
    setPlayerO('');
    await gameStorage.clearGameState();
  };

  const renderCell = (index: number) => (
    <Pressable
      style={styles.cell}
      onPress={() => handlePress(index)}
    >
      <Text style={[
        styles.cellText,
        { color: board[index] === 'X' ? '#FF69B4' : '#FF6B6B' }
      ]}>
        {board[index]}
      </Text>
    </Pressable>
  );

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell !== '');
  const status = winner 
    ? `Winner: ${winner === 'X' ? playerX : playerO}!` 
    : isDraw 
    ? "It's a Draw!" 
    : `Next Player: ${currentPlayer === 'X' ? playerX : playerO}`;

  const renderWelcomeScreen = () => (
    <View style={styles.centerContent}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.subtitle}>Enter player names to start!</Text>
      <PlayerNameInput
        label="Player X"
        value={playerX}
        onChangeText={setPlayerX}
      />
      <PlayerNameInput
        label="Player O"
        value={playerO}
        onChangeText={setPlayerO}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.startButton} onPress={startNewGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
        <Pressable 
          style={[styles.button, styles.leaderboardButton]}
          onPress={() => setShowLeaderboard(!showLeaderboard)}
        >
          <Text style={styles.buttonText}>
            {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
          </Text>
        </Pressable>
      </View>
      {showLeaderboard && <Leaderboard results={leaderboard} />}
    </View>
  );

  const renderGameScreen = () => (
    <>
      <View style={styles.header}>
        <View style={styles.scoreBoard}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>{playerX}</Text>
            <Text style={styles.scoreText}>{score.X}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>{playerO}</Text>
            <Text style={styles.scoreText}>{score.O}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
      </View>

      <View style={styles.board}>
        <View style={styles.row}>
          {renderCell(0)}
          {renderCell(1)}
          {renderCell(2)}
        </View>
        <View style={styles.row}>
          {renderCell(3)}
          {renderCell(4)}
          {renderCell(5)}
        </View>
        <View style={styles.row}>
          {renderCell(6)}
          {renderCell(7)}
          {renderCell(8)}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, styles.newGameButton]} 
          onPress={startNewGame}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.endGameButton]} 
          onPress={endGame}
        >
          <Text style={styles.buttonText}>End Game</Text>
        </Pressable>
      </View>
    </>
  );

  const renderEndScreen = () => (
    <View style={styles.centerContent}>
      <Text style={styles.title}>Game Over!</Text>
      <View style={styles.finalScore}>
        <Text style={styles.scoreLabel}>Final Score:</Text>
        <Text style={styles.finalScoreText}>
          {playerX}: {score.X} - {playerO}: {score.O}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.startButton} onPress={startNewGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </Pressable>
        <Pressable 
          style={[styles.button, styles.endGameButton]} 
          onPress={resetToWelcome}
        >
          <Text style={styles.buttonText}>Exit Game</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {gameState === 'welcome' && renderWelcomeScreen()}
        {gameState === 'playing' && renderGameScreen()}
        {gameState === 'ended' && renderEndScreen()}
      </View>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const cellSize = Math.min(windowWidth * 0.25, windowHeight * 0.15);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 30,
  },
  header: {
    paddingTop: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  scoreDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
  },
  board: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: cellSize,
    height: cellSize,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cellText: {
    fontSize: cellSize * 0.5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newGameButton: {
    backgroundColor: '#FF69B4',
  },
  endGameButton: {
    backgroundColor: '#718096',
  },
  leaderboardButton: {
    backgroundColor: '#4A5568',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalScore: {
    alignItems: 'center',
    marginBottom: 30,
  },
  finalScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 10,
  },
});