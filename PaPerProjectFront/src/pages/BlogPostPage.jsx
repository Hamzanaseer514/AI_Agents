
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getPostBySlug, getSortedBlogPosts } from '@/data/blogData.jsx';
import { ArrowLeft, ArrowRight, User, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" />;
  }
  
  const sortedPosts = getSortedBlogPosts();
  const currentIndex = sortedPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const faqHalf = post.faq ? Math.ceil(post.faq.length / 2) : 0;
  const faqCol1 = post.faq ? post.faq.slice(0, faqHalf) : [];
  const faqCol2 = post.faq ? post.faq.slice(faqHalf) : [];

  return (
    <div>
      <Helmet>
        <title>{t('title_blog_post', { title: post.title })} | Pay Per Project</title>
        <meta name="description" content={t('meta_desc_blog_post', { description: post.description })} />
      </Helmet>
      
      <article className="bg-background">
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="absolute inset-0 bg-secondary/40">
                <img alt={post.title} className="w-full h-full object-cover opacity-10" src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
            </div>
            <div className="px-4 sm:px-6 lg:px-8 relative">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center"
                >
                    <Link to="/blog" className="text-primary font-semibold hover:underline mb-4 inline-block" dangerouslySetInnerHTML={{ __html: t('blog_post_back') }} />
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">{post.title}</h1>
                    <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2"><User className="h-4 w-4"/> {post.author}</div>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> {post.date}</div>
                        <div className="flex items-center gap-2"><Tag className="h-4 w-4"/> <Badge variant="secondary">{post.category}</Badge></div>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="bg-card">
            <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="max-w-none">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {post.content}
                  </motion.div>
                </div>
            </div>
        </div>
              
        {post.faq && post.faq.length > 0 && (
          <div className="bg-secondary/40">
            <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-none"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">{t('blog_post_faq_title')}</h2>
                <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-12">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCol1.map((item, index) => (
                      <AccordionItem value={`col1-item-${index}`} key={`col1-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Accordion type="single" collapsible className="w-full">
                    {faqCol2.map((item, index) => (
                      <AccordionItem value={`col2-item-${index}`} key={`col2-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        )}
        
        <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-primary/10 p-8 rounded-2xl text-center max-w-4xl mx-auto"
              >
                  <h3 className="text-2xl font-bold text-foreground">{t('blog_post_cta_title')}</h3>
                  <p className="mt-2 mb-6 text-muted-foreground">{t('blog_post_cta_desc')}</p>
                  <Button asChild size="lg">
                    <Link to="/contact">{t('blog_post_cta_button')}</Link>
                  </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-16 flex justify-between items-center"
              >
                {previousPost ? (
                  <Link to={`/blog/${previousPost.slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-secondary">
                    <ArrowLeft className="h-5 w-5"/>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('blog_post_previous')}</p>
                      <p className="font-semibold">{previousPost.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {nextPost ? (
                   <Link to={`/blog/${nextPost.slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-right p-3 rounded-lg hover:bg-secondary">
                     <div>
                      <p className="text-xs text-muted-foreground">{t('blog_post_next')}</p>
                      <p className="font-semibold">{nextPost.title}</p>
                    </div>
                    <ArrowRight className="h-5 w-5"/>
                   </Link>
                ) : <div />}
              </motion.div>
            </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
