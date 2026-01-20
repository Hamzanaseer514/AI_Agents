
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Briefcase, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const benefits = [
    {
        icon: Briefcase,
        title: "Access High-Value Projects",
        description: "Get exclusive access to a curated pipeline of high-value projects from serious clients."
    },
    {
        icon: Zap,
        title: "Streamlined Process",
        description: "Our platform handles the client management, so you can focus purely on execution and delivery."
    },
    {
        icon: ShieldCheck,
        title: "Guaranteed Payments",
        description: "Work with confidence knowing that payments are secured and guaranteed upon project completion."
    }
];

const ApplyForProjectsPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "✅ Application Submitted!",
            description: "Thank you! We've received your application and will be in touch shortly if it's a match.",
        });
        e.target.reset();
    };

    return (
        <>
            <Helmet>
                <title>Apply for Projects | Pay Per Project</title>
                <meta name="description" content="Join our exclusive network of premium partners and get access to high-value, pre-vetted projects. Apply now to start delivering exceptional work." />
            </Helmet>

            <div className="bg-background text-foreground">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 sm:pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Crown className="mx-auto h-12 w-12 text-primary" />
                            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl font-heading">
                                Partner with Us. Build the Future.
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                                This is your exclusive gateway to apply for pre-vetted, high-value projects. For our premium partners only.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Benefits Section */}
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">The Premium Partner Advantage</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Card className="h-full bg-card border shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 rounded-2xl p-8 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                            <benefit.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                        <p className="text-muted-foreground">{benefit.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                         <div className="text-center mt-12">
                            <Button asChild size="lg">
                                <Link to="/pricing">
                                    Become a Premium Partner <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Application Form Section */}
                <section id="application-form" className="py-16 sm:py-20 bg-secondary/40">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true }}
                             transition={{ duration: 0.5 }}
                        >
                            <Card className="shadow-2xl rounded-2xl">
                                <CardHeader className="text-center p-8">
                                    <CardTitle className="text-3xl font-heading">Apply for a Project</CardTitle>
                                    <CardDescription>
                                        Fill out the form below. Our partnerships team will review your application.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input id="companyName" placeholder="Your Company Inc." required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contactName">Contact Name</Label>
                                                <Input id="contactName" placeholder="Jane Doe" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="jane.doe@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="projectId">Project ID or Name (if known)</Label>
                                            <Input id="projectId" placeholder="e.g., Project-12345 or AI Chatbot for E-commerce" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expertise">Primary Area of Expertise</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your specialty..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                                                    <SelectItem value="web-dev">Web Development</SelectItem>
                                                    <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                                                    <SelectItem value="devops">DevOps & Cloud</SelectItem>
                                                    <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                                                    <SelectItem value="game-dev">Game Development</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="proposal">Why are you a great fit for this project?</Label>
                                            <Textarea id="proposal" placeholder="Briefly outline your relevant experience and approach (max 500 characters)." maxLength="500" rows="4" required />
                                        </div>
                                        <CardFooter className="p-0 pt-6">
                                            <Button type="submit" className="w-full" size="lg">Submit Application</Button>
                                        </CardFooter>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ApplyForProjectsPage;
