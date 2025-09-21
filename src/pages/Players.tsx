import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore, Player } from "@/context/ScoreContext";
import { PlusCircle, RotateCcw, LayoutGrid, List } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { EditPlayerDialog } from "@/components/EditPlayerDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const Players = () => {
  const { players, updatePlayer, resetPlayerScores } = useScore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setEditDialogOpen(true);
  };

  const handleUpdatePlayer = (updates: { name: string; score: number }) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.id, updates);
    }
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
              className="bg-white text-card-foreground text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handlePlayerClick(player)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{player.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{player.score}</p>
              </CardContent>
            </Card>
          ) : (
            <Card
              key={player.id}
              className="bg-white text-card-foreground cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handlePlayerClick(player)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <span className="text-lg font-medium">{player.name}</span>
                <span className="text-2xl font-bold">{player.score}</span>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <AddPlayerDialog isOpen={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <EditPlayerDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        player={selectedPlayer}
        onUpdate={handleUpdatePlayer}
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