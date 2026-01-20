import React from 'react';
import { motion } from 'framer-motion';
import { Package, Target, ShieldCheck, Star } from 'lucide-react';

const QuickValueGrid = () => {
  const items = [
    {
      icon: Package,
      title: "Fully Managed Service",
      description: "Your project is fully managed by us with the firm, from scoping and vetting to final delivery. You pay us, you get results from us. We find top-vetted companies for you, and we ensure your project gets done with them, flawlessly."
    },
    {
      icon: Target,
      title: "Results-Driven Delivery",
      description: "We focus on outcomes, not just output. Every project is geared towards achieving your specific business objectives, with clear KPIs and measurable success."
    },
    {
      icon: ShieldCheck,
      title: "Project Success Guaranteed",
      description: "Your satisfaction is paramount. If we don't meet the agreed-upon deliverables, we'll make it right, at no extra cost to you. Your investment is protected."
    },
    {
      icon: Star,
      title: "Elite Global Talent",
      description: "Access to a curated network of top-tier development teams and specialists from around the world, handpicked for their expertise and reliability."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-card p-6 rounded-2xl shadow-lg h-full flex flex-col justify-start items-start text-left border border-card-border hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground font-heading">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickValueGrid;