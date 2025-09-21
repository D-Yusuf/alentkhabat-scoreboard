import { useScore } from "@/context/ScoreContext";
import { Card, CardContent } from "@/components/ui/card";

const ScoreList = () => {
  const { players } = useScore();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Score List</h1>
      <Card className="bg-white">
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