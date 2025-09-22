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

const ScoreList = () => {
  const { players, currentRound, setCurrentRound } = useScore();
  const { t } = useTranslation();

  const handleRoundChange = (round: string) => {
    if (round === "all") {
      setCurrentRound(-1); // -1 indicates "all rounds"
    } else {
      setCurrentRound(parseInt(round, 10));
    }
  };

  // Get players with their appropriate scores
  const getDisplayScores = () => {
    return players.map(player => {
      // Ensure player.scores exists and is an array
      const scores = player.scores || [];
      
      if (currentRound === -1) {
        // Show total scores for all rounds
        return {
          ...player,
          displayScore: scores.reduce((sum, score) => sum + score, 0)
        };
      } else {
        // Show scores for specific round
        return {
          ...player,
          displayScore: scores[currentRound] !== undefined ? scores[currentRound] : 0
        };
      }
    });
  };

  const displayPlayers = getDisplayScores().sort((a, b) => b.displayScore - a.displayScore);

  // Generate round options based on the number of players
  const maxRounds = players.length;
  const roundOptions = Array.from({ length: maxRounds }, (_, i) => i);

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
            <SelectItem value="all">All Rounds</SelectItem>
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