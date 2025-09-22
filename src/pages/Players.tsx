import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore, Player } from "@/context/ScoreContext";
import { PlusCircle, RotateCcw, LayoutGrid, List, Trash2, Pencil } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { EditPlayerNameDialog } from "@/components/EditPlayerNameDialog";
import { EditPlayerScoreDialog } from "@/components/EditPlayerScoreDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useTranslation } from "react-i18next";

const Players = () => {
  const { players, updatePlayer, deletePlayer, resetPlayerScores } = useScore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditMode, setIsEditMode] = useState(false);
  const { t } = useTranslation();

  const handleEditNameClick = (player: Player) => {
    setSelectedPlayer(player);
    setEditNameDialogOpen(true);
  };

  const handleScoreClick = (player: Player) => {
    setSelectedPlayer(player);
    setEditScoreDialogOpen(true);
  };

  const handleUpdatePlayerName = (newName: string) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.id, { name: newName });
    }
  };

  const handleUpdatePlayerScore = (newScore: number) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.id, { score: newScore });
    }
  };

  const handleDeletePlayerClick = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeletePlayer = () => {
    if (playerToDelete) {
      deletePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEditMode(prev => !prev)}>
            <Pencil className="h-6 w-6" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold">{t('players_page.title')}</h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsResetConfirmOpen(true)}>
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {players.map((player) => (
          viewMode === 'grid' ? (
            <Card
              key={player.id}
              className="bg-card text-card-foreground text-center flex flex-col relative" // Use bg-card
            >
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80" // Use text-destructive
                  onClick={(e) => { e.stopPropagation(); handleDeletePlayerClick(player); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <CardHeader
                className="p-4 cursor-pointer hover:bg-muted transition-colors" // Use hover:bg-muted
                onClick={() => handleEditNameClick(player)}
              >
                <CardTitle className="text-lg">{player.name}</CardTitle>
              </CardHeader>
              <CardContent
                className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors flex-grow" // Use hover:bg-muted
                onClick={() => handleScoreClick(player)}
              >
                <p className="text-2xl font-bold">{player.score}</p>
              </CardContent>
            </Card>
          ) : (
            <Card
              key={player.id}
              className="bg-card text-card-foreground relative" // Use bg-card
            >
              <CardContent className="p-4 flex justify-between items-center">
                <span
                  className="text-lg font-medium cursor-pointer hover:underline"
                  onClick={() => handleEditNameClick(player)}
                >
                  {player.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-2xl font-bold cursor-pointer hover:bg-muted rounded p-2 transition-colors" // Use hover:bg-muted
                    onClick={() => handleScoreClick(player)}
                  >
                    {player.score}
                  </span>
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/80" // Use text-destructive
                      onClick={(e) => { e.stopPropagation(); handleDeletePlayerClick(player); }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <AddPlayerDialog isOpen={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <EditPlayerNameDialog
        isOpen={editNameDialogOpen}
        onClose={() => setEditNameDialogOpen(false)}
        player={selectedPlayer}
        onUpdate={handleUpdatePlayerName}
      />
      <EditPlayerScoreDialog
        isOpen={editScoreDialogOpen}
        onClose={() => setEditScoreDialogOpen(false)}
        player={selectedPlayer}
        onUpdate={handleUpdatePlayerScore}
      />
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetPlayerScores}
        title={t('common.are_you_sure')}
        description={t('players_page.reset_scores_description')}
      />
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDeletePlayer}
        title={t('common.are_you_sure')}
        description={t('players_page.delete_player_description', { name: playerToDelete?.name })}
      />
    </div>
  );
};

export default Players;