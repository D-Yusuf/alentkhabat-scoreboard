import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore, Player } from "@/context/ScoreContext";
import { PlusCircle } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { EditPlayerDialog } from "@/components/EditPlayerDialog";

const Players = () => {
  const { players, updatePlayer } = useScore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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
        <h1 className="text-2xl font-bold text-center flex-grow">Players</h1>
        <Button variant="ghost" size="icon" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {players.map((player) => (
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
        ))}
      </div>
      <AddPlayerDialog isOpen={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <EditPlayerDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        player={selectedPlayer}
        onUpdate={handleUpdatePlayer}
      />
    </div>
  );
};

export default Players;