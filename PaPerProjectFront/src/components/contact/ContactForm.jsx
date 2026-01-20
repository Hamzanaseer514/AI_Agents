import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Send, BrainCircuit, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';
import { contactService } from '@/services';

const ContactForm = () => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: '' });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const correctAnswer = captcha.num1 + captcha.num2;
    if (parseInt(captcha.answer, 10) !== correctAnswer) {
      setCaptchaError(t('contact_form_captcha_error') || 'Incorrect answer. Please try again.');
      generateCaptcha();
      return;
    }

    setCaptchaError('');
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const contactData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectTitle: formData.get('projectTitle'),
      message: formData.get('description'),
    };

    // Get file if uploaded
    const file = fileInputRef.current?.files?.[0] || null;

    try {
      const response = await contactService.submitContactForm(contactData, file);
      
      if (response.status === 'success') {
        toast({
          title: "✅ Message Sent!",
          description: response.message || "Our team has received your project details and will be in touch shortly.",
        });
        setFileName('');
        e.target.reset();
        generateCaptcha();
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "❌ Error",
        description: error.data?.message || error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-xl border rounded-2xl bg-card">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">{t('contact_form_title')}</CardTitle>
          <CardDescription>{t('contact_form_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
            <div className="flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">{t('contact_form_name_label')} <span className="text-destructive">*</span></Label>
                  <Input id="fullName" name="fullName" type="text" placeholder="John Doe" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="email">{t('contact_form_email_label')} <span className="text-destructive">*</span></Label>
                  <Input id="email" name="email" type="email" placeholder="you@company.com" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('contact_form_phone_label')}</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="projectTitle">{t('contact_form_project_title_label')} <span className="text-destructive">*</span></Label>
                <Input id="projectTitle" name="projectTitle" type="text" placeholder="e.g., 'Need branding + website for AI startup'" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="description">{t('contact_form_project_desc_label')} <span className="text-destructive">*</span></Label>
                <textarea id="description" name="description" placeholder="What are you trying to build? What’s the goal or pain point?" className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">{t('contact_form_budget_label')} <span className="text-destructive">*</span></Label>
                  <Select name="budget" required>
                    <SelectTrigger id="budget" className="mt-1">
                      <SelectValue placeholder={t('contact_form_budget_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<500">{t('contact_form_budget_option1')}</SelectItem>
                      <SelectItem value="500-1000">{t('contact_form_budget_option2')}</SelectItem>
                      <SelectItem value="1000-5000">{t('contact_form_budget_option3')}</SelectItem>
                      <SelectItem value="5000-10000">{t('contact_form_budget_option4')}</SelectItem>
                      <SelectItem value="10000+">{t('contact_form_budget_option5')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeline">{t('contact_form_timeline_label')} <span className="text-destructive">*</span></Label>
                  <Select name="timeline" required>
                    <SelectTrigger id="timeline" className="mt-1">
                      <SelectValue placeholder={t('contact_form_timeline_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1-month">{t('contact_form_timeline_option1')}</SelectItem>
                      <SelectItem value="2-4-months">{t('contact_form_timeline_option2')}</SelectItem>
                      <SelectItem value="4-6-months">{t('contact_form_timeline_option3')}</SelectItem>
                      <SelectItem value="dont-know">{t('contact_form_timeline_option4')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="file-upload">{t('contact_form_file_label')}</Label>
                <div className="mt-1">
                  <Button type="button" variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {fileName || t('contact_form_file_placeholder')}
                  </Button>
                  <Input
                    id="file-upload"
                    name="fileUpload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                  />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="captcha" className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  {t('contact_form_captcha_label', { num1: captcha.num1, num2: captcha.num2 })} <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="captcha" 
                  type="number" 
                  value={captcha.answer}
                  onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
                  placeholder={t('contact_form_captcha_answer_placeholder')}
                  required 
                  className="w-full md:w-1/2"
                />
                {captchaError && <p className="text-sm text-destructive">{captchaError}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="font-bold w-full md:w-auto shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {t('contact_form_button') || 'Send Message'} 
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactForm;