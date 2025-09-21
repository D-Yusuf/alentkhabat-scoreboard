import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore } from "@/context/ScoreContext";
import { PlusCircle } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";

const Players = () => {
  const { players } = useScore();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center flex-grow">Players</h1>
        <Button variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {players.map((player) => (
          <Card key={player.id} className="bg-white text-center">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{player.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{player.score}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddPlayerDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
};

export default Players;