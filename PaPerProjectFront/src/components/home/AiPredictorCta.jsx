import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AiPredictorCta = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-gradient-to-br from-secondary to-background rounded-2xl p-8 md:p-12 text-center shadow-2xl border overflow-hidden"
                >
                    <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <BrainCircuit className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading text-foreground">
                            Will Your Project Succeed?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our AI Predictor analyzes your project's scope, budget, and timeline to calculate its probability of success. Get an instant, data-driven analysis for free.
                        </p>
                        <div className="mt-8">
                            <Button asChild size="lg">
                                <Link to="/ai-predictor">
                                    Analyze Your Project Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AiPredictorCta;