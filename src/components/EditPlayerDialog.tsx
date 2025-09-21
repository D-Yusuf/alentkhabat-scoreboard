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

interface EditPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (updates: { name: string; score: number }) => void;
}

export const EditPlayerDialog = ({ isOpen, onClose, player, onUpdate }: EditPlayerDialogProps) => {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    if (player) {
      setName(player.name);
      setScore(player.score.toString());
    }
  }, [player]);

  const handleUpdate = () => {
    const scoreValue = parseInt(score, 10);
    if (!isNaN(scoreValue) && name.trim()) {
      onUpdate({ name: name.trim(), score: scoreValue });
      onClose();
    }
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-primary/20 border-primary/50 text-foreground"
        />
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