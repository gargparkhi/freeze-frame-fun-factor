
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordSearchStageProps {
  onComplete: () => void;
}

const WordSearchStage = ({ onComplete }: WordSearchStageProps) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  
  const words = ['TEAM', 'WORK', 'PLAY', 'FUN', 'GOAL'];
  const gridSize = 10;
  
  // Generate a simple grid with words placed horizontally and vertically
  const generateGrid = () => {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Place words
    grid[1][1] = 'T'; grid[1][2] = 'E'; grid[1][3] = 'A'; grid[1][4] = 'M';
    grid[2][1] = 'W'; grid[3][1] = 'O'; grid[4][1] = 'R'; grid[5][1] = 'K';
    grid[7][2] = 'P'; grid[7][3] = 'L'; grid[7][4] = 'A'; grid[7][5] = 'Y';
    grid[3][6] = 'F'; grid[4][6] = 'U'; grid[5][6] = 'N';
    grid[8][7] = 'G'; grid[8][8] = 'O'; grid[8][9] = 'A'; grid[9][9] = 'L';
    
    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    return grid;
  };

  const [grid] = useState(generateGrid());

  const handleCellClick = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const newSelected = new Set(selectedCells);
    
    if (newSelected.has(cellKey)) {
      newSelected.delete(cellKey);
    } else {
      newSelected.add(cellKey);
    }
    
    setSelectedCells(newSelected);
  };

  const checkForWords = () => {
    // Simple word checking logic - in a real implementation, this would be more sophisticated
    const newFoundWords = new Set(foundWords);
    
    // Check if TEAM is selected (row 1, cols 1-4)
    if (selectedCells.has('1-1') && selectedCells.has('1-2') && 
        selectedCells.has('1-3') && selectedCells.has('1-4')) {
      newFoundWords.add('TEAM');
    }
    
    setFoundWords(newFoundWords);
    
    if (newFoundWords.size === words.length) {
      setTimeout(onComplete, 1000);
    }
  };

  useEffect(() => {
    checkForWords();
  }, [selectedCells]);

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-ice-blue/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-ice-purple mb-4">
              🔍 Word Hunt
            </CardTitle>
            <p className="text-ice-dark/70">Find all the hidden words in the grid!</p>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Word Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
                  {grid.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-8 h-8 text-sm font-bold border-2 rounded transition-all duration-200 ${
                          selectedCells.has(`${rowIndex}-${colIndex}`)
                            ? 'bg-ice-blue text-white border-ice-blue'
                            : 'bg-white text-ice-dark border-gray-300 hover:border-ice-blue hover:bg-ice-blue/10'
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cell}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
              
              {/* Words List */}
              <div className="lg:w-64">
                <h3 className="text-lg font-semibold text-ice-purple mb-4">Find these words:</h3>
                <div className="space-y-2">
                  {words.map((word) => (
                    <motion.div
                      key={word}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        foundWords.has(word)
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-ice-dark'
                      }`}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: words.indexOf(word) * 0.1 }}
                    >
                      <span className="font-medium">
                        {foundWords.has(word) ? '✅' : '🔍'} {word}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-ice-dark/70 mb-2">
                    Found: {foundWords.size} / {words.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-ice-blue h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(foundWords.size / words.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WordSearchStage;
