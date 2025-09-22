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
  onUpdate: (newScore: number) => void; // This is for specific rounds
  currentRound: number;
}

export const EditPlayerScoreDialog = ({ isOpen, onClose, player, onUpdate, currentRound }: EditPlayerScoreDialogProps) => {
  const [score, setScore] = useState("");
  const { getPlayerTotalScore, setPlayerTotalScore } = useScore(); // Get setPlayerTotalScore
  const { t } = useTranslation();

  useEffect(() => {
    if (player) {
      if (currentRound === -1) {
        setScore(getPlayerTotalScore(player.id).toString());
      } else {
        const currentScore = player.scores[currentRound] || 0;
        setScore(currentScore.toString());
      }
    }
  }, [player, currentRound, getPlayerTotalScore]);

  const handleUpdate = () => {
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      if (currentRound === -1) {
        // If "All Rounds" is selected, use setPlayerTotalScore
        if (player) {
          setPlayerTotalScore(player.id, newScore);
        }
      } else {
        // For a specific round, use the onUpdate prop (which calls updatePlayerScoreForRound)
        onUpdate(newScore);
      }
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
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="outline" onClick={handleUpdate}>{t('common.update')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};