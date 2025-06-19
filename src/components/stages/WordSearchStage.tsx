
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface WordSearchStageProps {
  onComplete: () => void;
}

const WordSearchStage = ({ onComplete }: WordSearchStageProps) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const gridData = [
    ['C','O','L','L','A','B','O','R','A','T','E','B','P','L','I'],
    ['Z','J','K','M','N','P','Q','A','F','R','V','A','F','U','N'],
    ['W','E','I','M','P','A','C','T','Y','G','H','N','L','R','N'],
    ['X','Y','Z','L','A','U','N','C','H','N','J','G','Y','E','O'],
    ['S','T','R','A','T','E','G','Y','K','L','M','A','E','S','V'],
    ['Q','V','W','X','C','A','D','R','E','A','B','L','R','T','A'],
    ['J','K','G','R','O','W','T','H','P','Q','R','O','N','U','T'],
    ['S','F','T','U','V','W','X','Y','Z','G','H','R','C','V','E'],
    ['V','I','S','I','O','N','A','B','C','D','E','E','H','W','X'],
    ['K','L','M','N','O','P','Q','R','S','T','U','L','I','X','Y'],
    ['A','G','I','L','E','V','W','X','Y','Z','A','E','K','L','Z'],
    ['M','N','I','J','I','K','L','M','N','O','P','A','M','N','A'],
    ['O','P','Q','R','I','S','T','U','V','W','X','R','N','O','B'],
    ['S','T','U','V','M','W','X','Y','Z','A','B','N','O','P','C'],
    ['W','X','Y','Z','B','A','B','C','D','E','F','S','P','Q','D']
  ];

  const wordsToFind = [
    'COLLABORATE', 'IMPACT', 'STRATEGY', 'GROWTH', 'VISION', 'AGILE',
    'INNOVATE', 'FLYER', 'LAUNCH', 'LEARN'
  ];

  const foundWordPositions = new Map();

  useEffect(() => {
    if (foundWords.size === wordsToFind.length) {
      toast({
        title: "🎉 All words found!",
        description: "Advancing to the next stage...",
      });
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [foundWords, onComplete, toast]);

  const getCellIndex = (row: number, col: number) => row * 15 + col;

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([getCellIndex(row, col)]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return;
    
    const cellIndex = getCellIndex(row, col);
    if (selectedCells.includes(cellIndex)) return;

    setSelectedCells(prev => [...prev, cellIndex]);
  };

  const handleMouseUp = () => {
    if (!isSelecting || selectedCells.length === 0) {
      setIsSelecting(false);
      setSelectedCells([]);
      return;
    }

    checkWord();
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const checkWord = () => {
    const selectedChars = selectedCells.map(index => {
      const row = Math.floor(index / 15);
      const col = index % 15;
      return gridData[row][col];
    });

    const word = selectedChars.join('');
    const reverseWord = selectedChars.reverse().join('');

    const foundWord = wordsToFind.find(w => w === word || w === reverseWord);
    
    if (foundWord && !foundWords.has(foundWord)) {
      setFoundWords(prev => new Set([...prev, foundWord]));
      foundWordPositions.set(foundWord, [...selectedCells]);
      toast({
        title: `Found: "${foundWord}"! 🎯`,
        description: `${foundWords.size + 1} of ${wordsToFind.length} words found`,
      });
    } else if (foundWord && foundWords.has(foundWord)) {
      toast({
        title: "Already found!",
        description: "This word has been found already.",
        variant: "destructive",
      });
    }
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.includes(getCellIndex(row, col));
  };

  const isCellFound = (row: number, col: number) => {
    const cellIndex = getCellIndex(row, col);
    return Array.from(foundWordPositions.values()).some(positions => 
      positions.includes(cellIndex)
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <motion.h2
          className="text-3xl font-bold text-ice-purple mb-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Word Search
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border-2 border-ice-blue/30 shadow-lg"
          >
            <div
              ref={gridRef}
              className="grid grid-cols-15 gap-1 select-none"
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                setIsSelecting(false);
                setSelectedCells([]);
              }}
            >
              {gridData.map((row, rowIndex) =>
                row.map((char, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-8 h-8 flex items-center justify-center text-sm font-bold border border-ice-blue/20 cursor-pointer
                      transition-all duration-200 rounded-sm
                      ${isCellSelected(rowIndex, colIndex) 
                        ? 'bg-ice-blue text-white border-ice-blue' 
                        : isCellFound(rowIndex, colIndex)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white hover:bg-ice-blue/10'
                      }
                    `}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  >
                    {char}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border-2 border-ice-blue/30 shadow-lg min-w-[200px]"
          >
            <h3 className="text-xl font-semibold text-ice-purple mb-4 text-center">
              Words to Find
            </h3>
            <div className="space-y-2">
              {wordsToFind.map((word, index) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`
                    text-sm font-medium p-2 rounded transition-all duration-300
                    ${foundWords.has(word) 
                      ? 'text-green-600 bg-green-50 line-through' 
                      : 'text-ice-dark hover:bg-ice-blue/10'
                    }
                  `}
                >
                  {word}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ice-blue/20">
              <div className="text-center text-sm text-ice-dark">
                <span className="font-semibold text-ice-purple">{foundWords.size}</span> of {wordsToFind.length} found
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WordSearchStage;
