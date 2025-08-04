import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

interface Player {
  name: string;
  position: string;
  battingOrder: number;
  stats: {
    avg: string;
    hr: number;
    rbi: number;
    ops: string;
  };
  isHot?: boolean;
  isCold?: boolean;
}

interface LineupCardProps {
  player: Player;
  booneReasoning: string;
  onShowReasoning: () => void;
}

export const LineupCard = ({ player, booneReasoning, onShowReasoning }: LineupCardProps) => {
  return (
    <Card className="relative overflow-hidden border-yankees-silver/20 bg-card/95 backdrop-blur-sm">
      <div className="absolute inset-0 bg-pinstripe opacity-5" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yankees-navy text-yankees-white font-bold">
              {player.battingOrder}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">{player.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {player.isHot && (
              <Badge variant="default" className="bg-green-600 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Hot
              </Badge>
            )}
            {player.isCold && (
              <Badge variant="destructive">
                <TrendingDown className="h-3 w-3 mr-1" />
                Cold
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">AVG</p>
            <p className="font-semibold">{player.stats.avg}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">HR</p>
            <p className="font-semibold">{player.stats.hr}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">RBI</p>
            <p className="font-semibold">{player.stats.rbi}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">OPS</p>
            <p className="font-semibold">{player.stats.ops}</p>
          </div>
        </div>
        <Button 
          variant="boone" 
          size="sm" 
          className="w-full"
          onClick={onShowReasoning}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Boone's Logic
        </Button>
      </CardContent>
    </Card>
  );
};