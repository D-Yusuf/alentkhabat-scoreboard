import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Team {
  name: string;
  scores: number[];
}

export interface Player {
  id: number;
  name: string;
  scores: number[]; // Array of scores for each round
}

interface ScoreContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  players: Player[];
  addPlayer: (name: string) => void;
  updatePlayer: (playerId: number, updates: Partial<{ name: string; score: number }>) => void;
  deletePlayer: (playerId: number) => void;
  addTeamScore: (teamIndex: number, score: number) => void;
  resetTeamScores: () => void;
  updateTeamScore: (teamIndex: number, scoreIndex: number, newScore: number) => void;
  deleteTeamScore: (teamIndex: number, scoreIndex: number) => void;
  resetPlayerScores: () => void;
  // New methods for round-based scoring
  updatePlayerScoreForRound: (playerId: number, roundIndex: number, score: number) => void;
  getPlayerTotalScore: (playerId: number) => number;
  getPlayerScoreForRound: (playerId: number, roundIndex: number) => number;
  currentRound: number;
  setCurrentRound: (round: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
  }
  return defaultValue;
};

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  
  const [teams, setTeams] = useState<Team[]>(() => getInitialState('scoreboard_teams', []));
  const [players, setPlayers] = useState<Player[]>(() => getInitialState('scoreboard_players', [
    { id: 1, name: 'Player 1', scores: [0] },
    { id: 2, name: 'Player 2', scores: [0] },
    { id: 3, name: 'Player 3', scores: [0] },
  ]));
  const [currentRound, setCurrentRound] = useState<number>(0); // 0-indexed

  useEffect(() => {
    if (!localStorage.getItem('scoreboard_teams')) {
      setTeams([
        { name: t('teams_page.first_team'), scores: [] },
        { name: t('teams_page.second_team'), scores: [] },
      ]);
    }
  }, [t]);

  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem('scoreboard_teams', JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('scoreboard_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('scoreboard_current_round', JSON.stringify(currentRound));
  }, [currentRound]);

  const addPlayer = (name: string) => {
    setPlayers(prev => {
      const newPlayer = { 
        id: Date.now(), 
        name, 
        scores: Array(players[0]?.scores.length || 1).fill(0) 
      };
      return [...prev, newPlayer];
    });
  };

  const updatePlayer = (playerId: number, updates: Partial<{ name: string; score: number }>) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  };

  const deletePlayer = (playerId: number) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const addTeamScore = (teamIndex: number, score: number) => {
    setTeams(prev => {
      const newTeams = prev.map((team, index) => {
        if (index === teamIndex) {
          return { ...team, scores: [...team.scores, score] };
        }
        return team;
      });
      return newTeams;
    });
  };

  const resetTeamScores = () => {
    setTeams(prev => prev.map(team => ({ ...team, scores: [] })));
  };

  const updateTeamScore = (teamIndex: number, scoreIndex: number, newScore: number) => {
    setTeams(prev => {
      const newTeams = [...prev];
      newTeams[teamIndex].scores[scoreIndex] = newScore;
      return newTeams;
    });
  };

  const deleteTeamScore = (teamIndex: number, scoreIndex: number) => {
    setTeams(prev => {
      const newTeams = [...prev];
      newTeams[teamIndex].scores.splice(scoreIndex, 1);
      return newTeams;
    });
  };

  const resetPlayerScores = () => {
    setPlayers(prev => prev.map(player => ({ 
      ...player, 
      scores: (player.scores || []).map(() => 0) 
    })));
  };

  // New methods for round-based scoring
  const updatePlayerScoreForRound = (playerId: number, roundIndex: number, score: number) => {
    setPlayers(prev =>
      prev.map(player => {
        if (player.id === playerId) {
          const newScores = [...(player.scores || [])];
          // Ensure we have enough rounds
          while (newScores.length <= roundIndex) {
            newScores.push(0);
          }
          newScores[roundIndex] = score;
          return { ...player, scores: newScores };
        }
        return player;
      })
    );
  };

  const getPlayerTotalScore = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    return player ? (player.scores || []).reduce((sum, score) => sum + score, 0) : 0;
  };

  const getPlayerScoreForRound = (playerId: number, roundIndex: number) => {
    const player = players.find(p => p.id === playerId);
    return player && player.scores && player.scores[roundIndex] !== undefined ? player.scores[roundIndex] : 0;
  };

  return (
    <ScoreContext.Provider value={{ 
      teams, 
      setTeams, 
      players, 
      addPlayer, 
      updatePlayer, 
      deletePlayer, 
      addTeamScore, 
      resetTeamScores, 
      updateTeamScore, 
      deleteTeamScore, 
      resetPlayerScores,
      updatePlayerScoreForRound,
      getPlayerTotalScore,
      getPlayerScoreForRound,
      currentRound,
      setCurrentRound
    }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};