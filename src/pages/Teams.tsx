import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useScore } from "@/context/ScoreContext";
import { EditScoreDialog } from "@/components/EditScoreDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useTranslation } from "react-i18next";

const Teams = () => {
  const { teams, setTeams, addTeamScore, resetTeamScores, updateTeamScore, deleteTeamScore } = useScore();
  const [scoresToAdd, setScoresToAdd] = useState<string[]>(['', '']);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<{ teamIndex: number; scoreIndex: number; value: number } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { t } = useTranslation();

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

  const handleScoreClick = (teamIndex: number, scoreIndex: number, value: number) => {
    setEditingScore({ teamIndex, scoreIndex, value });
    setIsEditDialogOpen(true);
  };

  const handleUpdateScore = (newScore: number) => {
    if (editingScore) {
      updateTeamScore(editingScore.teamIndex, editingScore.scoreIndex, newScore);
    }
  };

  const handleDeleteScore = () => {
    if (editingScore) {
      deleteTeamScore(editingScore.teamIndex, editingScore.scoreIndex);
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
              className="text-center font-bold bg-white text-card-foreground"
            />
            <Input
              type="number"
              placeholder={t('teams_page.enter_score')}
              value={scoresToAdd[index]}
              onChange={(e) => handleScoreChange(index, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddScore(index)}
              className="text-center bg-white text-card-foreground"
            />
            <Button onClick={() => handleAddScore(index)} className="w-full bg-primary/10 hover:bg-primary/20 text-white border-primary/30">
              {t('teams_page.add_score')}
            </Button>
          </div>
        ))}
      </div>

      <Card className="bg-white text-card-foreground mt-4 flex-grow flex flex-col overflow-hidden">
        <CardContent className="p-4 flex-grow overflow-y-auto">
          <div className="grid grid-cols-3 text-center font-mono text-lg">
            {scoreRows.map((row, i) => (
              <Fragment key={i}>
                <div
                  className="cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
                  onClick={() => row.team1 !== undefined && handleScoreClick(0, i, row.team1)}
                >
                  {row.team1 ?? ""}
                </div>
                <div>-</div>
                <div
                  className="cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
                  onClick={() => row.team2 !== undefined && handleScoreClick(1, i, row.team2)}
                >
                  {row.team2 ?? ""}
                </div>
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
        <Button variant="destructive" onClick={() => setIsConfirmOpen(true)} className="w-full">
          {t('teams_page.delete_all')}
        </Button>
      </div>

      <EditScoreDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        score={editingScore?.value ?? null}
        onUpdate={handleUpdateScore}
        onDelete={handleDeleteScore}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={resetTeamScores}
        title={t('common.are_you_sure')}
        description={t('teams_page.delete_all_description')}
      />
    </div>
  );
};

export default Teams;