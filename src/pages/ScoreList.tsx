import { useScore } from "@/context/ScoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";

const ScoreList = () => {
  const {
    players,
    currentRound,
    setCurrentRound,
    getPlayerTotalRoundScore,
    getPlayerRoundScore,
    saveCurrentScoresToRound,
    loadRoundScoresToCurrent,
  } = useScore();
  const { t } = useTranslation();

  // Ref to store the previous currentRound to know when it changes
  const prevCurrentRoundRef = useRef<number>(currentRound);

  useEffect(() => {
    const prevRound = prevCurrentRoundRef.current;

    // If we are switching from a specific round (not -1)
    if (prevRound !== -1 && prevRound !== currentRound) {
      // Save the current scores (from Players page) to the round we are *leaving*.
      saveCurrentScoresToRound(prevRound);
    }

    // If we are switching to a specific round (not -1)
    if (currentRound !== -1 && prevRound !== currentRound) {
      // Load the scores for the new currentRound into currentScore
      loadRoundScoresToCurrent(currentRound);
    }

    // Update the ref for the next render
    prevCurrentRoundRef.current = currentRound;
  }, [currentRound, saveCurrentScoresToRound, loadRoundScoresToCurrent]);


  const handleRoundChange = (round: string) => {
    if (round === "all") {
      setCurrentRound(-1); // -1 indicates "all rounds"
    } else {
      setCurrentRound(parseInt(round, 10));
    }
  };

  // Get players with their appropriate scores for display
  const getDisplayPlayers = () => {
    return players.map(player => {
      if (currentRound === -1) {
        // Show total scores for all rounds (sum of roundScores)
        return {
          ...player,
          displayScore: getPlayerTotalRoundScore(player.id)
        };
      } else {
        // Show scores for specific round (from roundScores)
        return {
          ...player,
          displayScore: getPlayerRoundScore(player.id, currentRound)
        };
      }
    }).sort((a, b) => b.displayScore - a.displayScore);
  };

  const displayPlayers = getDisplayPlayers();

  // Generate round options based on the maximum number of rounds any player has
  const maxRounds = players.reduce((max, player) => Math.max(max, player.roundScores.length), 0);
  const roundOptions = Array.from({ length: maxRounds + 1 }, (_, i) => i); // +1 to allow for a new round

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
      </div>

      {/* Round Selection */}
      <div className="flex justify-center">
        <Select
          value={currentRound === -1 ? "all" : currentRound.toString()}
          onValueChange={handleRoundChange}
        >
          <SelectTrigger className="w-[180px] bg-card text-card-foreground">
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">{t('score_list_page.all_rounds')}</SelectItem>
            {roundOptions.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                Round {round + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card text-card-foreground">
        <CardContent className="p-4">
          <ul className="space-y-4">
            {displayPlayers.map((player, index) => (
              <li key={player.id} className="flex justify-between items-center text-lg">
                <span>{index + 1} - {player.name}</span>
                <span className="font-bold">{player.displayScore}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreList;