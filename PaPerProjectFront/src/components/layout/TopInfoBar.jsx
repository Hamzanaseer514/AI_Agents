import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, BadgePoundSterling, Gift, Briefcase, Rocket, UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const TopInfoBar = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();

    const infoItems = [
      {
        icon: Rocket,
        text: t('top_bar_startups', 'For Startups'),
        link: '/startups',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        toast: {
          title: t('top_bar_startups_toast_title', "🚀 Powering Innovation"),
          description: t('top_bar_startups_toast_desc', "Special programs and pricing for startups. Let's build the next big thing together!"),
        }
      },
      {
        icon: BadgePoundSterling,
        text: t('top_bar_cost', 'Value & Pricing'),
        link: '/value-and-pricing',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        toast: {
          title: t('top_bar_cost_toast_title', "💰 Unbeatable Value"),
          description: t('top_bar_cost_toast_desc', "Our managed model provides top-tier talent at rates lower than traditional freelancers. See how we provide more for less!"),
        }
      },
      {
        icon: Cpu,
        text: t('top_bar_ai_driven', '78% Projects are AI Driven'),
        link: '/agentic-ai-models',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        toast: {
          title: t('top_bar_ai_driven_toast_title', "🤖 The AI Revolution"),
          description: t('top_bar_ai_driven_toast_desc', "Discover how our Agentic AI models are transforming industries and delivering unparalleled results."),
        }
      },
      {
        icon: UserPlus,
        text: 'Build Employees',
        link: '/start-project',
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        toast: {
          title: "🤖 Build Your AI Workforce",
          description: "Create autonomous AI agents to handle tasks and drive growth. Let's build your digital employees!",
        }
      },
      {
        icon: Gift,
        text: t('top_bar_referrals', 'Refer & Earn'),
        link: '/referrals',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        toast: {
          title: t('top_bar_referrals_toast_title', "🎉 Refer & Earn!"),
          description: t('top_bar_referrals_toast_desc', "Love our service? Share it with your network and earn significant rewards. Check out our referral program!"),
        }
      },
      {
        icon: Briefcase,
        text: t('top_bar_careers', 'Apply for Jobs'),
        link: '/careers/apply',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        toast: {
          title: t('top_bar_careers_toast_title', "🚀 Join Our Team!"),
          description: t('top_bar_careers_toast_desc', "Looking for your next big challenge? Explore our open positions and become part of our elite global talent network!"),
        }
      }
    ];

  const handleClick = (e, item) => {
    toast(item.toast);
    if (item.link.startsWith('/#')) {
      e.preventDefault();
      const id = item.link.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
        e.preventDefault();
        navigate(item.link);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      className="bg-card border-b border-border hidden md:block"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-border">
          {infoItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              onClick={(e) => handleClick(e, item)}
              className="group bg-card hover:bg-secondary/50 transition-colors duration-300"
            >
              <div className="flex items-center justify-center text-center p-3 gap-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${item.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopInfoBar;