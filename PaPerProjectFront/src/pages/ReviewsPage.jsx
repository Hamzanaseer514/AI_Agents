import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { allReviews, averageRating, totalReviews } from '@/data/reviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const REVIEWS_PER_PAGE = 9;

const ReviewsPage = () => {
  const { t, i18n } = useTranslation();
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--glow-x', `${x}px`);
    e.currentTarget.style.setProperty('--glow-y', `${y}px`);
  };

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + REVIEWS_PER_PAGE);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <Star
              key={index}
              className={`h-5 w-5 ${starValue <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };


  return (
    <>
      <Helmet>
        <title>{t('title_reviews', { totalReviews })}</title>
        <meta name="description" content={t('meta_desc_reviews', { totalReviews, averageRating })} />
      </Helmet>
      <div className="bg-secondary/40">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">{t('reviews_title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviews_subtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-primary">{averageRating}</span>
              <StarRating rating={Number(averageRating)} />
            </div>
            <p className="text-muted-foreground">{t('reviews_based_on', { totalReviews })}</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.slice(0, visibleReviews).map(review => (
            <Card 
              key={review.id} 
              className="p-6 flex flex-col bg-card border rounded-2xl card-glow"
              onMouseMove={handleMouseMove}
            >
              <div className="flex-grow">
                <StarRating rating={review.rating} />
                <p className="mt-4 text-foreground font-medium">"{review.quote}"</p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <UserCircle className="h-12 w-12 text-slate-400" />
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.company} - {formatDate(review.date)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {visibleReviews < allReviews.length && (
          <div className="mt-12 text-center">
            <Button size="lg" onClick={loadMoreReviews}>
              {t('reviews_load_more')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewsPage;