
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LinkedInGameStageProps {
  onComplete: () => void;
}

const LinkedInGameStage = ({ onComplete }: LinkedInGameStageProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<Array<{category: string, words: string[]}>>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [wrongSelection, setWrongSelection] = useState<string[]>([]);
  const { toast } = useToast();

  const categories = {
    "Roles you'll transition to": ["Sales & Customer Interface", "Procurement & Supply Chain", "Analytics & Strategic Planning", "Manufacturing Excellence & Project Management"],
    "FLYER Elements": ["Development", "IIM Bangalore", "Growth Opportunities", "Leadership Access"],
    "Places to explore at IIM B": ["Mustard Cafe", "Library", "Jigani Campus", "Forest trail"],
    "RIL industry bandwidth": ["Only Vimal", "Spice Trading", "Refinery", "Telecom"]
  };

  useEffect(() => {
    const allWords = Object.values(categories).flat();
    setAvailableWords(allWords.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (foundGroups.length === Object.keys(categories).length) {
      toast({
        title: "🎉 All connections found!",
        description: "Advancing to the final stage...",
      });
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  }, [foundGroups, onComplete, toast]);

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word]);
    } else {
      toast({
        title: "Maximum selection reached",
        description: "You can only select 4 words at a time.",
        variant: "destructive",
      });
    }
  };

  const validateSelection = () => {
    if (selectedWords.length !== 4) return;

    for (const [category, words] of Object.entries(categories)) {
      const isMatch = selectedWords.every(word => words.includes(word)) && 
                      words.every(word => selectedWords.includes(word));
      
      if (isMatch) {
        const newGroup = { category, words: selectedWords };
        setFoundGroups([...foundGroups, newGroup]);
        setAvailableWords(availableWords.filter(word => !selectedWords.includes(word)));
        setSelectedWords([]);
        
        toast({
          title: `Correct! 🎯`,
          description: `Found: "${category}"`,
        });
        return;
      }
    }

    // Wrong selection
    setWrongSelection([...selectedWords]);
    setTimeout(() => {
      setWrongSelection([]);
      setSelectedWords([]);
    }, 600);
    
    toast({
      title: "Incorrect group",
      description: "Try again!",
      variant: "destructive",
    });
  };

  const clearSelection = () => {
    setSelectedWords([]);
  };

  useEffect(() => {
    if (selectedWords.length === 4) {
      validateSelection();
    }
  }, [selectedWords]);

  const getWordColor = (word: string) => {
    if (wrongSelection.includes(word)) return 'border-ice-coral bg-ice-coral/20 text-ice-coral';
    if (selectedWords.includes(word)) return 'border-ice-purple bg-ice-purple text-white';
    return 'border-ice-blue/30 bg-white hover:bg-ice-blue/10 text-ice-dark';
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <motion.h2
          className="text-3xl font-bold text-ice-purple mb-8 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Flyer Connections
        </motion.h2>

        <div className="space-y-6">
          {/* Found Groups */}
          <AnimatePresence>
            {foundGroups.map((group, index) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gradient-to-r from-ice-blue/20 to-ice-purple/20 rounded-lg p-4 border-2 border-ice-blue/30"
              >
                <h3 className="text-lg font-semibold text-ice-purple mb-3 text-center">
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {group.words.map((word) => (
                    <div
                      key={word}
                      className="bg-ice-blue text-white p-3 rounded text-center text-sm font-medium"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Available Words Grid */}
          {availableWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border-2 border-ice-blue/30 shadow-lg"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {availableWords.map((word, index) => (
                  <motion.button
                    key={word}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleWordClick(word)}
                    className={`
                      p-4 border-2 rounded-lg font-semibold text-sm transition-all duration-300
                      transform hover:scale-105 cursor-pointer min-h-[80px] flex items-center justify-center text-center
                      ${getWordColor(word)}
                      ${wrongSelection.includes(word) ? 'animate-pulse' : ''}
                    `}
                  >
                    {word}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={clearSelection}
                  disabled={selectedWords.length === 0}
                  variant="outline"
                  className="border-ice-blue text-ice-blue hover:bg-ice-blue/10"
                >
                  Clear Selection ({selectedWords.length})
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LinkedInGameStage;
