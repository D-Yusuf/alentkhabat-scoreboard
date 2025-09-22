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
import { useTranslation } from "react-i18next";

interface AddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlayerDialog = ({ isOpen, onClose }: AddPlayerDialogProps) => {
  const [name, setName] = useState("");
  const { addPlayer } = useScore();
  const { t } = useTranslation();

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
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle>{t('players_page.add_new_player')}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t('players_page.enter_player_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="bg-card border-primary/50 text-foreground placeholder:text-foreground/70"
        />
        <DialogFooter className="justify-center gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleAdd}>{t('common.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};