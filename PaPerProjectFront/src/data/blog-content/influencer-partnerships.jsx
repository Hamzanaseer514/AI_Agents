import React from 'react';
import { Link } from 'react-router-dom';

export const InfluencerPartnershipsContent = () => (
    <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700">
        <p className="lead">As an influencer, your audience is your most valuable asset. You've built trust and authority. But are you maximizing the value of that trust? One-off sponsorships and standard affiliate deals are good, but they don't offer long-term, scalable wealth. It's time to think bigger. This guide will show you how to partner with tech platforms to create a powerful new revenue stream and even build real equity.</p>

        <h2 className="font-bold" id="the-limitations-of-the-traditional-influencer-model">The Limitations of the Traditional Influencer Model</h2>
        <p>The traditional model of sponsorships and affiliate marketing has a ceiling. You're paid once for a post, or you earn a small commission on a low-ticket item. It's a constant hustle for the next deal. To build lasting wealth, you need to move from being a "promoter" to being a "partner."</p>
        
        <img  alt="An influencer standing at a crossroads, one path leading to a one-time payment, the other to a growing tree of revenue and equity" className="w-full rounded-lg my-8 shadow-md" src="https://images.unsplash.com/photo-1556155092-490a1ba16284" />

        <h2 className="font-bold" id="the-high-ticket-partnership-model">The High-Ticket Partnership Model: A New Frontier</h2>
        <p>Imagine instead of promoting a $50 product, you could earn a percentage of a $50,000 project. That's the power of partnering with a high-ticket service platform like ours. We connect businesses with elite, managed teams for software development, AI integration, and other major projects. Your audience is full of potential clients for these services.</p>
        <p>Here's how it works:</p>
        <ol className="list-decimal list-inside space-y-2">
            <li><strong>You Introduce the Solution:</strong> Through your content (videos, newsletters, podcasts), you talk about the challenges your audience faces (e.g., needing a new app, wanting to automate their business) and introduce our platform as the solution.</li>
            <li><strong>We Provide the Tools:</strong> We give you a custom landing page and a unique referral link so your audience gets a VIP experience.</li>
            <li><strong>We Handle the Sale:</strong> When a lead comes in, our expert team handles the consultation, scoping, and closing. You don't need to do any selling.</li>
            <li><strong>You Earn a Significant Share:</strong> When the project is signed, you earn a substantial percentage of the project value. On a $50,000 project, that could be $7,500 or more from a single referral.</li>
        </ol>

        <h2 className="font-bold" id="beyond-commission-building-equity-and-a-personal-brand">Beyond Commission: Building Equity and a Personal Brand</h2>
        <p>The best partnerships go beyond just commission. We offer a unique opportunity for top-tier influencers to become true equity partners.</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Co-Branded Ventures:</strong> We can work with you to create a co-branded service offering, tailored specifically to your audience. For example, "The [Your Brand] AI Automation Service."</li>
            <li><strong>Equity Opportunities:</strong> For influencers who consistently bring in high-value projects, we offer opportunities for equity in our company. You're not just promoting a business; you're helping to build it and sharing in its long-term success.</li>
            <li><strong>Thought Leadership:</strong> By partnering with a cutting-edge tech platform, you elevate your own brand. You become known not just as an influencer, but as a savvy business person at the forefront of technology and innovation.</li>
        </ul>

        <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 bg-slate-50 italic">
            "Stop renting your audience's attention. Start leveraging it to build something you own. A high-ticket partnership is your path from influencer to owner."
        </blockquote>

        <p className="font-semibold text-slate-800">If you're an influencer in the business, tech, or startup space with an engaged audience, we want to partner with you. <Link to="/referrals#influencers" className="text-primary font-semibold hover:underline">Learn more about our influencer program</Link> and let's discuss how we can build something valuable together.</p>
    </div>
);