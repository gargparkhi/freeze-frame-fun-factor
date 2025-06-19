
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HumanBingoStageProps {
  onComplete: () => void;
}

const HumanBingoStage = ({ onComplete }: HumanBingoStageProps) => {
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const prompts = [
    { id: 'p1', text: 'Owns a pet' },
    { id: 'p2', text: 'Goes to gym daily' },
    { id: 'p3', text: 'Read more than 10 books in the last year' },
    { id: 'p4', text: 'Has snacks stashed in their desk' },
    { id: 'p5', text: 'Drinks more than 2 cups of coffee a day' },
    { id: 'p6', text: 'Is interested in transitioning into customer facing role' },
    { id: 'p7', text: 'Listened to music while working' },
    { id: 'p8', text: 'Have travelled solo / dream destination' },
    { id: 'p9', text: 'Is excited about the IIM Bangalore program' }
  ];

  const handleInputChange = (promptId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [promptId]: value
    }));
  };

  const takeScreenshot = () => {
    toast({
      title: "📸 Ready for screenshot!",
      description: "Take a screenshot now and share it in the main chat!",
    });
    onComplete();
  };

  const filledPrompts = Object.values(responses).filter(response => response.trim()).length;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <motion.h2
          className="text-3xl font-bold text-ice-purple mb-4 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Human Bingo
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-ice-dark mb-8 text-lg"
        >
          Match these prompts with team member names. Talk amongst yourselves!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm border-2 border-ice-blue/30 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <p className="text-ice-purple font-semibold mb-4 text-sm leading-relaxed">
                {prompt.text}
              </p>
              <Input
                type="text"
                value={responses[prompt.id] || ''}
                onChange={(e) => handleInputChange(prompt.id, e.target.value)}
                placeholder="Enter name..."
                className="w-full border-ice-blue/50 focus:border-ice-blue focus:ring-ice-blue/20"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center space-y-4"
        >
          <div className="bg-ice-blue/10 rounded-lg p-4 border-2 border-ice-blue/30">
            <p className="text-ice-dark mb-2">
              <span className="font-semibold text-ice-purple">{filledPrompts}</span> of {prompts.length} prompts filled
            </p>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-ice-blue to-ice-purple"
                initial={{ width: 0 }}
                animate={{ width: `${(filledPrompts / prompts.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <Button
            onClick={takeScreenshot}
            className="bg-ice-coral hover:bg-ice-coral/90 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Screenshot & Share
          </Button>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-ice-dark text-sm italic"
          >
            When you're done, take a screenshot and share it in the main chat!
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HumanBingoStage;
