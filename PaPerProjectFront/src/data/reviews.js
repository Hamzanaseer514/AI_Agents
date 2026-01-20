const nameData = {
  gulf: {
    first: ['Khalid', 'Fahad', 'Saud', 'Bandar', 'Turki', 'Nasser', 'Sultan', 'Abdullah', 'Faisal', 'Mohammed', 'Ahmed', 'Ali', 'Hamad', 'Jassim', 'Fatima', 'Noora', 'Aisha', 'Mariam', 'Hessa', 'Latifa'],
    last: ['Al-Fahim', 'Al-Mansoori', 'Al-Ghamdi', 'Al-Qahtani', 'Al-Dosari', 'Al-Mutairi', 'Al-Otaibi', 'Bin Laden', 'Al-Thani', 'Al-Maktoum', 'Al-Nahyan', 'Al-Saud'],
  },
  southAsian: {
    first: ['Rohan', 'Arjun', 'Vikram', 'Aditya', 'Sameer', 'Imran', 'Ayesha', 'Priya', 'Ananya', 'Saanvi', 'Ali', 'Fatima', 'Hassan', 'Zoya'],
    last: ['Khan', 'Gupta', 'Sharma', 'Patel', 'Singh', 'Kumar', 'Hussain', 'Malik', 'Jain', 'Shah', 'Reddy', 'Mehta'],
  },
  eastAsian: {
    first: ['Kenji', 'Haruto', 'Yuki', 'Kaito', 'Sora', 'Min-jun', 'Seo-yeon', 'Ji-woo', 'Wei', 'Li', 'Hao', 'Mei', 'Yui', 'Hina', 'Rin'],
    last: ['Tanaka', 'Suzuki', 'Takahashi', 'Watanabe', 'Kim', 'Lee', 'Park', 'Choi', 'Wang', 'Li', 'Zhang', 'Chen'],
  },
  western: {
    first: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
      'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Nancy', 'Lisa', 'Margaret', 'Betty', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna',
      'Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Logan', 'Ethan', 'Jacob', 'Jackson',
      'Olivia', 'Emma', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Amelia', 'Harper', 'Evelyn', 'Abigail',
      'David', 'Benjamin', 'Samuel', 'Daniel', 'Jacob', 'Elijah', 'Noah', 'Aaron', 'Adam', 'Caleb',
      'Sarah', 'Leah', 'Rachel', 'Rebecca', 'Esther', 'Hannah', 'Abigail', 'Miriam', 'Naomi', 'Talia'
    ],
    last: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
      'Goldberg', 'Cohen', 'Levy', 'Friedman', 'Adler', 'Kaplan', 'Weiss', 'Rubin', 'Stein', 'Shapiro'
    ],
  },
};

const companyData = {
  saas: ['Vercel', 'Linear', 'Cal.com', 'Raycast', 'Clearbit', 'Attentive', 'PostHog', 'Sentry', 'Supabase', 'Retool', 'Webflow', 'Gong', 'Loom', 'Pitch', 'Coda', 'Zapier', 'Airtable', 'Intercom', 'Miro'],
  ecommerce: ['Cuts Clothing', 'Snif', 'Olipop', 'Poppi', 'Caraway', 'Our Place', 'Feastables', 'Chamberlain Coffee', 'Studs', 'Outdoor Voices', 'Parade', 'Recess', 'Supergoop!', 'Coterie', 'Glossier', 'Allbirds', 'Warby Parker'],
  fintech: ['Ramp', 'Brex', 'Mercury', 'Deel', 'Rippling', 'AngelList', 'Pipe', 'Public.com', 'Ledger', 'Zapper', 'Uniswap Labs', 'Plaid', 'Chime', 'Klarna'],
  services: ['Getir', 'Zapp', 'Hims & Hers', 'Levels Health', 'Eight Sleep', 'Whoop', 'Oura', 'Tonal', 'Forme Life', 'DoorDash', 'Instacart', 'Cameo'],
  media: ['Morning Brew', 'The Athletic', 'Axios', 'The Browser', 'Every', 'Glass Animals', 'Run the Jewels', 'Substack', 'Puck News', 'The Information'],
  enterprise: ['Okta', 'Twilio', 'Datadog', 'Snowflake', 'Palantir', 'Asana', 'DocuSign', 'Zoom'],
  devTools: ['GitHub', 'GitLab', 'HashiCorp', 'MongoDB', 'Docker', 'Postman', 'Databricks'],
  big_brands: ['Slack', 'Shopify', 'Notion', 'Figma', 'Stripe', 'Airbnb', 'Spotify', 'Canva', 'Netflix', 'Amazon', 'Google', 'Microsoft', 'Apple']
};

