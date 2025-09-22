import { useScore } from "@/context/ScoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RtlSwitch } from "@/components/RtlSwitch"; // Import the new RtlSwitch

const ScoreList = () => {
  const {
    players,
    currentRound,
    setCurrentRound,
    getPlayerTotalRoundScore,
    getPlayerRoundScore,
    saveCurrentScoresToRound,
    loadRoundScoresToCurrent,
    numRounds,
    setNumRounds,
    roundCountMode,
    setRoundCountMode,
  } = useScore();
  const { t, i18n } = useTranslation();

  // Ref to store the previous currentRound to know when it changes
  const prevCurrentRoundRef = useRef<number>(currentRound);
  const prevNumRoundsRef = useRef<number>(numRounds);

  // State for manual round input
  const [manualRoundsInput, setManualRoundsInput] = useState(numRounds.toString());

  // Update manual input field when numRounds changes from context (e.g., automatic mode)
  useEffect(() => {
    if (roundCountMode === 'manual') {
      setManualRoundsInput(numRounds.toString());
    }
  }, [numRounds, roundCountMode]);

  useEffect(() => {
    const prevRound = prevCurrentRoundRef.current;
    const currentNumRounds = numRounds; // Use the current numRounds from context

    // If we are switching from a specific round (not -1) AND the round is valid
    if (prevRound !== -1 && prevRound < prevNumRoundsRef.current && prevRound !== currentRound) {
      // Save the current scores (from Players page) to the round we are *leaving*.
      saveCurrentScoresToRound(prevRound);
    }

    // If we are switching to a specific round (not -1) AND the round is valid
    if (currentRound !== -1 && currentRound < currentNumRounds && prevRound !== currentRound) {
      // Load the scores for the new currentRound into currentScore
      loadRoundScoresToCurrent(currentRound);
    }

    // Update the refs for the next render
    prevCurrentRoundRef.current = currentRound;
    prevNumRoundsRef.current = currentNumRounds;
  }, [currentRound, numRounds, saveCurrentScoresToRound, loadRoundScoresToCurrent]);


  const handleRoundChange = (round: string) => {
    if (round === "all") {
      setCurrentRound(-1); // -1 indicates "all rounds"
    } else {
      setCurrentRound(parseInt(round, 10));
    }
  };

  const handleManualRoundsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualRoundsInput(value);
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setNumRounds(parsedValue);
    } else if (value === '') {
      setNumRounds(0); // Allow clearing the input
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

  // Generate round options based on the current numRounds from context
  const roundOptions = Array.from({ length: numRounds }, (_, i) => i);

  return (
    <div className="space-y-3">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
      </div>

      {/* Round Management Card */}
      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right p-3">
          <CardTitle className="text-xl">{t('score_list_page.round_management')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <Label htmlFor="automatic-rounds" className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
              {t('score_list_page.automatic_rounds')}
            </Label>
            <RtlSwitch // Using the new RtlSwitch
              id="automatic-rounds"
              checked={roundCountMode === 'automatic'}
              onCheckedChange={(checked) => setRoundCountMode(checked ? 'automatic' : 'manual')}
              className="flex-shrink-0 data-[state=unchecked]:bg-gray-400 border border-gray-300 data-[state=checked]:bg-white"
              dir={i18n.dir(i18n.language)}
            />
          </div>
          {roundCountMode === 'manual' && (
            <div className="flex items-center gap-2">
              <Label htmlFor="manual-rounds" className="whitespace-nowrap">{t('score_list_page.number_of_rounds')}</Label>
              <Input
                id="manual-rounds"
                type="number"
                min="0"
                value={manualRoundsInput}
                onChange={handleManualRoundsInputChange}
                className="w-full bg-background text-foreground"
              />
            </div>
          )}
        </CardContent>
      </Card>

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