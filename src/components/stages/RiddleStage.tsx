
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiddleStageProps {
  onComplete: () => void;
}

const RiddleStage = ({ onComplete }: RiddleStageProps) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const riddle = {
    question: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
    answer: "echo",
    hint: "Think about sounds that bounce back to you..."
  };

  const handleSubmit = () => {
    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = riddle.answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setAnswer('');
      }, 2000);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-ice-blue/20">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-ice-purple mb-4">
              🧩 Riddle Challenge
            </CardTitle>
            <p className="text-ice-dark/70">Solve this riddle to continue your journey!</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div
              className="bg-ice-blue/10 p-6 rounded-lg border-l-4 border-ice-blue"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg text-ice-dark leading-relaxed">
                {riddle.question}
              </p>
            </motion.div>
            
            <motion.div
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className={`text-lg p-4 border-2 transition-all duration-300 ${
                  isCorrect === true
                    ? 'border-green-500 bg-green-50'
                    : isCorrect === false
                    ? 'border-ice-coral bg-red-50'
                    : 'border-ice-blue/30 focus:border-ice-blue'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim() || isCorrect === true}
                className="w-full bg-ice-purple hover:bg-ice-purple/90 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isCorrect === true ? '✅ Correct!' : 'Submit Answer'}
              </Button>
            </motion.div>
            
            {isCorrect === false && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ice-coral/10 border border-ice-coral/20 rounded-lg p-4 text-center"
              >
                <p className="text-ice-coral font-medium mb-2">Not quite right! 🤔</p>
                <p className="text-sm text-ice-dark/70">Hint: {riddle.hint}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RiddleStage;
