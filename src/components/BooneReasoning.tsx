import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import aaronBooneImg from "@/assets/aaron-boone.jpg";

interface BooneReasoningProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  reasoning: string;
  situation: string;
}

export const BooneReasoning = ({ isOpen, onClose, playerName, reasoning, situation }: BooneReasoningProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <img 
              src={aaronBooneImg} 
              alt="Aaron Boone" 
              className="h-16 w-16 rounded-full border-2 border-yankees-navy"
            />
            <div>
              <DialogTitle className="text-xl">Aaron Boone Explains</DialogTitle>
              <Badge variant="secondary" className="mt-1">
                {situation}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-yankees-navy">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-yankees-navy mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-2">
                  Re: {playerName}
                </p>
                <p className="text-foreground/90 leading-relaxed italic">
                  "{reasoning}"
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            * This is a satirical interpretation of potential reasoning based on common baseball management patterns *
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};