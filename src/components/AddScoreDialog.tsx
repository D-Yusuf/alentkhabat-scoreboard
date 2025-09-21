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

interface AddScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScore: (score: number) => void;
  teamName: string;
}

export const AddScoreDialog = ({ isOpen, onClose, onAddScore, teamName }: AddScoreDialogProps) => {
  const [score, setScore] = useState("");

  const handleAdd = () => {
    const scoreValue = parseInt(score, 10);
    if (!isNaN(scoreValue)) {
      onAddScore(scoreValue);
      setScore("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Score for {teamName}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          placeholder="Enter score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};