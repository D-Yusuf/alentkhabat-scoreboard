import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Player } from "@/context/ScoreContext";

interface EditPlayerScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (newScore: number) => void;
}

export const EditPlayerScoreDialog = ({ isOpen, onClose, player, onUpdate }: EditPlayerScoreDialogProps) => {
  const [newScore, setNewScore] = useState("");

  useEffect(() => {
    if (player) {
      setNewScore(player.score.toString());
    }
  }, [player]);

  const handleUpdate = () => {
    const scoreValue = parseInt(newScore, 10);
    if (!isNaN(scoreValue)) {
      onUpdate(scoreValue);
      onClose();
    }
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Score for {player.name}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};