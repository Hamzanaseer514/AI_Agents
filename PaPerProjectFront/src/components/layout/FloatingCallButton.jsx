import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingCallButton = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <a href="tel:+447466436417" className="flex items-center px-6 py-3">
          <Phone className="mr-2 h-5 w-5" />
          Call Us
        </a>
      </Button>
    </motion.div>
  );
};

export default FloatingCallButton;