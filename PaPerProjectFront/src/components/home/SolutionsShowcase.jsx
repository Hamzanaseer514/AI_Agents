import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, SlidersHorizontal, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SolutionsShowcase = () => {
    const { t } = useTranslation();

    const solutions = [
        {
            icon: Bot,
            title: "AI & N8N Automations",
            description: "Deploy intelligent agents and workflows to automate repetitive tasks and supercharge your productivity.",
            link: "/solutions/ai-automations",
            color: "text-blue-400"
        },
        {
            icon: Settings2,
            title: "IT Consulting Solutions",
            description: "Get expert guidance on your technology stack, security posture, and digital transformation strategy.",
            link: "/solutions/it-consulting-solutions",
            color: "text-green-400"
        },
        {
            icon: SlidersHorizontal,
            title: "White Label Products",
            description: "Leverage our pre-built, battle-tested software solutions under your own brand, saving you months of dev time.",
            link: "/white-label-products",
            color: "text-purple-400"
        }
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    return (
        <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground font-heading">More Than Just Project Delivery</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        We offer a full suite of services to help you build, grow, and optimize your business.
                    </p>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {solutions.map((solution) => (
                        <motion.div key={solution.title} variants={itemVariants} className="flex">
                            <Card className="flex flex-col w-full bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-xl card-border-glow">
                                <CardHeader className="flex-grow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`bg-primary/10 p-3 rounded-lg ${solution.color}`}>
                                            <solution.icon className="h-7 w-7" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-foreground">{solution.title}</CardTitle>
                                    </div>
                                    <CardContent className="p-0">
                                      <p className="text-muted-foreground">{solution.description}</p>
                                    </CardContent>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link to={solution.link}>
                                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default SolutionsShowcase;