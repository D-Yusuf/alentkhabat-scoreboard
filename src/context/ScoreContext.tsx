import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Team {
  name: string;
  scores: number[];
}

export interface Player {
  id: number;
  name: string;
  currentScore: number; // The score displayed and edited on the Players page
  roundScores: number[]; // Array of scores for each round, managed by ScoreList
}

interface ScoreContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  players: Player[];
  addPlayer: (name: string) => void;
  updatePlayerName: (playerId: number, newName: string) => void;
  deletePlayer: (playerId: number) => void;
  addTeamScore: (teamIndex: number, score: number) => void;
  resetTeamScores: () => void;
  updateTeamScore: (teamIndex: number, scoreIndex: number, newScore: number) => void;
  deleteTeamScore: (teamIndex: number, scoreIndex: number) => void;
  resetPlayerScores: () => void;
  // Player-specific score management
  updatePlayerCurrentScore: (playerId: number, newScore: number) => void; // Updates currentScore
  getPlayerTotalRoundScore: (playerId: number) => number; // Sums roundScores
  getPlayerRoundScore: (playerId: number, roundIndex: number) => number; // Gets specific roundScore
  saveCurrentScoresToRound: (roundIndex: number) => void; // Saves all players' currentScore to their roundScores[roundIndex]
  loadRoundScoresToCurrent: (roundIndex: number) => void; // Loads all players' roundScores[roundIndex] into their currentScore
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
  const [players, setPlayers] = useState<Player[]>(() => {
    const storedPlayers = getInitialState('scoreboard_players', null);
    if (storedPlayers) return storedPlayers;

    return [
      { id: 1, name: 'Player 1', currentScore: 0, roundScores: [] },
      { id: 2, name: 'Player 2', currentScore: 0, roundScores: [] },
      { id: 3, name: 'Player 3', currentScore: 0, roundScores: [] },
    ];
  });
  const [currentRound, setCurrentRound] = useState<number>(() => getInitialState('scoreboard_current_round', 0)); // 0-indexed, -1 for "All Rounds"

  // Initialize currentScore based on currentRound on first load
  useEffect(() => {
    if (currentRound !== -1) {
      setPlayers(prevPlayers =>
        prevPlayers.map(player => {
          const scoreToLoad = player.roundScores[currentRound] !== undefined ? player.roundScores[currentRound] : 0;
          return { ...player, currentScore: scoreToLoad };
        })
      );
    }
  }, []); // Run only once on mount

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

  // --- Player-specific score management ---

  const addPlayer = (name: string) => {
    setPlayers(prev => {
      const newPlayer = {
        id: Date.now(),
        name,
        currentScore: 0,
        roundScores: []
      };
      return [...prev, newPlayer];
    });
  };

  const updatePlayerName = (playerId: number, newName: string) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, name: newName } : player
      )
    );
  };

  const deletePlayer = (playerId: number) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const updatePlayerCurrentScore = (playerId: number, newScore: number) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, currentScore: newScore } : player
      )
    );
  };

  const getPlayerTotalRoundScore = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    return player ? (player.roundScores || []).reduce((sum, score) => sum + score, 0) : 0;
  };

  const getPlayerRoundScore = (playerId: number, roundIndex: number) => {
    const player = players.find(p => p.id === playerId);
    return player && player.roundScores && player.roundScores[roundIndex] !== undefined ? player.roundScores[roundIndex] : 0;
  };

  const saveCurrentScoresToRound = (roundIndex: number) => {
    if (roundIndex === -1) return; // Do not save if "All Rounds" is selected

    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        const newRoundScores = [...(player.roundScores || [])];
        // Ensure the roundScores array is long enough
        while (newRoundScores.length <= roundIndex) {
          newRoundScores.push(0);
        }
        newRoundScores[roundIndex] = player.currentScore; // Save currentScore to the specific round
        return { ...player, roundScores: newRoundScores };
      })
    );
  };

  const loadRoundScoresToCurrent = (roundIndex: number) => {
    if (roundIndex === -1) return; // Do not load if "All Rounds" is selected

    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        const scoreToLoad = player.roundScores[roundIndex] !== undefined ? player.roundScores[roundIndex] : 0;
        return { ...player, currentScore: scoreToLoad };
      })
    );
  };

  const resetPlayerScores = () => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      currentScore: 0,
      roundScores: []
    })));
  };

  // --- Team-specific score management (no changes needed here based on new player logic) ---
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

  return (
    <ScoreContext.Provider value={{
      teams,
      setTeams,
      players,
      addPlayer,
      updatePlayerName,
      deletePlayer,
      addTeamScore,
      resetTeamScores,
      updateTeamScore,
      deleteTeamScore,
      resetPlayerScores,
      updatePlayerCurrentScore,
      getPlayerTotalRoundScore,
      getPlayerRoundScore,
      saveCurrentScoresToRound,
      loadRoundScoresToCurrent,
      currentRound,
      setCurrentRound,
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