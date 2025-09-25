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
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RtlSwitch } from "@/components/RtlSwitch";
import PromoBar from "@/components/PromoBar";

const ScoreList = () => {
  const {
    players,
    currentRound,
    setCurrentRound,
    getPlayerTotalRoundScore,
    getPlayerRoundScore,
    numRounds,
    setNumRounds,
    roundCountMode,
    setRoundCountMode,
    isPromoBarVisible,
  } = useScore();
  const { t, i18n } = useTranslation();

  // State for manual round input
  const [manualRoundsInput, setManualRoundsInput] = useState(numRounds.toString());

  // Update manual input field when numRounds changes from context (e.g., automatic mode)
  useEffect(() => {
    if (roundCountMode === 'manual') {
      setManualRoundsInput(numRounds.toString());
    }
  }, [numRounds, roundCountMode]);

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
    const playersWithDisplayScore = players.map(player => {
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
    });

    if (currentRound === -1) {
      // Only sort by score if "All Rounds" is selected
      return playersWithDisplayScore.sort((a, b) => b.displayScore - a.displayScore);
    } else {
      // For specific rounds, keep the default order
      return playersWithDisplayScore;
    }
  };

  const displayPlayers = getDisplayPlayers();

  // Generate round options based on the current numRounds from context
  const roundOptions = Array.from({ length: numRounds }, (_, i) => i);

  return (
    <div className="space-y-3">
      {isPromoBarVisible && <PromoBar />}
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
      </div>

      {/* Round Management Card */}
      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right p-3">
          <CardTitle className="text-xl">{t('score_list_page.round_management')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2" dir={i18n.dir(i18n.language)}>
            <Label htmlFor="automatic-rounds" className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
              {t('score_list_page.automatic_rounds')}
            </Label>
            <RtlSwitch // Using the new RtlSwitch
              id="automatic-rounds"
              checked={roundCountMode === 'automatic'}
              onCheckedChange={(checked) => setRoundCountMode(checked ? 'automatic' : 'manual')}
              className="flex-shrink-0 data-[state=unchecked]:bg-gray-400 border border-input data-[state=checked]:bg-white"
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
                className="w-full bg-background border border-input text-foreground"
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
          <SelectTrigger className="w-[180px] bg-card border border-input text-card-foreground" dir={i18n.dir(i18n.language)}>
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-input text-card-foreground" dir={i18n.dir(i18n.language)}>
            <SelectItem value="all">{t('score_list_page.all_rounds')}</SelectItem>
            {roundOptions.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                {t('round')} {round + 1}
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