const reviewTemplates = [
  "Absolutely game-changing. Our productivity has skyrocketed since we started using their service.",
  "I was skeptical at first, but the results speak for themselves. We hit our targets a month ahead of schedule.",
  "The team they provided was top-notch. Professional, skilled, and integrated perfectly with our existing workflow.",
  "Finally, a service that delivers on its promises. We saved thousands and launched our MVP in record time.",
  "Working with them felt like a true partnership. They were as invested in our success as we were.",
  "Our e-commerce conversion rate is up 25% after implementing the solution they built. Incredible ROI.",
  "I used to spend hours on manual tasks. Their automation solution gave me my weekends back. I can't thank them enough.",
  "We were struggling to scale our infrastructure. Their DevOps team came in and built a robust, scalable system that handles 10x the traffic without breaking a sweat.",
  "The expert advice session was worth its weight in gold. I got more clarity in one hour than I did in six months of trying on my own.",
  "As a non-technical founder, I was lost. They guided me through the entire process, from idea to launch. My vision is now a reality.",
  "The quality of the code is exceptional. Clean, well-documented, and easy to maintain. Our engineering team is thrilled.",
  "We needed to pivot our strategy fast. They assembled a team for us in under 48 hours, and we didn't miss a beat.",
  "Their project management is flawless. Constant communication, transparent progress tracking, and they delivered on time and under budget.",
  "I was about to give up on my startup idea. A consultation with one of their experts gave me a new perspective and a clear path forward. We just closed our pre-seed round.",
  "The UI/UX design they delivered was stunning. Our user engagement metrics have never been better.",
  "We had a complex data migration project that no one wanted to touch. Their team handled it seamlessly with zero downtime.",
  "The best investment we've made this year. Period.",
  "If you're on the fence, just do it. You won't regret it.",
  "Our customer support tickets have dropped by 40% thanks to the intuitive platform they built for us.",
  "They took our vague concept and turned it into a fully-functional, market-ready product. It felt like magic.",
  "The white-label solution we purchased was customized and deployed in a week. It would have taken us a year to build from scratch.",
  "I've worked with many agencies, but none have come close to this level of professionalism and expertise.",
  "Our marketing campaign was a huge success thanks to the landing pages and analytics dashboard they developed.",
  "The security audit they performed was incredibly thorough. They found vulnerabilities we never would have caught on our own.",
  "From start to finish, the experience was seamless. Highly recommended for any founder looking to accelerate their growth.",
  "Their ability to understand our complex requirements and deliver a simple, elegant solution was truly impressive.",
  "We launched our new feature built by their team and saw a 15% increase in user retention. The numbers don't lie.",
  "The speed and quality of their work exceeded all our expectations. We're already planning our next project with them.",
  "A truly 'plug-and-play' experience. The development team they provided felt like an extension of our own.",
  "I was drowning in technical debt. Their team refactored our legacy codebase and it's now faster and more stable than ever.",
  "The strategic advice helped us avoid a critical mistake in our go-to-market strategy. Invaluable guidance.",
  "Our mobile app went from a 2-star rating to a 4.8-star rating after their team rebuilt it. Our users are ecstatic.",
  "They're not just developers; they're product thinkers. They challenged our assumptions and helped us build a better product.",
  "The talent is world-class. It would have taken us 6 months to hire someone with this level of expertise.",
  "We needed an enterprise-grade solution on a startup budget. They delivered.",
  "I finally have a dashboard that gives me a clear view of my business KPIs. It's transformed how I make decisions.",
  "Their agile process was a breath of fresh air. We were always in the loop and could provide feedback at every stage.",
  "The design system they created has made our development process so much more efficient and consistent.",
  "Our platform now supports 100,000 concurrent users without any performance degradation. Simply amazing engineering.",
  "The AI model they developed for us has an accuracy of 98%, which is far beyond what we thought was possible.",
  "They helped us navigate the complexities of compliance, saving us a massive headache.",
  "The communication was excellent. I never had to wonder about the status of our project.",
  "This service is the cheat code for startups. It lets you punch way above your weight.",
  "I've recommended them to every founder I know. They're that good.",
  "We were burning money with an inefficient cloud setup. They optimized our infrastructure and cut our AWS bill by 60%.",
  "The custom e-commerce checkout flow they built increased our conversion rate by 30%. It paid for itself in a month.",
  "They built a beautiful, responsive website that perfectly captures our brand identity. Our marketing team is in love.",
  "I was struggling to articulate my vision to investors. The prototype they built did the talking for me.",
  "The level of detail in their project proposal gave me confidence from day one. They think of everything.",
  "Our time-to-market was cut in half. We were able to beat our competitors to a key feature launch.",
  "Their QA team is ruthless in the best way possible. The final product was virtually bug-free.",
  "They managed our entire product launch, from technical implementation to marketing coordination. A huge weight off my shoulders.",
  "The custom CRM they built has streamlined our entire sales process. Our team is closing deals faster than ever.",
  "We needed a complex integration with a legacy system. They built a custom API that worked flawlessly.",
  "The onboarding process for the team was incredibly smooth. They were contributing code on day one.",
  "I appreciate their proactive approach. They identified potential issues before they became problems.",
  "Our user feedback since the relaunch has been overwhelmingly positive. The new design is a huge hit.",
  "They delivered a high-quality mobile app for both iOS and Android on a tight deadline. Impressive execution.",
  "The data analytics platform they built gives us insights we never had before. It's a game-changer for our business strategy.",
  "I was worried about communication with a remote team, but their project manager made it feel like they were in the office next door.",
  "They're not just code monkeys. They understand business goals and translate them into technical solutions.",
  "The scalability of the architecture they designed gives us confidence to pursue our aggressive growth plans.",
  "We saw a 50% reduction in page load times after they optimized our frontend. Our users noticed the difference immediately.",
  "Their expertise in our niche industry was a huge advantage. They understood the nuances without extensive hand-holding.",
  "The project was a massive undertaking, but they broke it down into manageable sprints and delivered consistently.",
  "I've never worked with a more organized and efficient development team.",
  "The final deliverable was even better than what we had originally envisioned. They went above and beyond.",
  "They helped us build an MVP that secured our seed funding. We couldn't have done it without them.",
  "The documentation they provided was so clear that our internal team could take over maintenance with no issues.",
  "Their team's problem-solving skills are second to none. They tackled every challenge with creativity and expertise.",
  "We were stuck in a cycle of technical debt and slow progress. They broke us out of it and got us back on track.",
  "The investment in their service has paid for itself tenfold. The value is undeniable.",
  "They are true professionals who take pride in their work. It shows in the quality of the final product.",
  "Our conversion funnel is now a well-oiled machine thanks to the A/B testing framework and optimizations they implemented.",
  "They transformed our outdated desktop software into a modern, cloud-based SaaS platform.",
  "The team's ability to adapt to our changing requirements was crucial to the project's success.",
  "I was impressed by their commitment to security best practices throughout the development lifecycle.",
  "They built a custom integration with Salesforce that has saved our sales team hundreds of hours.",
  "The interactive prototype they created was instrumental in getting stakeholder buy-in for the project.",
  "Their deep knowledge of cloud-native technologies helped us build a future-proof platform.",
  "We needed a partner who could handle the entire product lifecycle, from ideation to deployment and maintenance. They were the perfect fit.",
  "The post-launch support has been fantastic. They're always quick to respond and resolve any issues.",
  "They helped us implement a CI/CD pipeline that has dramatically improved our development velocity.",
  "Our app's App Store rating jumped from 3.1 to 4.9 stars after the redesign and performance improvements.",
  "They are masters of their craft. The code is elegant, efficient, and a pleasure to work with.",
  "The project manager was a superstar. They kept everything on track and shielded me from the day-to-day complexities.",
  "We were able to launch in a new international market thanks to the localization features they implemented.",
  "Their team felt like a natural extension of our own. The cultural fit was perfect.",
  "The business intelligence dashboard they built is now the first thing I check every morning. It's my command center.",
  "They successfully migrated our entire infrastructure to a new cloud provider with zero downtime. A feat of engineering.",
  "I was blown away by the creativity and innovation they brought to the table. They didn't just build what we asked for; they made it better.",
  "Our user onboarding flow is now so intuitive that our support team has seen a 60% reduction in 'how-to' questions.",
  "They are worth every penny. Don't hesitate to work with them.",
  "The project was delivered on time, on budget, and exceeded our quality expectations. The trifecta!",
  "They helped us build a complex multi-tenant architecture that is both secure and scalable.",
  "The real-time collaboration features they built have transformed how our users interact with our product.",
  "I finally feel like our technology is a competitive advantage, not a liability.",
  "They are the best-kept secret in the tech industry. I almost don't want to share how good they are!",
  "Our team was able to focus on our core business while they handled the complex technical challenges. It was the perfect division of labor.",
  "The AI-powered recommendation engine they developed has increased user engagement by 40%.",
  "They are not just a vendor; they are a strategic partner in our success.",
  "The quality of their work is on par with what you'd expect from a FAANG company, but without the bureaucracy and high costs.",
  "They took our half-baked idea and turned it into a polished, professional product that we're proud to show our customers.",
  "The platform they built is incredibly stable and reliable. Our uptime has been 99.99% since launch.",
  "I was impressed by their transparent pricing and detailed project scoping. There were no surprises along the way.",
  "They helped us build a HIPAA-compliant platform, which was a critical requirement for our business.",
  "The team's communication skills were just as strong as their technical skills. It made for a smooth and enjoyable collaboration.",
  "We've worked with them on three projects now, and they've knocked it out of the park every single time.",
  "They are the gold standard for managed project delivery. I wouldn't trust anyone else with our critical projects.",
  "Our investors were impressed with the speed and quality of our MVP, which was a key factor in our successful funding round.",
  "They helped us create a product that our customers genuinely love to use. The feedback has been incredible.",
  "The team's dedication and work ethic were inspiring. They treated our project as if it were their own.",
  "They are a well-oiled machine. From the initial consultation to the final handover, every step of the process was optimized for efficiency and quality.",
  "The solution they delivered is not just functional; it's beautiful. The attention to detail in the UI/UX is remarkable.",
  "They helped us untangle a spaghetti codebase that had been plaguing us for years. Our developers are forever grateful.",
  "The custom e-learning platform they built has revolutionized our training programs.",
  "They are the real deal. A team of A-players who deliver A+ results.",
  "I was hesitant to outsource such a critical project, but they earned my trust within the first week. Their professionalism is outstanding.",
  "The project was a huge success and has had a significant positive impact on our bottom line.",
  "They provided a level of strategic insight that we didn't expect. They helped us think through our product roadmap and make better decisions.",
  "The mobile app they developed is fast, intuitive, and has a 5-star rating in the app store. What more could you ask for?",
  "They are incredibly responsive and adaptable. When we needed to make a last-minute change, they handled it without any drama.",
  "The platform they built for us is the foundation of our entire business. We couldn't operate without it.",
  "I've been in the tech industry for 20 years, and this is one of the best-run projects I've ever been a part of.",
  "They are a pleasure to work with. Smart, professional, and genuinely good people.",
  "The ROI on this project was realized in just six months. The results have been phenomenal.",
  "They helped us build a product that is not only functional but also delightful to use. Our users are raving about it.",
  "The team's expertise in machine learning was instrumental in developing the core feature of our product.",
  "They are the secret weapon that every startup needs. They give you the firepower of a large engineering team without the overhead.",
  "The project was complex and had a lot of moving parts, but their project manager kept everything running smoothly.",
  "They are true partners who are invested in your success. I can't recommend them highly enough.",
  "The quality of their work is consistently excellent. They have a high bar for themselves and it shows.",
  "They helped us build a product that has a real impact on our users' lives. It's been incredibly rewarding to see.",
  "The team is a perfect blend of technical expertise, business acumen, and creative talent.",
  "They are the best in the business. If you have a critical project, don't even think about going anywhere else.",
  "Our new website is not only beautiful but also incredibly fast. Our Lighthouse scores are all in the high 90s.",
  "They helped us build a custom analytics dashboard that gives us a 360-degree view of our business. It's been a game-changer for our decision-making.",
  "The team was able to quickly grasp our complex business logic and translate it into a robust and scalable software solution.",
  "They are a team of true craftsmen who take pride in their work. The quality of the code is a testament to their skill and dedication.",
  "The project was a massive success and has set us up for long-term growth. We are incredibly grateful for their partnership.",
  "They are the best of the best. If you want to build a world-class product, you need to work with a world-class team. This is that team.",
  "Our app's performance on older devices improved dramatically after their optimization work. It expanded our addressable market significantly.",
  "The team's proactive suggestions for feature improvements were invaluable. They helped us build a much better product than we had originally planned.",
  "They built a custom booking system for us that has reduced administrative overhead by 75%.",
  "I was impressed by their ability to work within our existing tech stack and coding standards. The integration was seamless.",
  "The accessibility (a11y) improvements they made have opened up our product to a whole new audience. It was the right thing to do and good for business.",
  "They are masters of agile development. The feedback loop was tight, and we were able to iterate quickly based on user testing.",
  "The API they built is clean, well-documented, and a pleasure for other developers to work with. It's become a core asset for our company.",
  "They helped us navigate the complex world of GDPR and data privacy, ensuring our product was compliant from day one.",
  "The team's passion for technology is contagious. They were always excited to explore new tools and techniques to improve our product.",
  "They are not just order-takers; they are strategic partners who will challenge your assumptions and push you to build the best possible product.",
  "The visual identity and branding work they did was exceptional. It gave our startup the professional polish it needed to compete with established players.",
  "They built a real-time data streaming pipeline that processes millions of events per day. The scale and reliability are incredible.",
  "I've never had a smoother project experience. The communication was clear, the deadlines were met, and the quality was outstanding.",
  "They are the elite special forces of software development. When you have a mission-critical project, they are the ones you call.",
  "The custom content management system (CMS) they built is so intuitive that our marketing team can now launch new campaigns without any engineering support.",
  "They helped us build a product that is not just a feature, but a platform. It has opened up a whole new set of business opportunities for us.",
  "The team's ability to deliver high-quality work on a consistent basis is what sets them apart. They are incredibly reliable.",
  "They are the best investment we've made in our company's future. The value they've provided is immeasurable.",
  "The project was a huge success, and it's all thanks to the incredible team they assembled for us. I can't thank them enough.",
  "They are the real deal. If you're serious about building a great product, you need to work with them.",
  "Our platform's security posture was significantly improved after their comprehensive audit and remediation work. I can sleep better at night now.",
  "They built a gamification system that has increased user engagement and retention by over 50%. Our users are hooked!",
  "The team's deep expertise in our industry saved us months of ramp-up time. They were able to hit the ground running from day one.",
  "They are a team of problem-solvers. No matter what challenge we threw at them, they always came back with a smart and elegant solution.",
  "The project was delivered ahead of schedule and under budget. In my 15 years in the industry, I've never seen that happen before.",
  "They are the best-kept secret of successful startups. They give you an unfair advantage over the competition.",
  "The team's positive attitude and can-do spirit made them a pleasure to work with. They brought a great energy to our project.",
  "They helped us build a product that is not just functional, but also emotionally resonant with our users. The brand loyalty we've built is incredible.",
  "The technical architecture they designed is a work of art. It's scalable, resilient, and easy to maintain.",
  "They are the best in the world at what they do. If you have a high-stakes project, there is no one better to trust.",
  "Our sales cycle has shortened by 30% since we started using the interactive demo they built for us.",
  "They helped us build a two-sided marketplace from scratch, navigating the complex chicken-and-egg problem with a brilliant launch strategy.",
  "The team's commitment to writing clean, tested code has made our platform incredibly stable and easy to extend.",
  "They are not just a service provider; they are an extension of our team. We couldn't imagine working without them.",
  "The project was a massive success, and it has transformed our business. We are now the leader in our market, and it's all thanks to their incredible work.",
  "They are the best of the best. Period. If you have the opportunity to work with them, take it.",
  "The migration from our monolithic application to a microservices architecture was a huge success. Our development teams are now more autonomous and productive.",
  "They built a custom video streaming solution for us that delivers a high-quality, low-latency experience to our users all over the world.",
  "The team's expertise in user research and usability testing was instrumental in creating a product that is truly user-centric.",
  "They are a team of A-players who are passionate about their craft. It's inspiring to work with people who care so much about quality.",
  "The project was a huge success, and it has had a profound impact on our company's trajectory. We are forever grateful for their partnership.",
  "They are the best in the business. If you want to build a product that will change the world, you need to work with them.",
  "Our customer lifetime value (LTV) has increased by 40% since we launched the new subscription features they built.",
  "They helped us build a platform that is not just a tool, but a community. The network effects are starting to kick in, and it's incredible to watch.",
  "The team's ability to work with our internal stakeholders and incorporate their feedback was crucial to the project's success.",
  "They are a team of true professionals who are dedicated to their clients' success. I can't recommend them highly enough.",
  "The project was a massive success, and it has exceeded all of our expectations. We are blown away by the results.",
  "They are the best in the world at what they do. If you have a project that absolutely has to succeed, they are the only choice.",
  "The AI-powered chatbot they built has automated 80% of our customer support inquiries, allowing our team to focus on more complex issues.",
  "They helped us build a product that is not just a 'nice-to-have', but a 'must-have' for our customers. Our churn rate has dropped to near zero.",
  "The team's deep understanding of our users' pain points was the key to building a product that truly solves their problems.",
  "They are a team of rockstars. Every single person on the team was a top-performer in their field.",
  "The project was a huge success, and it has put our company on the map. We are now seen as a leader in our industry.",
  "They are the best in the business. If you want to build a product that will define your category, you need to work with them.",
  "Our average revenue per user (ARPU) has doubled since we launched the new premium features they developed.",
  "They helped us build a platform that has become the operating system for our industry. The ecosystem growing around it is incredible.",
  "The team's ability to manage a complex project with multiple dependencies was truly impressive. They are masters of execution.",
  "They are a team of true partners who are as invested in our success as we are. It's a rare and valuable quality.",
  "The project was a massive success, and it has given us a sustainable competitive advantage. We are now years ahead of our competition.",
  "They are the best in the world at what they do. If you have a vision for a product that will change the world, they are the team that can make it a reality.",
  "The predictive analytics model they built has helped us reduce inventory waste by 30%, saving us millions of dollars per year.",
  "They helped us build a product that has become a daily habit for our users. The engagement metrics are off the charts.",
  "The team's ability to communicate complex technical concepts in a clear and concise way was a huge asset. It made for a much smoother collaboration with our non-technical stakeholders.",
  "They are a team of true professionals who are committed to excellence in everything they do. It's been a pleasure to work with them.",
  "The project was a huge success, and it has transformed our company's culture. We are now a much more data-driven and product-led organization.",
  "They are the best in the business. If you want to build a product that will leave a lasting legacy, you need to work with them.",
  "Our user acquisition cost (CAC) has decreased by 50% thanks to the viral loops and referral features they built into our product.",
  "They helped us build a platform that has become the central hub for our community. The sense of belonging and connection it has created is incredible.",
  "The team's ability to work under pressure and deliver on a tight deadline was nothing short of heroic. They saved our product launch.",
  "They are a team of true partners who are always looking for ways to add value beyond the scope of the project. I can't recommend them highly enough.",
  "The project was a massive success, and it has opened up a whole new world of possibilities for our business. The future has never been brighter.",
  "They are the best in the world at what they do. If you have a dream for a product that will make the world a better place, they are the team that can help you build it.",
  "The fraud detection system they built has saved us from millions of dollars in potential losses. It's one of the best investments we've ever made.",
  "They helped us build a product that is so intuitive and easy to use that our users need zero training. The onboarding process is completely self-serve.",
  "The team's deep expertise in our domain was a huge competitive advantage. They were able to anticipate our needs and build a product that was perfectly tailored to our market.",
  "They are a team of true professionals who are passionate about building great products. It's been an honor to work with them.",
  "The project was a huge success, and it has had a ripple effect throughout our entire organization. We are now a more innovative and agile company.",
  "They are the best in the business. If you want to build a product that will be remembered for generations, you need to work with them.",
  "Our net promoter score (NPS) went from 20 to 75 after we launched the new version of our product. Our customers are now our biggest advocates.",
  "They helped us build a platform that has become the go-to resource for our industry. The authority and credibility it has given us is priceless.",
  "The team's ability to manage a large, distributed team of specialists was incredible. They are masters of orchestration.",
  "They are a team of true partners who are always willing to go the extra mile to ensure our success. I can't imagine working with anyone else.",
  "The project was a massive success, and it has completely changed the game for our company. We are now in a league of our own.",
  "They are the best in the world at what they do. If you have a project that you believe in with all your heart, they are the team that will help you bring it to life.",
  "The supply chain optimization software they built has increased our efficiency by 40% and reduced our operational costs by 25%.",
  "They helped us build a product that is not just a tool, but an experience. The emotional connection our users have with our brand is incredible.",
  "The team's ability to balance speed and quality was remarkable. They were able to deliver a high-quality product on an aggressive timeline.",
  "They are a team of true professionals who are dedicated to their craft. It's been a privilege to learn from them.",
  "The project was a huge success, and it has inspired our entire company to think bigger and be more ambitious. The cultural impact has been profound.",
  "They are the best in the business. If you want to build a product that will change the course of history, you need to work with them.",
  "Our employee turnover rate has decreased by 50% since we launched the new internal tools they built for us. Our team is happier and more productive.",
  "They helped us build a platform that has become the foundation for a whole new ecosystem of products and services. The possibilities are endless.",
  "The team's ability to navigate our complex corporate structure and get buy-in from all the key stakeholders was a masterclass in project management.",
  "They are a team of true partners who are always honest and transparent, even when the news is not good. I trust them completely.",
  "The project was a massive success, and it has given us the momentum we need to achieve our long-term vision. We are on a whole new trajectory now.",
  "They are the best in the world at what they do. If you have a project that is so ambitious it scares you, they are the team that can help you conquer it.",
  "The personalized learning platform they built has improved student outcomes by 30% and increased teacher satisfaction by 40%.",
  "They helped us build a product that is not just a solution, but a movement. The community that has formed around it is incredible.",
  "The team's ability to stay focused and execute flawlessly in the face of constant distractions was truly impressive. They are masters of discipline.",
  "They are a team of true partners who are always challenging us to be better. They've made us a much stronger company.",
  "The project was a huge success, and it has become a case study for innovation within our industry. We are now seen as a thought leader.",
  "They are the best in the business. If you want to build a product that will be talked about for years to come, you need to work with them.",
  "Our time-to-hire has been reduced by 60% thanks to the recruiting platform they built for us. We are now able to attract and hire top talent much faster.",
  "They helped us build a platform that has become the source of truth for our entire industry. The data and insights it provides are invaluable.",
  "The team's ability to manage a project with a global, remote team was seamless. They are masters of asynchronous communication.",
  "They are a team of true partners who are always looking for ways to help us win. Their success is our success, and vice versa.",
  "The project was a massive success, and it has given us a platform for sustained, long-term growth. We are just getting started.",
  "They are the best in the world at what they do. If you have a project that you believe will change the world, they are the team that can help you make it happen."
];

