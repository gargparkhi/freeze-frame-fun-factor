
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LinkedInGameStageProps {
  onComplete: () => void;
}

const LinkedInGameStage = ({ onComplete }: LinkedInGameStageProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
  
  // Based on your uploaded image
  const items = [
    'COLLEAGUE', 'ASSOCIATE', 'FELLOW', 'PARTNER', 'PEER',
    'HALL', 'LIBRARY', 'LOUNGE', 'STUDY',
    'BUNNY', 'EGG', 'JELLY BEAN', 'PEEP',
    'ANIMAL', 'BIRTHMARK', 'SPY', 'UNIT'
  ];

  const groups = {
    'COLLEAGUE': ['COLLEAGUE', 'ASSOCIATE', 'FELLOW', 'PARTNER', 'PEER'],
    'ROOMS IN THE GAME CLUE': ['HALL', 'LIBRARY', 'LOUNGE', 'STUDY'],
    'SEEN DURING EASTER': ['BUNNY', 'EGG', 'JELLY BEAN', 'PEEP'],
    'WHAT A MOLE CAN BE': ['ANIMAL', 'BIRTHMARK', 'SPY', 'UNIT']
  };

  const colors = {
    'COLLEAGUE': 'bg-green-400',
    'ROOMS IN THE GAME CLUE': 'bg-yellow-400',
    'SEEN DURING EASTER': 'bg-purple-400',
    'WHAT A MOLE CAN BE': 'bg-pink-400'
  };

  const handleItemClick = (item: string) => {
    if (solvedGroups.some(group => groups[group as keyof typeof groups].includes(item))) {
      return; // Item already solved
    }
    
    let newSelected = [...selectedItems];
    
    if (newSelected.includes(item)) {
      newSelected = newSelected.filter(i => i !== item);
    } else if (newSelected.length < 4) {
      newSelected.push(item);
    }
    
    setSelectedItems(newSelected);
  };

  const handleSubmit = () => {
    if (selectedItems.length !== 4) return;
    
    // Check if selection matches any group
    const matchedGroup = Object.keys(groups).find(groupName => {
      const groupItems = groups[groupName as keyof typeof groups];
      return selectedItems.every(item => groupItems.includes(item)) && 
             selectedItems.length === groupItems.length;
    });
    
    if (matchedGroup) {
      setSolvedGroups([...solvedGroups, matchedGroup]);
      setSelectedItems([]);
      
      if (solvedGroups.length + 1 === Object.keys(groups).length) {
        setTimeout(onComplete, 1500);
      }
    } else {
      setAttempts(attempts + 1);
      setSelectedItems([]);
    }
  };

  const getItemDisplay = (item: string) => {
    const solvedGroup = solvedGroups.find(group => 
      groups[group as keyof typeof groups].includes(item)
    );
    
    if (solvedGroup) {
      return (
        <motion.div
          className={`p-3 rounded-lg text-center font-medium text-white ${colors[solvedGroup as keyof typeof colors]}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {item}
        </motion.div>
      );
    }
    
    return (
      <motion.button
        className={`p-3 rounded-lg text-center font-medium border-2 transition-all duration-200 ${
          selectedItems.includes(item)
            ? 'bg-ice-blue text-white border-ice-blue'
            : 'bg-white text-ice-dark border-gray-300 hover:border-ice-blue hover:bg-ice-blue/10'
        }`}
        onClick={() => handleItemClick(item)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {item}
      </motion.button>
    );
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-ice-blue/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-ice-purple mb-4">
              🎯 Group Builder
            </CardTitle>
            <p className="text-ice-dark/70">Create four groups of four!</p>
            <p className="text-sm text-ice-dark/50 mt-2">
              Find groups of 4 items that share something in common
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Solved groups display */}
            {solvedGroups.map((groupName) => (
              <motion.div
                key={groupName}
                className={`p-4 rounded-lg ${colors[groupName as keyof typeof colors]} text-white text-center`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="font-bold text-lg mb-2">{groupName}</div>
                <div className="text-sm opacity-90">
                  {groups[groupName as keyof typeof groups].join(', ')}
                </div>
              </motion.div>
            ))}
            
            {/* Items grid */}
            <div className="grid grid-cols-4 gap-3">
              {items
                .filter(item => !solvedGroups.some(group => 
                  groups[group as keyof typeof groups].includes(item)
                ))
                .map((item) => (
                  <div key={item}>
                    {getItemDisplay(item)}
                  </div>
                ))}
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-ice-dark/70">
                Mistakes: {attempts}/4 | Selected: {selectedItems.length}/4
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItems([])}
                  disabled={selectedItems.length === 0}
                  className="border-ice-blue text-ice-blue hover:bg-ice-blue hover:text-white"
                >
                  Clear
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={selectedItems.length !== 4}
                  className="bg-ice-purple hover:bg-ice-purple/90 text-white"
                >
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LinkedInGameStage;
