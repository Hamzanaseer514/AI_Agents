import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, ShieldCheck, Users, ClipboardCheck, BarChart, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

const CompanyPitch = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const pitchFeatures = [
    {
      icon: ShieldCheck,
      title: t('company_pitch_feature1_title'),
      description: t('company_pitch_feature1_desc'),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Users,
      title: t('company_pitch_feature2_title'),
      description: t('company_pitch_feature2_desc'),
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: ClipboardCheck,
      title: t('company_pitch_feature3_title'),
      description: t('company_pitch_feature3_desc'),
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: BarChart,
      title: t('company_pitch_feature4_title'),
      description: t('company_pitch_feature4_desc'),
      color: 'text-primary',
      bg: 'bg-primary/10',
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-primary/10 text-primary font-semibold py-1 px-3 rounded-full text-sm mb-4">
                Execution as a Service™
              </div>
              <h2 className="text-4xl font-bold text-foreground font-heading">Idea? Upload It. We’ll Scope It.</h2>
              <p className="text-lg text-muted-foreground mt-4">
                {t('company_pitch_desc')}
              </p>
            </div>
            
            <div className="space-y-6">
              {pitchFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${feature.bg} ${feature.color} rounded-lg p-3`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button onClick={() => toast({ title: "Let's find your match! Start by submitting your project above. 🚀" })} size="lg">
                {t('company_pitch_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Card className="relative group w-full overflow-hidden card-border-glow">
                <img class="w-full rounded-xl shadow-xl" alt="A thumbnail showing a professional team presenting project work on a screen" src="https://images.unsplash.com/photo-1665659964378-cbccc8a6d429" />
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => toast({ title: "🚧 Feature coming soon!", description: "You'll soon be able to watch sample intros from our top companies." })}>
                    <PlayCircle className="h-20 w-20 text-white drop-shadow-lg" />
                </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyPitch;