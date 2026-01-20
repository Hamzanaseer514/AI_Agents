import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, ShieldCheck, Users, Briefcase } from 'lucide-react';

const ResultsTeamSection = () => {
    const comparisonPoints = [
        { text: "Fully managed by a dedicated Project Manager" },
        { text: "Proactive quality assurance and testing" },
        { text: "Seamless onboarding and integration" },
        { text: "Accountable for deadlines and results" },
        { text: "Access to a multi-disciplinary team" },
        { text: "Zero platform fees or hidden costs" },
        { text: "100% Project Success Guarantee" },
    ];

    return (
        <section className="py-20 md:py-28 bg-secondary/40">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading">
                        Hire Results, Not Resumes
                    </h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
                        Our "Results Teams" are managed squads of top-tier talent who are accountable for one thing: delivering your project, perfectly. Here's how they differ.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card className="p-8 rounded-2xl border-rose-500/30 bg-card h-full shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-rose-100 p-3 rounded-full">
                                    <Users className="h-8 w-8 text-rose-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground font-heading">Freelancers</h3>
                            </div>
                            <ul className="space-y-4">
                                {comparisonPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <X className="h-5 w-5 text-rose-500 mt-1 flex-shrink-0" />
                                        <span>{point.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <Card className="p-8 rounded-2xl border-primary/50 bg-gradient-to-br from-primary/10 to-transparent h-full shadow-2xl scale-105">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-primary/20 p-3 rounded-full">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary font-heading">Our Results Teams</h3>
                            </div>
                            <ul className="space-y-4">
                                {comparisonPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-foreground">
                                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span className="font-medium">{point.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card className="p-8 rounded-2xl border-amber-500/30 bg-card h-full shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <Briefcase className="h-8 w-8 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground font-heading">Agencies</h3>
                            </div>
                            <ul className="space-y-4">
                                {comparisonPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        {i === 1 || i === 3 || i === 4 ? (
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        ) : (
                                            <X className="h-5 w-5 text-rose-500 mt-1 flex-shrink-0" />
                                        )}
                                        <span>{point.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ResultsTeamSection;