const allCompanies = Object.values(companyData).flatMap(category => category);

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomName = () => {
  const regions = Object.keys(nameData);
  const randomRegionKey = regions[Math.floor(Math.random() * regions.length)];
  const region = nameData[randomRegionKey];
  
  const firstName = region.first[Math.floor(Math.random() * region.first.length)];
  const lastName = region.last[Math.floor(Math.random() * region.last.length)];
  
  return `${firstName} ${lastName}`;
};


const reviews = [];
const startDate = new Date(2023, 0, 1);
const endDate = new Date();
const possibleRatings = [5, 4.5, 4, 5, 4.5, 5]; // Skew towards higher ratings

const usedCombos = new Set();
const maxReviews = 310;

// Shuffle quotes to ensure randomness
const shuffledQuotes = [...reviewTemplates].sort(() => 0.5 - Math.random());
let quoteIndex = 0;

while (reviews.length < maxReviews && quoteIndex < shuffledQuotes.length) {
    const company = allCompanies[Math.floor(Math.random() * allCompanies.length)];
    const quote = shuffledQuotes[quoteIndex];
    const name = getRandomName();
    
    // Using a simpler combo check for name-company to avoid multiple reviews from the same person at the same company
    const combo = `${name}-${company}`;

    if (!usedCombos.has(combo)) {
      const review = {
        id: reviews.length + 1,
        name,
        company,
        quote,
        rating: possibleRatings[Math.floor(Math.random() * possibleRatings.length)],
        date: generateRandomDate(startDate, endDate).toISOString().split('T')[0],
      };
      reviews.push(review);
      usedCombos.add(combo);
      quoteIndex++;
    }
}


export const allReviews = reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

// THIS IS DEPRECATED AND NO LONGER USED. WE USE allReviews.slice(0, 6) INSTEAD.
// The key 'quoteKey' is also no longer present in the review objects.
export const featuredReviews = allReviews.slice(0, 6).map(r => ({ ...r, quoteKey: r.quote }));


export const averageRating = (allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length).toFixed(1);

export const totalReviews = allReviews.length;