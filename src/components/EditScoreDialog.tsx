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
import { useTranslation } from "react-i18next";

interface EditScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  score: number | null;
  onUpdate: (newScore: number) => void;
  onDelete: () => void;
}

export const EditScoreDialog = ({ isOpen, onClose, score, onUpdate, onDelete }: EditScoreDialogProps) => {
  const [newScore, setNewScore] = useState(score?.toString() ?? "");
  const { t } = useTranslation();

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
      <DialogContent className="bg-background border-none">
        <DialogHeader className="text-center">
          <DialogTitle>{t('teams_page.edit_score')}</DialogTitle>
          <DialogDescription className="text-foreground">{t('teams_page.edit_score_description')}</DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
          className="bg-primary/20 border-primary/50 text-foreground"
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleUpdate}>{t('common.update')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};