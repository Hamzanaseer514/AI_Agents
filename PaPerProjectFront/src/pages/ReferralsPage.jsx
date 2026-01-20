import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Share2, ClipboardCopy, Star, TrendingUp, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

const ReferralsPage = () => {
    const { toast } = useToast();
    const referralLink = "https://your.link/ref/123XYZ";

    const rewardTiers = [
        {
            icon: Star,
            title: "1st Referral: 15% Cashback",
            description: "Refer one client who starts a project, and you'll receive 15% of their project value back in cash or service credits."
        },
        {
            icon: TrendingUp,
            title: "2nd Referral: 25% Cashback",
            description: "Bring in a second client, and your reward jumps to an incredible 25% of their project value. The more you share, the more you earn."
        },
        {
            icon: Gift,
            title: "Bonus: Free Project Scope",
            description: "Successfully refer 2-3 clients and we'll give you a free, in-depth project scope for your next big idea (a £5000 value)."
        }
    ];

    const influencerPerks = [
        {
            icon: Video,
            title: "Co-Branded Content",
            description: "We'll collaborate on high-quality content (videos, articles) for your audience, positioning you as a tech thought leader."
        },
        {
            icon: Share2,
            title: "Custom Landing Pages",
            description: "Get a personalized landing page for your audience to ensure higher conversion rates and a seamless user experience."
        },
        {
            icon: TrendingUp,
            title: "Revenue Share + Equity",
            description: "We offer a competitive revenue share on all projects you bring in, with opportunities for equity partnerships for top performers."
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "Copied to Clipboard!",
            description: "Your referral link is ready to be shared.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Refer & Earn | Influencer Program</title>
                <meta name="description" content="Share our platform and earn up to 25% cashback. We also offer exclusive partnership opportunities for influencers." />
            </Helmet>
            <div className="bg-background text-foreground">
                <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 sm:pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Gift className="mx-auto h-12 w-12 text-primary" />
                            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl font-heading">
                                Your Network is Your Net Worth
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                                Earn significant rewards by introducing your network to the future of project delivery. We have tailored programs for both individuals and influencers.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Generous Rewards for Every Referral</h2>
                            <p className="mt-4 text-lg text-muted-foreground">We believe in sharing our success. Our tiered reward system is simple and lucrative.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {rewardTiers.map((tier, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Card className="h-full bg-card border shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 rounded-2xl p-8 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                            <tier.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{tier.title}</h3>
                                        <p className="text-muted-foreground">{tier.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 bg-secondary/40">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <Card className="shadow-2xl rounded-2xl p-6 md:p-8 bg-card">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl font-bold">Your Referral Dashboard</CardTitle>
                                <CardDescription>Start sharing your unique link to unlock your rewards.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4">
                                    <label htmlFor="referral-link" className="font-semibold text-muted-foreground">Your Unique Link</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input id="referral-link" readOnly value={referralLink} className="bg-secondary/40" />
                                        <Button onClick={handleCopy} variant="outline" size="icon">
                                            <ClipboardCopy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                                    <div className="p-4 bg-secondary/40 rounded-lg">
                                        <p className="text-3xl font-bold text-gradient">0</p>
                                        <p className="text-sm text-muted-foreground">Successful Referrals</p>
                                    </div>
                                    <div className="p-4 bg-secondary/40 rounded-lg">
                                        <p className="text-3xl font-bold text-gradient">£0</p>
                                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="influencers" className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Are You an Influencer? Let's Partner Up.</h2>
                                <p className="mt-4 text-lg text-muted-foreground">
                                    We're looking for creators and thought leaders in the tech, startup, and business spaces to form meaningful partnerships. This is more than an affiliate program; it's a collaboration.
                                </p>
                                <div className="mt-8 space-y-6">
                                    {influencerPerks.map((perk, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <perk.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{perk.title}</h4>
                                                <p className="text-muted-foreground">{perk.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10">
                                    <Button asChild size="lg">
                                        <Link to="/contact?subject=InfluencerPartnership">
                                            Apply for Partnership <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="h-96 lg:h-auto"
                            >
                                <img alt="Influencer collaborating with a tech brand" class="w-full h-full object-cover rounded-2xl shadow-2xl" src="https://images.unsplash.com/photo-1655127282965-049dce345765" />
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ReferralsPage;