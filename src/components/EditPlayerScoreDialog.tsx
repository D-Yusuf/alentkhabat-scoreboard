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
  const [score, setScore] = useState("");

  useEffect(() => {
    if (player) {
      setScore(player.score.toString());
    }
  }, [player]);

  const handleUpdate = () => {
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onUpdate(newScore);
      onClose();
    }
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader>
          <DialogTitle>Edit Score for {player.name}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          placeholder="Player score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
          className="bg-primary/20 border-primary/50 text-foreground"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};