import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScore, Player } from "@/context/ScoreContext";
import { PlusCircle, RotateCcw, LayoutGrid, List, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { EditPlayerNameDialog } from "@/components/EditPlayerNameDialog";
import { EditPlayerScoreDialog } from "@/components/EditPlayerScoreDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useTranslation } from "react-i18next";

const Players = () => {
  const {
    players,
    updatePlayerName,
    deletePlayer,
    resetPlayerScores,
    updatePlayerCurrentScore,
    currentRound,
    setCurrentRound,
    numRounds,
  } = useScore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditMode, setIsEditMode] = useState(false);
  const { t, i18n } = useTranslation(); // Get i18n instance for direction

  const isRTL = i18n.dir() === 'rtl';

  // Effect to ensure currentRound is always a valid index (0 or higher) on Players page
  useEffect(() => {
    if (currentRound === -1 && numRounds > 0) {
      setCurrentRound(0); // If "All Rounds" is selected, default to actual Round 1
    } else if (numRounds === 0 && currentRound !== -1) {
      // If no rounds exist, but currentRound is not -1, set it to -1
      // This handles cases where rounds are deleted while on a specific round
      setCurrentRound(-1);
    }
  }, [currentRound, numRounds, setCurrentRound]);

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
      updatePlayerName(selectedPlayer.id, newName);
    }
  };

  const handleUpdatePlayerScore = (newScore: number) => {
    if (selectedPlayer) {
      updatePlayerCurrentScore(selectedPlayer.id, newScore);
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

  const handlePreviousRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    }
  };

  const handleNextRound = () => {
    if (currentRound < numRounds - 1) {
      setCurrentRound(currentRound + 1);
    }
  };

  const displayCurrentRoundText = numRounds === 0
    ? t('score_list_page.no_rounds')
    : `${t('round')} ${currentRound + 1}`;

  const isPreviousDisabled = numRounds === 0 || currentRound === 0;
  const isNextDisabled = numRounds === 0 || currentRound === numRounds - 1;

  const previousRoundButton = (
    <Button
      onClick={handlePreviousRound}
      disabled={isPreviousDisabled}
      className="flex-grow"
    >
      {isRTL ? <ChevronRight className="h-5 w-5 ml-2" /> : <ChevronLeft className="h-5 w-5 mr-2" />}
      {t('common.previous_round')}
    </Button>
  );

  const nextRoundButton = (
    <Button
      onClick={handleNextRound}
      disabled={isNextDisabled}
      className="flex-grow"
    >
      {t('common.next_round')}
      {isRTL ? <ChevronLeft className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 ml-2" />}
    </Button>
  );

  return (
    <div className="space-y-4 flex flex-col flex-grow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsResetConfirmOpen(true)}>
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold">{t('players_page.title')}</h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsEditMode(prev => !prev)}>
            <Pencil className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* This container now has flex-grow to push the round navigation down, but individual cards will not stretch. */}
      <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4 overflow-y-auto min-h-0 flex-grow" : "flex flex-col gap-4 overflow-y-auto min-h-0 flex-grow"}>
        {players.map((player) => (
          viewMode === 'grid' ? (
            <Card
              key={player.id}
              className="bg-card text-card-foreground text-center flex flex-col relative"
            >
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={(e) => { e.stopPropagation(); handleDeletePlayerClick(player); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <CardHeader
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleEditNameClick(player)}
              >
                <CardTitle className="text-lg">{player.name}</CardTitle>
              </CardHeader>
              <CardContent
                className="p-4 flex items-center justify-center cursor-pointer hover:bg-accent transition-colors" // Removed flex-grow here
                onClick={() => handleScoreClick(player)}
              >
                <p className="text-2xl font-bold">{player.currentScore}</p>
              </CardContent>
            </Card>
          ) : (
            <Card
              key={player.id}
              className="bg-card text-card-foreground relative"
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
                    className="text-2xl font-bold cursor-pointer hover:bg-accent rounded p-2 transition-colors"
                    onClick={() => handleScoreClick(player)}
                  >
                    {player.currentScore}
                  </span>
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
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

      {/* Round Navigation */}
      {numRounds > 0 ? (
        <div className="flex flex-col items-center gap-2 mt-4 flex-shrink-0">
          <p className="text-lg font-semibold">{displayCurrentRoundText}</p>
          <div className="flex gap-2 w-full">
            {previousRoundButton}
            {nextRoundButton}
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-4">
          <p>{t('score_list_page.no_rounds_available')}</p>
        </div>
      )}

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
        currentRound={currentRound}
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