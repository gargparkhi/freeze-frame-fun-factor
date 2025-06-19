
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface RiddleStageProps {
  onComplete: () => void;
}

const RiddleStage = ({ onComplete }: RiddleStageProps) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const riddle = {
    text: "I am not a bird, yet I help you soar,\nFrom shopfloor tasks to strategic core.\nI don't give wings, but I shift your view,\nFrom technical depth to business too.\nYou started with tools, now you lead with insight,\nEvolution each day, taking bold flight.\nA first-line spark, with a curious mind,\nWhat program am I — for the driven, the kind?",
    correctAnswer: "flyer"
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Please enter an answer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    if (answer.toLowerCase().trim() === riddle.correctAnswer) {
      toast({
        title: "Correct! 🎉",
        description: "Advancing to the next challenge...",
      });
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      toast({
        title: "❌ Incorrect!",
        description: "Try again.",
        variant: "destructive",
      });
      setAnswer('');
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center"
      >
        <motion.h2
          className="text-3xl font-bold text-ice-purple mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Solve the Riddle
        </motion.h2>
        
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-lg p-8 mb-8 border-2 border-ice-blue/30 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-lg text-ice-dark leading-relaxed italic whitespace-pre-line">
            {riddle.text}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the program name..."
            className="w-full max-w-md text-lg py-3 px-4 border-2 border-ice-blue/50 focus:border-ice-blue focus:ring-ice-blue/20"
            disabled={isSubmitting}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="bg-ice-blue hover:bg-ice-blue/90 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            size="lg"
          >
            {isSubmitting ? "Checking..." : "Submit Answer"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RiddleStage;
