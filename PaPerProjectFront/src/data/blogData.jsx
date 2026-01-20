import { upworkAlternative } from '@/data/posts/upwork-alternative.jsx';
import { payPerProject } from '@/data/posts/pay-per-project.jsx';
import { managedFreelanceOutsourcing } from '@/data/posts/managed-freelance-outsourcing.jsx';
import { projectGuarantee } from '@/data/posts/project-guarantee.jsx';
import { globalWebDevelopment } from '@/data/posts/global-web-development.jsx';
import { aiMlOutsourcing } from '@/data/posts/ai-ml-outsourcing.jsx';
import { startupMvpDevelopment } from '@/data/posts/startup-mvp-development.jsx';
import { ecommerceDevelopment } from '@/data/posts/ecommerce-development.jsx';
import { ppcMarketing } from '@/data/posts/ppc-marketing.jsx';
import { enterpriseB2BOutsourcing } from '@/data/posts/enterprise-b2b-outsourcing.jsx';
import { gameDevelopmentOutsourcing } from '@/data/posts/game-development-outsourcing.jsx';
import { freelancerComAlternative } from '@/data/posts/freelancer-com-alternative.jsx';
import { b2bSoftwareSaaSOutsourcing } from '@/data/posts/b2b-software-saas-outsourcing.jsx';
import { aiMachineLearningOutsourcing } from '@/data/posts/ai-machine-learning-outsourcing.jsx';
import { startupMvpOutsourcing } from '@/data/posts/startup-mvp-outsourcing.jsx';
import { managedProjectServices } from '@/data/posts/managed-project-services.jsx';
import { upworkFiverrCompetitors } from '@/data/posts/upwork-fiverr-competitors.jsx';
import { webSoftwareDevelopment } from '@/data/posts/web-software-development.jsx';
import { startupGrowthOutsourcing } from '@/data/posts/startup-growth-outsourcing.jsx';
import { influencerPartnerships } from '@/data/posts/influencer-partnerships.jsx';
import { aiAutomationBusinessGrowth } from '@/data/posts/ai-automation-business-growth.jsx';
import { fintechInnovationOutsourcing } from '@/data/posts/fintech-innovation-outsourcing.jsx';

export const blogPosts = [
  upworkAlternative,
  payPerProject,
  managedFreelanceOutsourcing,
  projectGuarantee,
  globalWebDevelopment,
  aiMlOutsourcing,
  startupMvpDevelopment,
  ecommerceDevelopment,
  ppcMarketing,
  enterpriseB2BOutsourcing,
  gameDevelopmentOutsourcing,
  freelancerComAlternative,
  b2bSoftwareSaaSOutsourcing,
  aiMachineLearningOutsourcing,
  startupMvpOutsourcing,
  managedProjectServices,
  upworkFiverrCompetitors,
  webSoftwareDevelopment,
  startupGrowthOutsourcing,
  influencerPartnerships,
  aiAutomationBusinessGrowth,
  fintechInnovationOutsourcing,
].filter(Boolean);

export const getPostBySlug = (slug) => {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sortedPosts.find(post => post.slug === slug);
};

export const getSortedBlogPosts = () => {
    return [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
};