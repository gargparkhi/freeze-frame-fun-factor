
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RiddleStage from '../components/stages/RiddleStage';
import WordSearchStage from '../components/stages/WordSearchStage';
import LinkedInGameStage from '../components/stages/LinkedInGameStage';
import HumanBingoStage from '../components/stages/HumanBingoStage';
import Celebration from '../components/Celebration';
import GameHeader from '../components/GameHeader';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedStages, setCompletedStages] = useState<boolean[]>([false, false, false, false]);
  const { toast } = useToast();

  const stages = [
    { title: "Riddle Challenge", component: RiddleStage },
    { title: "Word Hunt", component: WordSearchStage },
    { title: "Group Builder", component: LinkedInGameStage },
    { title: "Human Bingo", component: HumanBingoStage }
  ];

  const handleStageComplete = () => {
    const newCompletedStages = [...completedStages];
    newCompletedStages[currentStage] = true;
    setCompletedStages(newCompletedStages);
    
    setShowCelebration(true);
    
    toast({
      title: "Stage Complete! 🎉",
      description: `Amazing work on ${stages[currentStage].title}!`,
    });

    setTimeout(() => {
      setShowCelebration(false);
      if (currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1);
      } else {
        toast({
          title: "Game Complete! 🏆",
          description: "Congratulations on completing all stages!",
        });
      }
    }, 3000);
  };

  const CurrentStageComponent = stages[currentStage].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ice-blue via-white to-ice-purple overflow-hidden">
      <div className="h-screen flex flex-col">
        <GameHeader 
          currentStage={currentStage} 
          totalStages={stages.length}
          stageName={stages[currentStage].title}
          completedStages={completedStages}
        />
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-full max-h-[calc(100vh-120px)]">
            <AnimatePresence mode="wait">
              {!showCelebration ? (
                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <CurrentStageComponent onComplete={handleStageComplete} />
                </motion.div>
              ) : (
                <Celebration stageName={stages[currentStage].title} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
