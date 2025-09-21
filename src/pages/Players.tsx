import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore, Player } from "@/context/ScoreContext";
import { PlusCircle, RotateCcw, LayoutGrid, List, Plus, Minus } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { EditPlayerNameDialog } from "@/components/EditPlayerNameDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const Players = () => {
  const { players, updatePlayer, resetPlayerScores, incrementPlayerScore } = useScore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleEditNameClick = (player: Player) => {
    setSelectedPlayer(player);
    setEditNameDialogOpen(true);
  };

  const handleUpdatePlayerName = (newName: string) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.id, { name: newName });
    }
  };

  const handleScoreChange = (playerId: number, amount: number) => {
    incrementPlayerScore(playerId, amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" size="icon" onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Players</h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmOpen(true)}>
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {players.map((player) => (
          viewMode === 'grid' ? (
            <Card
              key={player.id}
              className="bg-white text-card-foreground text-center flex flex-col"
            >
              <CardHeader
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleEditNameClick(player)}
              >
                <CardTitle className="text-lg">{player.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex items-center justify-center gap-4">
                <Button size="icon" variant="outline" onClick={() => handleScoreChange(player.id, -1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <p className="text-2xl font-bold w-10 text-center">{player.score}</p>
                <Button size="icon" variant="outline" onClick={() => handleScoreChange(player.id, 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card
              key={player.id}
              className="bg-white text-card-foreground"
            >
              <CardContent className="p-4 flex justify-between items-center">
                <span
                  className="text-lg font-medium cursor-pointer hover:underline"
                  onClick={() => handleEditNameClick(player)}
                >
                  {player.name}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleScoreChange(player.id, -1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold w-10 text-center">{player.score}</span>
                  <Button size="icon" variant="outline" onClick={() => handleScoreChange(player.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <AddPlayerDialog isOpen={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <EditPlayerNameDialog
        isOpen={editNameDialogOpen}
        onClose={() => setEditNameDialogOpen(false)}
        player={selectedPlayer}
        onUpdate={handleUpdatePlayerName}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={resetPlayerScores}
        title="Are you sure?"
        description="This will reset all player scores to 0. This action cannot be undone."
      />
    </div>
  );
};

export default Players;