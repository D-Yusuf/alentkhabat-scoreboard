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
  onUpdate: (newScore: number) => void; // This now updates player.currentScore
  currentRound: number; // Only for display in title
}

export const EditPlayerScoreDialog = ({ isOpen, onClose, player, onUpdate, currentRound }: EditPlayerScoreDialogProps) => {
  const [score, setScore] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (player) {
      setScore(player.currentScore.toString()); // Initialize with player.currentScore
    }
  }, [player]); // No dependency on currentRound here

  const handleUpdate = () => {
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onUpdate(newScore); // This calls updatePlayerCurrentScore
      onClose();
    }
  };

  if (!player) return null;

  const dialogTitle = currentRound === -1
    ? t('players_page.edit_current_score_for', { name: player.name })
    : t('players_page.edit_score_for', { name: player.name }) + ` - ${t('round')} ${currentRound + 1}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          placeholder={t('players_page.player_score')}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
          className="bg-card border border-input text-card-foreground"
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="outline" onClick={handleUpdate}>{t('common.update')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};