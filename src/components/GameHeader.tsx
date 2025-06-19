
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface GameHeaderProps {
  currentStage: number;
  totalStages: number;
  stageName: string;
  completedStages: boolean[];
}

const GameHeader = ({ currentStage, totalStages, stageName, completedStages }: GameHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-ice-blue/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-ice-dark">Ice Breaker Challenge</h1>
          <div className="text-sm text-ice-dark/70">
            Stage {currentStage + 1} of {totalStages}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-lg font-semibold text-ice-purple">{stageName}</h2>
        </div>
        
        {/* Progress indicator */}
        <div className="flex gap-2">
          {Array.from({ length: totalStages }, (_, index) => (
            <motion.div
              key={index}
              className={`h-2 flex-1 rounded-full relative overflow-hidden ${
                index <= currentStage ? 'bg-ice-blue/20' : 'bg-gray-200'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`h-full rounded-full ${
                  completedStages[index]
                    ? 'bg-green-500'
                    : index === currentStage
                    ? 'bg-ice-blue'
                    : 'bg-transparent'
                }`}
                initial={{ width: 0 }}
                animate={{ 
                  width: completedStages[index] 
                    ? '100%' 
                    : index === currentStage 
                    ? '50%' 
                    : '0%' 
                }}
                transition={{ duration: 0.5 }}
              />
              {completedStages[index] && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
