
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface HumanBingoStageProps {
  onComplete: () => void;
}

const HumanBingoStage = ({ onComplete }: HumanBingoStageProps) => {
  const [bingoCard, setBingoCard] = useState<{ [key: string]: string }>({});
  const [completedSquares, setCompletedSquares] = useState<Set<string>>(new Set());
  
  const bingoPrompts = [
    "Has traveled to 3+ countries",
    "Speaks 2+ languages", 
    "Has a pet",
    "Plays a musical instrument",
    "Is left-handed",
    "Has run a marathon",
    "Can cook a signature dish",
    "Has been skydiving",
    "Was born in another state",
    "Has met a celebrity",
    "Knows how to juggle",
    "Has more than 2 siblings",
    "Drinks coffee daily",
    "Has a tattoo",
    "Can solve a Rubik's cube",
    "Has worked in customer service",
    "Loves horror movies",
    "Has been to a concert this year",
    "Prefers tea over coffee",
    "Has broken a bone",
    "Can whistle loudly",
    "Has been camping",
    "Knows sign language",
    "Has read 10+ books this year",
    "Plays video games regularly"
  ];

  // Select 24 random prompts (5x5 grid with center FREE)
  const [selectedPrompts] = useState(() => {
    const shuffled = [...bingoPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 24);
  });

  const handleNameInput = (index: number, name: string) => {
    setBingoCard(prev => ({
      ...prev,
      [index]: name
    }));
    
    if (name.trim()) {
      setCompletedSquares(prev => new Set([...prev, index.toString()]));
    } else {
      setCompletedSquares(prev => {
        const newSet = new Set(prev);
        newSet.delete(index.toString());
        return newSet;
      });
    }
  };

  const handleScreenshot = async () => {
    const element = document.getElementById('bingo-card');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = 'human-bingo-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const checkCompletion = () => {
    const totalSquares = 25; // 5x5 grid
    const filledSquares = Object.keys(bingoCard).filter(key => bingoCard[key].trim()).length + 1; // +1 for FREE square
    
    if (filledSquares >= 13) { // More than half filled
      onComplete();
    }
  };

  React.useEffect(() => {
    checkCompletion();
  }, [bingoCard]);

  const renderBingoSquare = (index: number) => {
    if (index === 12) { // Center square (FREE)
      return (
        <motion.div
          className="aspect-square border-2 border-ice-blue bg-green-200 flex flex-col items-center justify-center p-2 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.02 }}
        >
          <div className="font-bold text-green-800 text-lg">FREE</div>
          <div className="text-xs text-green-600">🎉</div>
        </motion.div>
      );
    }
    
    const promptIndex = index > 12 ? index - 1 : index; // Adjust for FREE square
    const prompt = selectedPrompts[promptIndex];
    const isCompleted = completedSquares.has(index.toString());
    
    return (
      <motion.div
        className={`aspect-square border-2 border-ice-blue bg-white flex flex-col p-2 transition-all duration-300 ${
          isCompleted ? 'bg-ice-blue/20 border-ice-blue' : 'hover:border-ice-purple'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.02 }}
      >
        <div className="text-xs font-medium text-ice-dark mb-2 flex-1 overflow-hidden">
          {prompt}
        </div>
        <Input
          value={bingoCard[index] || ''}
          onChange={(e) => handleNameInput(index, e.target.value)}
          placeholder="Name..."
          className="text-xs h-6 p-1 border-gray-300"
        />
      </motion.div>
    );
  };

  return (
    <div className="h-full flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-ice-blue/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-ice-purple mb-4">
              👥 Human Bingo
            </CardTitle>
            <p className="text-ice-dark/70">Find people who match each description!</p>
            <p className="text-sm text-ice-dark/50 mt-2">
              Talk to your teammates and fill in names. Take a screenshot when done!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Bingo Card */}
            <div id="bingo-card" className="bg-white p-4 rounded-lg">
              <h3 className="text-xl font-bold text-center text-ice-purple mb-4">
                Ice Breaker Bingo Card
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 25 }, (_, index) => renderBingoSquare(index))}
              </div>
            </div>
            
            {/* Progress and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-ice-dark/70">
                Completed: {completedSquares.size + 1}/25 squares
                <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                  <motion.div
                    className="bg-ice-blue h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((completedSquares.size + 1) / 25) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleScreenshot}
                  variant="outline"
                  className="border-ice-blue text-ice-blue hover:bg-ice-blue hover:text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Screenshot
                </Button>
                
                <Button
                  onClick={onComplete}
                  disabled={completedSquares.size < 8}
                  className="bg-ice-purple hover:bg-ice-purple/90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Complete & Share
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-ice-dark/50 text-center border-t pt-4">
              💡 Tip: Walk around, meet your teammates, and find someone for each square!
              Don't forget to take a screenshot to share in the main chat.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HumanBingoStage;
