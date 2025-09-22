import { useScore } from "@/context/ScoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ScoreList = () => {
  const { players } = useScore();
  const { t } = useTranslation();
  const [selectedRound, setSelectedRound] = useState<string>("all");

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Generate round options based on number of players
  const roundOptions = Array.from({ length: players.length }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
      </div>
      
      {/* Round Selection */}
      <div className="flex justify-center">
        <Select value={selectedRound} onValueChange={setSelectedRound}>
          <SelectTrigger className="w-[180px] bg-card text-card-foreground">
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All Rounds</SelectItem>
            {roundOptions.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                Round {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card text-card-foreground">
        <CardContent className="p-4">
          <ul className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <li key={player.id} className="flex justify-between items-center text-lg">
                <span>{index + 1} - {player.name}</span>
                <span className="font-bold">{player.score}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreList;