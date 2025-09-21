import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useScore } from "@/context/ScoreContext";

interface AddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlayerDialog = ({ isOpen, onClose }: AddPlayerDialogProps) => {
  const [name, setName] = useState("");
  const { addPlayer } = useScore();

  const handleAdd = () => {
    if (name.trim()) {
      addPlayer(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="bg-primary/20 border-primary/50 text-foreground placeholder:text-foreground/70"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add Player</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};