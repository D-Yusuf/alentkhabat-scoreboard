import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Team {
  name: string;
  scores: number[];
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

interface ScoreContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  players: Player[];
  addPlayer: (name: string) => void;
  updatePlayer: (playerId: number, updates: Partial<{ name: string; score: number }>) => void;
  addTeamScore: (teamIndex: number, score: number) => void;
  resetTeamScores: () => void;
  updateTeamScore: (teamIndex: number, scoreIndex: number, newScore: number) => void;
  deleteTeamScore: (teamIndex: number, scoreIndex: number) => void;
  resetPlayerScores: () => void;
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
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
  ]));

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

  const addPlayer = (name: string) => {
    setPlayers(prev => [...prev, { id: Date.now(), name, score: 0 }]);
  };

  const updatePlayer = (playerId: number, updates: Partial<{ name: string; score: number }>) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
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
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
  };

  return (
    <ScoreContext.Provider value={{ teams, setTeams, players, addPlayer, updatePlayer, addTeamScore, resetTeamScores, updateTeamScore, deleteTeamScore, resetPlayerScores }}>
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