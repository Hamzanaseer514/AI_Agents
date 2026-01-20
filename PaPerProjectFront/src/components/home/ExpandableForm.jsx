import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Link, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ExpandableForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0 && !isExpanded) {
      setIsExpanded(true);
    } else if (e.target.value.length === 0 && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚀 Project Submitted!",
      description: "Well, not really! This is just a demo. But in a real scenario, we'd be matching you with a team right now!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full transition-all duration-500">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter project title or URL to start..."
          value={inputValue}
          onChange={handleInputChange}
          className="h-14 pl-5 pr-40 text-base rounded-full shadow-lg focus:ring-2 focus:ring-primary/50"
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Button type="submit" size="lg" className="rounded-full font-bold">
            Match Me <span className="hidden sm:inline ml-1">in 24 Hours</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80"
          >
            <p className="text-sm font-medium text-slate-600 mb-4 text-left">
              Provide more details for a more accurate quote (optional):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full h-12 justify-start text-slate-500">
                <Link className="mr-2 h-4 w-4" />
                Add a link to a brief
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start text-slate-500">
                <Upload className="mr-2 h-4 w-4" />
                Upload a file
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default ExpandableForm;