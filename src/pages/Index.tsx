import { LineupAnalyzer } from "@/components/LineupAnalyzer";
import yankeesBackground from "@/assets/yankees-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${yankeesBackground})` }}
      >
        <div className="absolute inset-0 bg-yankees-navy/80" />
        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            BOONE'S BRAIN
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Understanding the Incomprehensible
          </p>
          <div className="mt-4 text-sm text-white/70">
            A satirical look at Yankees lineup decisions
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <LineupAnalyzer />
      </div>

      {/* Footer */}
      <footer className="border-t border-yankees-silver/20 bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            This is a parody app created for entertainment purposes. 
            Player stats and reasoning are satirical interpretations.
          </p>
          <p className="mt-2">
            Made with ❤️ for frustrated Yankees fans everywhere
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;