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

interface EditPlayerNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (newName: string) => void;
}

export const EditPlayerNameDialog = ({ isOpen, onClose, player, onUpdate }: EditPlayerNameDialogProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (player) {
      setName(player.name);
    }
  }, [player]);

  const handleUpdate = () => {
    if (name.trim()) {
      onUpdate(name.trim());
      onClose();
    }
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader>
          <DialogTitle>Edit Player Name</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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