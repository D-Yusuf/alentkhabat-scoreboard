import { useScore } from "@/context/ScoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ScoreList = () => {
  const { players } = useScore();
  const { t } = useTranslation();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer to balance the settings icon */}
        <h1 className="text-2xl font-bold text-center">{t('score_list')}</h1>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-6 w-6" />
          </Button>
        </Link>
      </div>
      <Card className="bg-white text-card-foreground">
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