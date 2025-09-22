import { useScore } from "@/context/ScoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const ScoreList = () => {
  const { players } = useScore();
  const { t } = useTranslation();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
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