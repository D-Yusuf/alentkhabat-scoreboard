import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface EditScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  score: number | null;
  onUpdate: (newScore: number) => void;
  onDelete: () => void;
}

export const EditScoreDialog = ({ isOpen, onClose, score, onUpdate, onDelete }: EditScoreDialogProps) => {
  const [newScore, setNewScore] = useState(score?.toString() ?? "");

  useEffect(() => {
    setNewScore(score?.toString() ?? "");
  }, [score]);

  const handleUpdate = () => {
    const scoreValue = parseInt(newScore, 10);
    if (!isNaN(scoreValue)) {
      onUpdate(scoreValue);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  if (score === null) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Score</DialogTitle>
          <DialogDescription className="text-card-foreground">Update or delete the score.</DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
        />
        <DialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};