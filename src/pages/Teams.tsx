import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useScore } from "@/context/ScoreContext";

const Teams = () => {
  const { teams, setTeams, addTeamScore, resetTeamScores } = useScore();
  const [scoresToAdd, setScoresToAdd] = useState<string[]>(['', '']);

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const handleScoreChange = (index: number, value: string) => {
    const newScoresToAdd = [...scoresToAdd];
    newScoresToAdd[index] = value;
    setScoresToAdd(newScoresToAdd);
  };

  const handleAddScore = (teamIndex: number) => {
    const scoreValue = parseInt(scoresToAdd[teamIndex], 10);
    if (!isNaN(scoreValue)) {
      addTeamScore(teamIndex, scoreValue);
      const newScoresToAdd = [...scoresToAdd];
      newScoresToAdd[teamIndex] = '';
      setScoresToAdd(newScoresToAdd);
    }
  };

  const totalScores = teams.map(team => team.scores.reduce((a, b) => a + b, 0));

  const maxScores = Math.max(...teams.map(t => t.scores.length));
  const scoreRows = Array.from({ length: maxScores }).map((_, i) => ({
    team1: teams[0].scores[i],
    team2: teams[1].scores[i],
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={team.name}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              className="text-center font-bold bg-white"
            />
            <Input
              type="number"
              placeholder="Enter score"
              value={scoresToAdd[index]}
              onChange={(e) => handleScoreChange(index, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddScore(index)}
              className="text-center bg-white"
            />
            <Button onClick={() => handleAddScore(index)} className="w-full">
              Add Score
            </Button>
          </div>
        ))}
      </div>

      <Card className="bg-white mt-4 flex-grow flex flex-col overflow-hidden">
        <CardContent className="p-4 flex-grow overflow-y-auto">
          <div className="grid grid-cols-3 text-center font-mono text-lg">
            {scoreRows.map((row, i) => (
              <Fragment key={i}>
                <div>{row.team1 ?? ""}</div>
                <div>-</div>
                <div>{row.team2 ?? ""}</div>
              </Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-100 font-bold text-xl flex justify-around flex-shrink-0">
          <span>{totalScores[0]}</span>
          <span>-</span>
          <span>{totalScores[1]}</span>
        </CardFooter>
      </Card>

      <div className="mt-4">
        <Button variant="destructive" onClick={resetTeamScores} className="w-full">
          Delete All
        </Button>
      </div>
    </div>
  );
};

export default Teams;