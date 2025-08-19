import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, RotateCcw, Play, Trophy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [firstPlayer, setFirstPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [stats, setStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const { toast } = useToast();

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: Board): Player | 'draw' | null => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }
    return board.every(cell => cell !== null) ? 'draw' : null;
  };

  const startGame = () => {
    const randomFirst = Math.random() < 0.5 ? 'X' : 'O';
    setFirstPlayer(randomFirst);
    setCurrentPlayer(randomFirst);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameActive(true);
    
    const message = randomFirst === 'X' ? 'X comienza primero' : 'O comienza primero';
    toast({
      title: "¡Nuevo Juego!",
      description: message,
      duration: 3000,
    });
  };

  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(firstPlayer);
    setWinner(null);
    setGameActive(true);
    
    toast({
      title: "Nueva Ronda",
      description: `${firstPlayer} comienza esta ronda`,
      duration: 2000,
    });
  };

  const makeMove = (index: number) => {
    if (!gameActive || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setGameActive(false);
      
      setStats(prev => ({
        ...prev,
        xWins: gameResult === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: gameResult === 'O' ? prev.oWins + 1 : prev.oWins,
        draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws,
      }));

      let message = '';
      if (gameResult === 'draw') {
        message = '¡Empate!';
      } else {
        message = `¡${gameResult} gana!`;
      }
      
      toast({
        title: "Juego Terminado",
        description: message,
        duration: 4000,
      });
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetStats = () => {
    setStats({ xWins: 0, oWins: 0, draws: 0 });
    toast({
      title: "Estadísticas Reiniciadas",
      description: "Todas las estadísticas han sido reiniciadas",
      duration: 2000,
    });
  };

  const getCellContent = (cell: Cell) => {
    if (!cell) return '';
    return cell;
  };

  const getCellStyle = (cell: Cell) => {
    if (cell === 'X') return 'text-game-x text-4xl font-bold';
    if (cell === 'O') return 'text-game-o text-4xl font-bold';
    return '';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-muted-foreground text-lg">
            Juego clásico con aleatorización de turnos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Game Board Section */}
          <div className="space-y-6">
            {/* Game Status */}
            <Card className="bg-gradient-game border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Estado del Juego
                  </span>
                  {winner && (
                    <Badge variant="outline" className="animate-pulse-glow">
                      <Trophy className="w-4 h-4 mr-1" />
                      {winner === 'draw' ? 'Empate' : `${winner} Gana`}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!gameActive && !winner ? (
                  <p className="text-muted-foreground text-center">
                    Presiona "Empezar Juego" para comenzar
                  </p>
                ) : winner ? (
                  <p className="text-center text-lg font-semibold">
                    {winner === 'draw' ? 
                      '¡Es un empate!' : 
                      `¡${winner} es el ganador!`
                    }
                  </p>
                ) : (
                  <p className="text-center text-lg">
                    Turno de{' '}
                    <span className={currentPlayer === 'X' ? 'text-game-x font-bold' : 'text-game-o font-bold'}>
                      {currentPlayer}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Game Board */}
            <Card className="bg-game-board border-border/50 backdrop-blur-sm shadow-glow">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-2 mx-auto max-w-sm">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      className={`
                        aspect-square bg-game-cell border border-border/50 rounded-lg
                        flex items-center justify-center text-2xl font-bold
                        transition-all duration-200 shadow-cell
                        hover:bg-game-cell-hover hover:scale-105 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        disabled:cursor-not-allowed
                        ${getCellStyle(cell)}
                      `}
                      onClick={() => makeMove(index)}
                      disabled={!gameActive || !!cell || !!winner}
                      aria-label={`Celda ${index + 1}${cell ? `, ocupada por ${cell}` : ', vacía'}`}
                    >
                      <span className="animate-scale-in">
                        {getCellContent(cell)}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={startGame}
                className="flex-1 h-12 text-lg font-semibold"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Empezar Juego
              </Button>
              
              {gameActive || winner ? (
                <Button
                  onClick={nextRound}
                  variant="secondary"
                  className="flex-1 h-12 text-lg font-semibold"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Siguiente Ronda
                </Button>
              ) : null}
            </div>
          </div>

          {/* Right Side Panel */}
          <div className="space-y-6">
            {/* Camera/Board View */}
            <Card className="bg-gradient-game border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Vista del Tablero
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border/30">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Vista física del tablero
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cámara no disponible
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gradient-game border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Estadísticas
                  </span>
                  <Button
                    onClick={resetStats}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-game-x mb-1">
                      {stats.xWins}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Victorias X
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground mb-1">
                      {stats.draws}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Empates
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-game-o mb-1">
                      {stats.oWins}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Victorias O
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">
                      {stats.xWins + stats.oWins + stats.draws}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de Juegos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gradient-game border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Cómo Jugar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Haz clic en "Empezar Juego" para comenzar</p>
                <p>• El primer jugador se elige aleatoriamente</p>
                <p>• Haz clic en las celdas para hacer tu movimiento</p>
                <p>• Consigue tres en línea para ganar</p>
                <p>• Usa "Siguiente Ronda" para jugar de nuevo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;