import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const QuizPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const quizQuestions = [
    {
      question: t('quiz_q_location'),
      key: 'location',
      type: 'text',
      placeholder: 'e.g., London, UK or Remote',
      validation: (value) => value && value.trim().length > 0,
    },
    {
      question: t('quiz_q_industry'),
      key: 'industry',
      type: 'select',
      options: [
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'it', label: 'IT' },
        { value: 'consultancy', label: 'Consultancy' },
        { value: 'dental', label: 'Dental' },
        { value: 'hospitality', label: 'Hospitality' },
        { value: 'health', label: 'Health' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'education', label: 'Education' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'agency', label: 'Agency' },
        { value: 'interior_architecture', label: 'Interior Architecture' },
        { value: 'gas_oil', label: 'Gas & Oil' },
        { value: 'retail', label: 'Retail' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'other', label: 'Other' },
      ],
      validation: (value) => !!value,
    },
    {
      question: t('quiz_q_goal'),
      key: 'goal',
      type: 'choice',
      options: [
        { value: 'launch', label: t('quiz_goal_launch') },
        { value: 'marketing', label: t('quiz_goal_marketing') },
        { value: 'operations', label: t('quiz_goal_operations') },
        { value: 'other', label: t('quiz_goal_other') },
      ],
      validation: (value) => !!value,
    },
    {
      question: t('quiz_q_project_type'),
      key: 'projectType',
      type: 'conditional_choice',
      options: {
        launch: [
          { value: 'website', label: t('quiz_pt_website') },
          { value: 'app', label: t('quiz_pt_app') },
          { value: 'saas', label: t('quiz_pt_saas') },
          { value: 'branding', label: t('quiz_pt_branding') },
        ],
        marketing: [
          { value: 'seo', label: t('quiz_pt_seo') },
          { value: 'content', label: t('quiz_pt_content') },
          { value: 'social', label: t('quiz_pt_social') },
          { value: 'landing-page', label: t('quiz_pt_landing') },
        ],
        operations: [
          { value: 'automation', label: t('quiz_pt_automation') },
          { value: 'crm', label: t('quiz_pt_crm') },
          { value: 'dashboard', label: t('quiz_pt_dashboard') },
        ],
        other: [
          { value: 'consulting', label: t('quiz_pt_consulting') },
          { value: 'design', label: t('quiz_pt_design') },
          { value: 'development', label: t('quiz_pt_development') },
        ],
      },
      validation: (value) => !!value,
    },
    {
      question: t('quiz_q_budget'),
      key: 'budget',
      type: 'choice',
      options: [
        { value: '<1k', label: t('quiz_budget_option1') },
        { value: '1k-5k', label: t('quiz_budget_option2') },
        { value: '5k-10k', label: t('quiz_budget_option3') },
        { value: '10k+', label: t('quiz_budget_option4') },
      ],
      validation: (value) => !!value,
    },
    {
      question: t('quiz_q_timeline'),
      key: 'timeline',
      type: 'choice',
      options: [
        { value: 'asap', label: t('quiz_timeline_asap') },
        { value: '2-weeks', label: t('quiz_timeline_2w') },
        { value: '4-weeks', label: t('quiz_timeline_4w') },
        { value: 'flexible', label: t('quiz_timeline_flexible') },
      ],
      validation: (value) => !!value,
    },
  ];

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < quizQuestions.length) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const progress = ((step) / quizQuestions.length) * 100;

  const currentQuestion = quizQuestions[step];
  
  const getOptions = () => {
    if (!currentQuestion) return [];
    if (currentQuestion.type === 'conditional_choice') {
      return currentQuestion.options[answers.goal] || currentQuestion.options.other;
    }
    return currentQuestion.options;
  };

  const options = getOptions();
  const isNextDisabled = currentQuestion ? !currentQuestion.validation(answers[currentQuestion.key]) : true;

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key] || ''}
            onChange={(e) => handleAnswer(currentQuestion.key, e.target.value)}
            className="text-lg p-6"
          />
        );
      case 'select':
        return (
          <Select onValueChange={(value) => handleAnswer(currentQuestion.key, value)} value={answers[currentQuestion.key]}>
            <SelectTrigger className="w-full text-lg p-6">
              <SelectValue placeholder={t('quiz_industry_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'choice':
      case 'conditional_choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.key, option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  answers[currentQuestion.key] === option.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-background hover:border-primary hover:bg-primary/5'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold">{option.label}</span>
              </motion.button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title_quiz')}</title>
        <meta name="description" content={t('meta_desc_quiz')} />
      </Helmet>
      <div className="min-h-[calc(100vh-112px)] flex flex-col items-center justify-center bg-secondary/40 p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="relative h-2 bg-gray-200 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <Card className="shadow-2xl rounded-2xl overflow-hidden border">
            <CardContent className="p-8 md:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={{
                    initial: (direction) => ({ opacity: 0, x: `${direction * 100}%` }),
                    in: { opacity: 1, x: 0 },
                    out: (direction) => ({ opacity: 0, x: `${direction * -100}%` }),
                  }}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
                >
                  {step < quizQuestions.length ? (
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{currentQuestion.question}</h2>
                      {renderQuestion()}
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold mb-4">{t('quiz_thank_you')}</h2>
                      <p className="text-lg text-muted-foreground mb-8">{t('quiz_summary_intro')}</p>
                      <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8 text-left">
                        <h3 className="text-2xl font-bold text-primary capitalize">{t('quiz_summary_package', { projectType: answers.projectType?.replace('-', ' ') })}</h3>
                        <ul className="mt-4 space-y-2 text-muted-foreground">
                          <li><strong>{t('quiz_summary_industry')}</strong> <span className="text-foreground capitalize">{answers.industry?.replace('_', ' ')}</span></li>
                          <li><strong>{t('quiz_summary_location')}</strong> <span className="text-foreground">{answers.location}</span></li>
                          <li><strong>{t('quiz_summary_budget')}</strong> <span className="text-foreground">{answers.budget}</span></li>
                          <li><strong>{t('quiz_summary_timeline')}</strong> <span className="text-foreground capitalize">{answers.timeline?.replace('-', ' ')}</span></li>
                        </ul>
                      </div>
                      <p className="text-muted-foreground mb-8">{t('quiz_summary_cta_text')}</p>
                      <Button asChild size="lg" className="font-bold">
                        <Link to="/contact">
                          {t('quiz_summary_cta_button')} <Send className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('quiz_back_button')}
            </Button>
            {step < quizQuestions.length && (
              <Button onClick={nextStep} disabled={isNextDisabled}>
                {t('quiz_next_button')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;