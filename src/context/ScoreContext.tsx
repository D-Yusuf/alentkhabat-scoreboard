import { createContext, useContext, useState, ReactNode } from 'react';

interface Team {
  name: string;
  scores: number[];
}

interface Player {
  id: number;
  name: string;
  score: number;
}

interface ScoreContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  players: Player[];
  addPlayer: (name: string) => void;
  addTeamScore: (teamIndex: number, score: number) => void;
  resetTeamScores: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([
    { name: 'First Team', scores: [] },
    { name: 'Second Team', scores: [] },
  ]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', score: 120 },
    { id: 2, name: 'Player 2', score: 50 },
    { id: 3, name: 'Player 3', score: 320 },
  ]);

  const addPlayer = (name: string) => {
    setPlayers(prev => [...prev, { id: Date.now(), name, score: 0 }]);
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

  return (
    <ScoreContext.Provider value={{ teams, setTeams, players, addPlayer, addTeamScore, resetTeamScores }}>
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