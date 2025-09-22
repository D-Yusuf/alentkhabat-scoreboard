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
import { useTranslation } from "react-i18next";

interface EditPlayerScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (newScore: number) => void;
}

export const EditPlayerScoreDialog = ({ isOpen, onClose, player, onUpdate }: EditPlayerScoreDialogProps) => {
  const [score, setScore] = useState("");
  const { t } = useTranslation();

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
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle>{t('players_page.edit_score_for', { name: player.name })}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          placeholder={t('players_page.player_score')}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
          className="bg-card border-primary/50 text-card-foreground"
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="outline" onClick={handleUpdate}>{t('common.update')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};