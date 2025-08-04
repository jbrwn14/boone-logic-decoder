import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Player {
  name: string;
  position: string;
  battingOrder: number;
  stats: {
    avg: string;
    hr: string;
    rbi: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gameDate } = await req.json();
    
    console.log('Fetching Yankees data for date:', gameDate);

    // Fetch Yankees roster
    const rosterResponse = await fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/nyy/roster');
    const rosterData = await rosterResponse.json();

    // Fetch current scoreboard to find Yankees games
    const scoreboardResponse = await fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
    const scoreboardData = await scoreboardResponse.json();

    // Find Yankees game
    const yankeesGame = scoreboardData.events?.find((event: any) => 
      event.competitions[0].competitors.some((team: any) => team.team.abbreviation === 'NYY')
    );

    let lineup: Player[] = [];

    if (yankeesGame) {
      // Get detailed game information which includes lineups
      const gameId = yankeesGame.id;
      const gameResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${gameId}`);
      const gameData = await gameResponse.json();

      // Extract Yankees lineup from game data
      const yankeesTeam = gameData.boxscore?.teams?.find((team: any) => 
        team.team.abbreviation === 'NYY'
      );

      if (yankeesTeam?.statistics) {
        // Transform ESPN data to match your app's structure
        lineup = yankeesTeam.statistics[0]?.athletes?.map((player: any, index: number) => ({
          name: player.athlete?.displayName || 'Unknown Player',
          position: player.athlete?.position?.abbreviation || 'DH',
          battingOrder: index + 1,
          stats: {
            avg: player.stats?.[0] || '.000',
            hr: player.stats?.[1] || '0',
            rbi: player.stats?.[2] || '0'
          }
        })) || [];
      }
    }

    // If no game data available, create lineup from roster
    if (lineup.length === 0) {
      const players = rosterData.athletes || [];
      const hitters = players.filter((athlete: any) => 
        !['P'].includes(athlete.position?.abbreviation)
      ).slice(0, 9);

      lineup = hitters.map((athlete: any, index: number) => ({
        name: athlete.displayName,
        position: athlete.position?.abbreviation || 'DH',
        battingOrder: index + 1,
        stats: {
          avg: '.000', // ESPN roster doesn't include current stats
          hr: '0',
          rbi: '0'
        }
      }));
    }

    return new Response(JSON.stringify({ lineup, gameData: yankeesGame }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching Yankees data:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      lineup: [] // Return empty lineup on error
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});