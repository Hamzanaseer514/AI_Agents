import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, CheckCircle, XCircle, ArrowRight, UserCircle, MinusCircle } from 'lucide-react';
import { allReviews, averageRating, totalReviews } from '@/data/reviews';
import { useTranslation, Trans } from 'react-i18next';
import { FaGoogle, FaMicrosoft, FaAmazon, FaMeta, FaSalesforce, FaSpotify, FaShopify, FaSlack, FaPaypal } from 'react-icons/fa6';

const SocialProof = () => {
  const { t, i18n } = useTranslation();
  const comparisonData = [
    { feature: t('social_proof_compare_feature_matching'), us: t('social_proof_compare_value_us_matching'), others: t('social_proof_compare_value_others_matching'), freelancer: t('social_proof_compare_value_freelancer_matching') },
    { feature: t('social_proof_compare_feature_pricing'), us: t('social_proof_compare_value_us_pricing'), others: t('social_proof_compare_value_others_pricing'), freelancer: t('social_proof_compare_value_freelancer_pricing') },
    { feature: t('social_proof_compare_feature_pm'), us: t('social_proof_compare_value_us_pm'), others: t('social_proof_compare_value_others_pm'), freelancer: t('social_proof_compare_value_freelancer_pm') },
    { feature: t('social_proof_compare_feature_qa'), us: t('social_proof_compare_value_us_qa'), others: t('social_proof_compare_value_others_qa'), freelancer: t('social_proof_compare_value_freelancer_qa') },
    { feature: t('social_proof_compare_feature_fees'), us: t('social_proof_compare_value_us_fees'), others: t('social_proof_compare_value_others_fees'), freelancer: t('social_proof_compare_value_freelancer_fees') },
    { feature: t('social_proof_compare_feature_support'), us: t('social_proof_compare_value_us_support'), others: t('social_proof_compare_value_others_support'), freelancer: t('social_proof_compare_value_freelancer_support') },
    { feature: t('social_proof_compare_feature_vetting'), us: t('social_proof_compare_value_us_vetting'), others: t('social_proof_compare_value_others_vetting'), freelancer: t('social_proof_compare_value_freelancer_vetting') },
    { feature: t('social_proof_compare_feature_accountability'), us: t('social_proof_compare_value_us_accountability'), others: t('social_proof_compare_value_others_accountability'), freelancer: t('social_proof_compare_value_freelancer_accountability') },
    { feature: t('social_proof_compare_feature_scalability'), us: t('social_proof_compare_value_us_scalability'), others: t('social_proof_compare_value_others_scalability'), freelancer: t('social_proof_compare_value_freelancer_scalability') },
    { feature: t('social_proof_compare_feature_guarantee'), us: t('social_proof_compare_value_us_guarantee'), others: t('social_proof_compare_value_others_guarantee'), freelancer: t('social_proof_compare_value_freelancer_guarantee') },
  ];

  const StarRating = ({ rating, size = 'h-5 w-5' }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${size} ${index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </div>
  );
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const featuredReviews = allReviews.slice(0, 6);

  const brandLogos = [
    { icon: FaGoogle, name: 'Google' }, { icon: FaMicrosoft, name: 'Microsoft' }, { icon: FaAmazon, name: 'Amazon' },
    { icon: FaMeta, name: 'Meta' }, { icon: FaSalesforce, name: 'Salesforce' }, { icon: FaSpotify, name: 'Spotify' },
    { icon: FaShopify, name: 'Shopify' }, { icon: FaSlack, name: 'Slack' }, { icon: FaPaypal, name: 'PayPal' }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground font-heading">{t('social_proof_title')}</h2>
            <div className="mt-12 relative w-full overflow-hidden group">
              <div className="flex animate-scroll-fast group-hover:pause text-4xl text-muted-foreground">
                {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((Logo, index) => (
                  <div key={index} className="flex-shrink-0 h-16 w-36 flex items-center justify-center p-2 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <Logo.icon title={Logo.name}/>
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-secondary/30 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary/30 to-transparent pointer-events-none"></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold font-heading">{t('social_proof_reviews_title')}</h3>
              <div className="mt-4 flex items-center justify-center gap-2">
                <StarRating rating={Number(averageRating)} size="h-6 w-6" />
                <p className="text-lg text-muted-foreground">
                  <Trans i18nKey="social_proof_reviews_subtitle" values={{ averageRating, totalReviews }}>
                    <strong>{{averageRating}}</strong> average rating from <strong>{{totalReviews}}+</strong> reviews.
                  </Trans>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.map((review) => (
                <Card key={review.id} className="p-6 flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 rounded-xl card-border-glow">
                  <div className="flex-grow">
                    <StarRating rating={review.rating} />
                    <p className="mt-4 text-foreground font-medium text-sm">"{review.quote}"</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t">
                    <UserCircle className="h-10 w-10 text-slate-400" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.company} - {formatDate(review.date)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/reviews">
                  {t('social_proof_reviews_button', { totalReviews })}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8 font-heading">{t('social_proof_compare_title')}</h3>
            <Card className="shadow-lg overflow-hidden border rounded-xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                      <TableHead className="w-[250px] text-base font-semibold text-foreground">{t('social_proof_compare_feature')}</TableHead>
                      <TableHead className="text-center text-gradient font-bold text-base">{t('social_proof_compare_ppp')}</TableHead>
                      <TableHead className="text-center text-base font-semibold text-foreground">{t('social_proof_compare_freelancers')}</TableHead>
                      <TableHead className="text-center text-base font-semibold text-foreground">{t('social_proof_compare_others')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-secondary/20">
                        <TableCell className="font-semibold text-foreground">{row.feature}</TableCell>
                        <TableCell className="text-center">
                          <span className="flex items-center justify-center gap-2 font-semibold text-green-600">
                            <CheckCircle className="h-5 w-5 shrink-0" /> {row.us}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="flex items-center justify-center gap-2 text-muted-foreground">
                            <MinusCircle className="h-5 w-5 shrink-0" /> {row.freelancer}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="flex items-center justify-center gap-2 text-muted-foreground">
                            <XCircle className="h-5 w-5 shrink-0" /> {row.others}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;