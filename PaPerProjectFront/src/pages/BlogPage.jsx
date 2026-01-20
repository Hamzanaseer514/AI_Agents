
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getSortedBlogPosts } from '@/data/blogData.jsx';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation();
  const sortedPosts = getSortedBlogPosts();

  return (
    <div>
      <Helmet>
        <title>{t('title_blog')} | Pay Per Project</title>
        <meta name="description" content={t('meta_desc_blog')} />
      </Helmet>

      <div className="relative bg-secondary/40 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20">
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {t('blog_title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('blog_subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group">
                  <div className="bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full flex flex-col border">
                    <div className="relative">
                      <img alt={post.title} className="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1515379789058-c11aab3aa382" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm text-foreground">{post.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-muted-foreground flex-grow mb-4">{post.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center text-primary font-semibold">
                          {t('blog_read_more')} <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
