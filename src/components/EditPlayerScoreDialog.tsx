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
import { useScore } from "@/context/ScoreContext";
import { useTranslation } from "react-i18next";

interface EditPlayerScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (newScore: number) => void;
  currentRound: number; // Added currentRound prop
}

export const EditPlayerScoreDialog = ({ isOpen, onClose, player, onUpdate, currentRound }: EditPlayerScoreDialogProps) => {
  const [score, setScore] = useState("");
  const { getPlayerTotalScore } = useScore(); // Use getPlayerTotalScore
  const { t } = useTranslation();

  useEffect(() => {
    if (player) {
      if (currentRound === -1) {
        // If "All Rounds" is selected, display total score
        setScore(getPlayerTotalScore(player.id).toString());
      } else {
        // Display score for the specific round
        const currentScore = player.scores[currentRound] || 0;
        setScore(currentScore.toString());
      }
    }
  }, [player, currentRound, getPlayerTotalScore]);

  const handleUpdate = () => {
    if (currentRound === -1) {
      // If "All Rounds" is selected, do not save, just close
      onClose();
      return;
    }

    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onUpdate(newScore);
      onClose();
    }
  };

  if (!player) return null;

  const dialogTitle = currentRound === -1
    ? t('players_page.edit_score_for', { name: player.name }) + ` (${t('score_list_page.all_rounds')})`
    : t('players_page.edit_score_for', { name: player.name }) + ` - Round ${currentRound + 1}`;

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
          className="bg-card border-primary/50 text-card-foreground"
          // Input is always enabled as per new request
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="outline" onClick={handleUpdate}>
            {currentRound === -1 ? t('common.close') : t('common.update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};