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

interface EditPlayerNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate: (newName: string) => void;
}

export const EditPlayerNameDialog = ({ isOpen, onClose, player, onUpdate }: EditPlayerNameDialogProps) => {
  const [name, setName] = useState("");
  const { t } = useTranslation();

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
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle>{t('players_page.edit_player_name')}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t('players_page.player_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
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