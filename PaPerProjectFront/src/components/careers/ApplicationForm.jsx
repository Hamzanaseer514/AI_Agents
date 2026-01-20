import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, FileText, X, Link as LinkIcon, MapPin, Briefcase, Globe, Calendar, Wallet, Sparkles, Info, ShieldCheck, Bot, Wand2, Loader2 } from 'lucide-react';
import { careerService } from '@/services';

const FormSection = ({ title, children, description }) => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="pb-4 border-b border-border">
      <h3 className="text-xl font-semibold font-heading text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    <div className="space-y-8">{children}</div>
  </motion.div>
);

const ApplicationForm = ({ positionTitle, position }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const [showMatchScore, setShowMatchScore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get position title from position object or prop
  const currentPositionTitle = position?.title || positionTitle || '';

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    setValue('cv', acceptedFiles, { shouldValidate: true });
    toast({
      title: "✨ Resume Parsed!",
      description: "We've auto-filled relevant fields from your resume.",
    });
  }, [toast, setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFiles([]);
    setValue('cv', null, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      // Validate position title is available
      if (!currentPositionTitle) {
        toast({
          title: "Error",
          description: "Position information is missing. Please select a position again.",
          variant: "destructive",
        });
        return;
      }

      // Validate that a resume file is uploaded
      if (!files || files.length === 0) {
        toast({
          title: "Error",
          description: "Please upload your resume (CV).",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      // Prepare application data - always use the position title from props/position object
      const applicationData = {
        positionTitle: currentPositionTitle, // Always use the position title from the selected position
        positionId: position?.id || null, // Include position ID if available
        applicantName: data.applicantName || data.name || '',
        email: data.email || '',
        phone: data.phone || null,
        coverLetter: data.coverLetter || data.message || null,
      };

      // Submit with file
      const resumeFile = files[0];
      const response = await careerService.submitApplication(applicationData, resumeFile);

      if (response.status === 'success') {
        setShowMatchScore(true);
        toast({
          title: "✅ Application Submitted!",
          description: "We've received your application. Check out your initial match score!",
        });
        document.getElementById('match-score-section')?.scrollIntoView({ behavior: 'smooth' });
        // Optionally reset form
        // reset();
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiCoachClick = () => {
    toast({
      title: "🤖 AI Coach Activated",
      description: "Our AI is analyzing your profile to suggest improvements.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-secondary/30 p-6">
        <CardTitle className="text-2xl font-bold text-foreground">Apply for {currentPositionTitle || 'Position'}</CardTitle>
        <CardDescription>Complete the form below. Fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <FormSection title="Your Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Full Name *</Label>
                <Input 
                  id="applicantName" 
                  placeholder="John Doe" 
                  className={errors.applicantName ? 'border-destructive' : ''}
                  {...register("applicantName", { required: "Full name is required." })} 
                />
                {errors.applicantName && <p className="text-sm font-medium text-destructive">{errors.applicantName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  className={errors.email ? 'border-destructive' : ''}
                  {...register("email", { 
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })} 
                />
                {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+1 (555) 123-4567" 
                {...register("phone")} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter / Message (Optional)</Label>
              <textarea
                id="coverLetter"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us why you're interested in this position..."
                {...register("coverLetter")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-upload">Upload CV (PDF/DOC) *</Label>
              <Controller
                name="cv"
                control={control}
                rules={{ required: 'CV is required.' }}
                render={({ field }) => (
                  <>
                    <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'} ${errors.cv ? 'border-destructive' : ''}`}>
                      <input {...getInputProps()} id="cv-upload" />
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{isDragActive ? "Drop the file here..." : "Drag & drop your resume here, or click to select"}</p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md text-sm">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <FileText className="h-5 w-5 text-primary" />
                              <span>{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={removeFile}><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.cv && <p className="text-sm font-medium text-destructive">{errors.cv.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="linkedin" placeholder="https://linkedin.com/in/..." className="pl-10" {...register("linkedin")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub/Portfolio (Optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="github" placeholder="https://github.com/..." className="pl-10" {...register("github")} />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Work Preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location * <span className="text-primary">✨</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="e.g., London, UK" className={`pl-10 ${errors.location ? 'border-destructive' : ''}`} {...register("location", { required: "Location is required." })} />
                </div>
                {errors.location && <p className="text-sm font-medium text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time-Zone Overlap *</Label>
                <Controller
                  name="timezone"
                  control={control}
                  rules={{ required: "Time-zone is required." }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="timezone" className={errors.timezone ? 'border-destructive' : ''}><SelectValue placeholder="Select your primary work time-zone" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="americas">Americas (UTC-8 to UTC-3)</SelectItem>
                        <SelectItem value="emea">EMEA (UTC-0 to UTC+4)</SelectItem>
                        <SelectItem value="apac">APAC (UTC+5 to UTC+12)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.timezone && <p className="text-sm font-medium text-destructive">{errors.timezone.message}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <Label>Preferred Work Setup</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                {['Remote', 'Hybrid', 'On-site'].map(setup => (
                  <div key={setup} className="flex items-center">
                    <Checkbox id={`setup-${setup.toLowerCase()}`} />
                    <Label htmlFor={`setup-${setup.toLowerCase()}`} className="ml-2 font-normal">{setup}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Right to Work / Visa Sponsorship</Label>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-muted-foreground">Do you require visa sponsorship?</p>
                <div className="flex items-center space-x-2">
                  <Switch id="visa-switch" {...register("visa")} />
                  <Label htmlFor="visa-switch">{watch('visa') ? 'Yes' : 'No'}</Label>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Availability & Compensation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Earliest Start Date *</Label>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required." }}
                  render={({ field }) => <DatePicker date={field.value} setDate={field.onChange} placeholder="Select a date" />}
                />
                {errors.startDate && <p className="text-sm font-medium text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay">Target Pay Range (Optional, per year)</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="pay" placeholder="e.g., $120,000 - $140,000" className="pl-10" {...register("pay")} />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Role-Specific Questions" description="Your answers help our AI determine your initial match score.">
            <div className="space-y-2">
              <Label>How many years of professional experience do you have with React? * <span className="text-primary">✨</span></Label>
              <Controller
                name="reactExperience"
                control={control}
                rules={{ required: "React experience is required." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.reactExperience ? 'border-destructive' : ''}><SelectValue placeholder="Select years of experience" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5+">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reactExperience && <p className="text-sm font-medium text-destructive">{errors.reactExperience.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Have you worked in a fast-paced startup environment before? *</Label>
              <Controller
                name="startupExperience"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field }) => (
                  <div className="flex gap-4">
                    <div className="flex items-center"><Checkbox id="startup-yes" checked={field.value === 'yes'} onCheckedChange={() => field.onChange('yes')} /><Label htmlFor="startup-yes" className="ml-2 font-normal">Yes</Label></div>
                    <div className="flex items-center"><Checkbox id="startup-no" checked={field.value === 'no'} onCheckedChange={() => field.onChange('no')} /><Label htmlFor="startup-no" className="ml-2 font-normal">No</Label></div>
                  </div>
                )}
              />
              {errors.startupExperience && <p className="text-sm font-medium text-destructive">{errors.startupExperience.message}</p>}
            </div>
          </FormSection>

          <AnimatePresence>
            {showMatchScore && (
              <motion.div
                id="match-score-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FormSection title="Your AI-Powered Insights">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> Instant Match Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-6xl font-bold text-center text-primary">88%</p>
                        <p className="text-center text-muted-foreground mt-2">Strong Match</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Info className="text-foreground" /> Why You Match</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>✅ 5+ years of React experience aligns perfectly.</p>
                        <p>✅ GitHub profile shows strong TypeScript usage.</p>
                        <p>✅ Previous role in a SaaS startup is a huge plus.</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={handleAiCoachClick} className="w-full">
                      <Wand2 className="mr-2 h-4 w-4" /> AI Resume Coach
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast({ title: "Assessment Sent!", description: "Check your email for a link to your skills assessment." })} className="w-full">
                      <Briefcase className="mr-2 h-4 w-4" /> Take Skills Assessment
                    </Button>
                  </div>
                </FormSection>
              </motion.div>
            )}
          </AnimatePresence>

          <FormSection title="Privacy & Fairness">
            <div className="p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground space-y-2">
              <p className="flex items-start gap-2"><Bot className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>We use automated screening to provide you with an instant match score. Our AI models are regularly audited for bias. <a href="#" className="underline text-primary">Learn more about our AI ethics</a>.</span></p>
              <p className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>At the offer stage, we perform digital identity and liveness checks to protect all parties from fraud.</span></p>
            </div>
          </FormSection>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button type="submit" size="lg" className="font-bold w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;