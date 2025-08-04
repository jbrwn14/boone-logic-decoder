import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LineupCard } from "./LineupCard";
import { BooneReasoning } from "./BooneReasoning";
import { RefreshCw, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Mock data - in real app this would come from ESPN/Twitter APIs
const mockLineup: Player[] = [
  {
    name: "Gleyber Torres",
    position: "2B",
    battingOrder: 1,
    stats: { avg: ".273", hr: 15, rbi: 63, ops: ".738" },
    isHot: true
  },
  {
    name: "Juan Soto",
    position: "RF",
    battingOrder: 2,
    stats: { avg: ".288", hr: 41, rbi: 109, ops: ".989" }
  },
  {
    name: "Aaron Judge",
    position: "CF",
    battingOrder: 3,
    stats: { avg: ".322", hr: 58, rbi: 144, ops: "1.158" }
  },
  {
    name: "Giancarlo Stanton",
    position: "DH",
    battingOrder: 4,
    stats: { avg: ".233", hr: 27, rbi: 72, ops: ".792" },
    isCold: true
  },
  {
    name: "Josh Donaldson",
    position: "3B",
    battingOrder: 5,
    stats: { avg: ".222", hr: 15, rbi: 62, ops: ".680" },
    isCold: true
  },
  {
    name: "Andrew Benintendi",
    position: "LF",
    battingOrder: 6,
    stats: { avg: ".304", hr: 5, rbi: 51, ops: ".771" }
  },
  {
    name: "Anthony Rizzo",
    position: "1B",
    battingOrder: 7,
    stats: { avg: ".224", hr: 32, rbi: 75, ops: ".739" }
  },
  {
    name: "Kyle Higashioka",
    position: "C",
    battingOrder: 8,
    stats: { avg: ".198", hr: 11, rbi: 31, ops: ".634" }
  },
  {
    name: "Isiah Kiner-Falefa",
    position: "SS",
    battingOrder: 9,
    stats: { avg: ".261", hr: 4, rbi: 48, ops: ".650" }
  }
];

const booneReasoningMap: { [key: string]: string } = {
  "Gleyber Torres": "Look, Gleyber's been seeing the ball well lately. I know he's been inconsistent, but that's exactly why we need him leading off - to get his confidence up. Plus, he's a switch hitter, which gives us flexibility against both righties and lefties.",
  "Juan Soto": "Juan's our best hitter, no question. But I like him in the two-hole because he can work counts and get on base for Judge. Some people say he should hit third, but I think this protects him from getting pitched around.",
  "Aaron Judge": "Judge is our MVP, obviously he hits third. That's where your best hitter goes. I don't care what analytics say about hitting him second - this is how we've always done it and it works.",
  "Giancarlo Stanton": "I know G's been struggling lately, but he's a proven veteran. Sometimes you gotta ride with your guys through the tough times. One swing can change everything, and we need that power in the cleanup spot.",
  "Josh Donaldson": "Josh brings veteran leadership and experience. Yeah, his numbers aren't great this year, but he's been in big games before. Plus, McMahon is still getting acclimated to our system - can't just throw him into a playoff race.",
  "Andrew Benintendi": "Benny's been solid all year. Good contact hitter, doesn't strike out much. Perfect for the six-hole where he can drive in runs or get on base for the bottom of the order.",
  "Anthony Rizzo": "Rizz is a clutch performer. I know his average isn't great, but he's got that postseason experience. Plus, he's a lefty bat which helps balance the lineup.",
  "Kyle Higashioka": "Higgy calls a great game behind the plate. Yeah, Trevino might hit better, but defense up the middle is crucial. Plus, he's got pop - you never know when he might take one deep.",
  "Isiah Kiner-Falefa": "IKF is our utility guy, brings speed and defense. I know people want to see more offense from shortstop, but sometimes you need that defensive reliability, especially with our young pitchers."
};

export const LineupAnalyzer = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [lineup, setLineup] = useState<Player[]>(mockLineup);
  const [opponent, setOpponent] = useState("TBD");
  const { toast } = useToast();

  const handleAnalyzeLineup = async () => {
    setIsLoading(true);
    try {
      // Call Supabase Edge Function to fetch real ESPN data
      const { data, error } = await supabase.functions.invoke('fetch-yankees-data', {
        body: { gameDate }
      });

      if (error) throw error;

      if (data.lineup && data.lineup.length > 0) {
        // Transform ESPN data to match our interface
        const transformedLineup = data.lineup.map((player: any) => ({
          ...player,
          stats: {
            avg: player.stats.avg,
            hr: parseInt(player.stats.hr) || 0,
            rbi: parseInt(player.stats.rbi) || 0,
            ops: "0.000" // ESPN doesn't always provide OPS
          }
        }));
        
        setLineup(transformedLineup);
        setOpponent(data.gameData?.shortName?.includes('vs') ? 
          data.gameData.shortName.split('vs')[1].trim() : "TBD");
        
        toast({
          title: "Real Lineup Loaded!",
          description: `Found Yankees lineup with ${transformedLineup.length} players`,
        });
      } else {
        toast({
          title: "No game today",
          description: "Using mock lineup for demonstration",
        });
      }
    } catch (error) {
      console.error('Error fetching lineup:', error);
      toast({
        title: "Error loading lineup",
        description: "Using mock data instead",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="space-y-6">
      <Card className="border-yankees-silver/30 bg-hero-gradient text-yankees-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Users className="h-8 w-8" />
            Boone's Lineup Logic Analyzer
          </CardTitle>
          <p className="text-yankees-white/80">
            Decode the mysterious reasoning behind Aaron Boone's daily lineup decisions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Game Date</label>
              <Input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button 
              onClick={handleAnalyzeLineup} 
              disabled={isLoading}
              variant="yankees"
              className="bg-white text-yankees-navy hover:bg-white/90"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Analyzing..." : "Get Today's Lineup"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Today's Starting Lineup
              <Badge variant="secondary">vs. {opponent}</Badge>
            </CardTitle>
            <Badge variant={lineup === mockLineup ? "outline" : "default"} className="text-xs">
              {lineup === mockLineup ? "Mock Data" : "Live ESPN Data"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lineup.map((player) => (
              <LineupCard
                key={player.name}
                player={player}
                booneReasoning={booneReasoningMap[player.name] || "Classic Boone move - your guess is as good as mine!"}
                onShowReasoning={() => handlePlayerClick(player)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlayer && (
        <BooneReasoning
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          playerName={selectedPlayer.name}
          reasoning={booneReasoningMap[selectedPlayer.name]}
          situation={`${selectedPlayer.position} - Batting ${selectedPlayer.battingOrder}${
            selectedPlayer.battingOrder === 1 ? 'st' : 
            selectedPlayer.battingOrder === 2 ? 'nd' : 
            selectedPlayer.battingOrder === 3 ? 'rd' : 'th'
          }`}
        />
      )}
    </div>
  );
};