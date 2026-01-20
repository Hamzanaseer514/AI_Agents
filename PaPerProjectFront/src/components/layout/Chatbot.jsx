import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSend = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Feature Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
    e.target.reset();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-16 h-16"
                onClick={() => setIsOpen(true)}
              >
                <MessageSquare className="h-8 w-8" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[600px] bg-card border rounded-2xl shadow-2xl flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">AI Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">AI</div>
                    <div className="flex flex-col gap-1 w-full max-w-[320px]">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-foreground">AI Assistant</span>
                            <span className="text-xs font-normal text-muted-foreground">11:45</span>
                        </div>
                        <div className="leading-1.5 p-4 border-gray-200 bg-secondary rounded-e-xl rounded-es-xl">
                            <p className="text-sm font-normal text-foreground">Hello! How can I help you today?</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <footer className="p-4 border-t">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <Input placeholder="Type your message..." className="flex-grow" />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;