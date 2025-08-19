import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw, Play, Camera, Trophy, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [firstPlayer, setFirstPlayer] = useState<Player>('X');
  const { toast } = useToast();

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (newBoard: Board): { winner: Player | 'draw' | null; winningCells: number[] } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], winningCells: combination };
      }
    }
    
    if (newBoard.every(cell => cell !== null)) {
      return { winner: 'draw', winningCells: [] };
    }
    
    return { winner: null, winningCells: [] };
  };

  const handleCellClick = (index: number) => {
    if (!gameStarted || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, winningCells: cells } = checkWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningCells(cells);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        xWins: gameWinner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: gameWinner === 'O' ? prev.oWins + 1 : prev.oWins,
        draws: gameWinner === 'draw' ? prev.draws + 1 : prev.draws
      }));

      // Show toast notification
      if (gameWinner === 'draw') {
        toast({
          title: "¡Empate!",
          description: "Nadie gana esta ronda",
        });
      } else {
        toast({
          title: `¡${gameWinner} Gana!`,
          description: `Felicidades al jugador ${gameWinner}`,
        });
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const startGame = () => {
    // Randomly decide who goes first
    const randomPlayer = Math.random() < 0.5 ? 'X' : 'O';
    setFirstPlayer(randomPlayer);
    setCurrentPlayer(randomPlayer);
    setGameStarted(true);
    
    // Reset game state
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCells([]);

    toast({
      title: `${randomPlayer} comienza primero`,
      description: `¡El jugador ${randomPlayer} fue seleccionado aleatoriamente!`,
    });
  };

  const nextRound = () => {
    // Reset board and winner state
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCells([]);
    
    // The winner of the last round or the other player starts
    const nextPlayer = firstPlayer === 'X' ? 'O' : 'X';
    setFirstPlayer(nextPlayer);
    setCurrentPlayer(nextPlayer);

    toast({
      title: `Nueva ronda`,
      description: `${nextPlayer} comienza esta ronda`,
    });
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStarted(false);
    setWinner(null);
    setWinningCells([]);
    setFirstPlayer('X');
    setStats({ xWins: 0, oWins: 0, draws: 0 });
    
    toast({
      title: "Juego reiniciado",
      description: "Estadísticas restablecidas",
    });
  };

  const renderIcon = (player: Player) => {
    if (player === 'X') {
      return <X className="w-16 h-16" />;
    } else if (player === 'O') {
      return <Circle className="w-16 h-16" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-game-player-x to-game-player-o bg-clip-text text-transparent mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-muted-foreground">Juego clásico con selección aleatoria del primer jugador</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 slide-up">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Controles
              </h3>
              
              <div className="space-y-4">
                {!gameStarted ? (
                  <button
                    onClick={startGame}
                    className="btn-game w-full flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Empezar Juego
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={nextRound}
                      disabled={!winner}
                      className={`btn-accent w-full flex items-center justify-center gap-2 ${
                        !winner ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <RotateCcw className="w-5 h-5" />
                      Siguiente Ronda
                    </button>
                    
                    <button
                      onClick={resetGame}
                      className="btn-game w-full flex items-center justify-center gap-2 opacity-80 hover:opacity-100"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reiniciar Juego
                    </button>
                  </div>
                )}
              </div>

              {/* Current Player or Game Status */}
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-muted">
                {!gameStarted ? (
                  <p className="text-center text-muted-foreground">Presiona "Empezar Juego" para comenzar</p>
                ) : winner ? (
                  <div className="text-center">
                    {winner === 'draw' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 bg-muted rounded-full"></div>
                        <span className="font-semibold">¡Empate!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6 text-game-winner" />
                        <span className="font-semibold">¡{winner} Gana!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Turno actual:</p>
                    <div className={`flex items-center justify-center gap-2 ${
                      currentPlayer === 'X' ? 'text-game-player-x' : 'text-game-player-o'
                    }`}>
                      {renderIcon(currentPlayer)}
                      <span className="text-2xl font-bold">{currentPlayer}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="glass-card p-6 slide-up">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-accent" />
                Estadísticas
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-game-player-x/10 border border-game-player-x/20">
                  <div className="text-2xl font-bold text-game-player-x">{stats.xWins}</div>
                  <div className="text-sm text-muted-foreground">X Victorias</div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/20 border border-muted/40">
                  <div className="text-2xl font-bold">{stats.draws}</div>
                  <div className="text-sm text-muted-foreground">Empates</div>
                </div>
                
                <div className="p-3 rounded-lg bg-game-player-o/10 border border-game-player-o/20">
                  <div className="text-2xl font-bold text-game-player-o">{stats.oWins}</div>
                  <div className="text-sm text-muted-foreground">O Victorias</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="lg:col-span-1 flex items-center justify-center scale-in">
            <div className="game-board">
              <div className="grid grid-cols-3 gap-3 w-80 h-80">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`game-cell ${cell ? cell.toLowerCase() : ''} ${
                      winningCells.includes(index) ? 'winner' : ''
                    }`}
                    disabled={!gameStarted || cell !== null || winner !== null}
                  >
                    {cell && (
                      <div className={`${cell === 'X' ? 'text-game-player-x' : 'text-game-player-o'}`}>
                        {renderIcon(cell)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Camera Simulation */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 slide-up">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-accent" />
                Vista de Cámara
              </h3>
              
              <div className="aspect-square bg-muted/20 rounded-xl border-2 border-dashed border-muted/40 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Vista del tablero físico</p>
                  <p className="text-sm text-muted-foreground mt-2">Cámara simulada</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center">
                  <span className="font-semibold">Estado:</span> {gameStarted ? 'Juego Activo' : 'Esperando inicio'}
                </p>
              </div>
            </div>

            {/* Game Info */}
            <div className="glass-card p-6 slide-up">
              <h3 className="text-xl font-semibold mb-4">Información del Juego</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primer jugador:</span>
                  <span className={`font-semibold ${
                    firstPlayer === 'X' ? 'text-game-player-x' : 'text-game-player-o'
                  }`}>
                    {gameStarted ? firstPlayer : 'Por determinar'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modo:</span>
                  <span className="font-semibold">Selección Aleatoria</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partidas jugadas:</span>
                  <span className="font-semibold">{stats.xWins + stats.oWins + stats.draws}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;