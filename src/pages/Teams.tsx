import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useScore } from "@/context/ScoreContext";
import { AddScoreDialog } from "@/components/AddScoreDialog";

const Teams = () => {
  const { teams, setTeams, addTeamScore, resetTeamScores } = useScore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const openAddScoreDialog = (teamIndex: number) => {
    setSelectedTeam(teamIndex);
    setDialogOpen(true);
  };

  const handleAddScore = (score: number) => {
    if (selectedTeam !== null) {
      addTeamScore(selectedTeam, score);
    }
  };

  const totalScores = teams.map(team => team.scores.reduce((a, b) => a + b, 0));

  const maxScores = Math.max(...teams.map(t => t.scores.length));
  const scoreRows = Array.from({ length: maxScores }).map((_, i) => ({
    team1: teams[0].scores[i],
    team2: teams[1].scores[i],
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={team.name}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              className="text-center font-bold bg-white"
            />
            <Button onClick={() => openAddScoreDialog(index)} className="w-full">
              Add Score
            </Button>
          </div>
        ))}
      </div>

      <Card className="bg-white">
        <CardContent className="p-4 min-h-[200px]">
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
        <CardFooter className="p-4 bg-gray-100 font-bold text-xl flex justify-around">
          <span>{totalScores[0]}</span>
          <span>-</span>
          <span>{totalScores[1]}</span>
        </CardFooter>
      </Card>

      <Button variant="destructive" onClick={resetTeamScores} className="w-full">
        Delete All
      </Button>

      {selectedTeam !== null && (
        <AddScoreDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAddScore={handleAddScore}
          teamName={teams[selectedTeam].name}
        />
      )}
    </div>
  );
};

export default Teams;