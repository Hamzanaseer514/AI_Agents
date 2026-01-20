import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Link as LinkIcon, Wand2, Users, Shield, FileText, FilePlus, X, Loader2, CheckCircle2, DollarSign, Clock, Users as UsersIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const FormSection = ({ title, children }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-semibold font-heading text-foreground">{title}</h3>
        <div className="space-y-6">{children}</div>
    </div>
);

const AiPredictorForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [projectType, setProjectType] = useState('');
  const [qualityPriorities, setQualityPriorities] = useState([]);
  const [startDate, setStartDate] = useState();
  const [launchDate, setLaunchDate] = useState();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  
  // Form state
  const [briefUrl, setBriefUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [coreFunctionality, setCoreFunctionality] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [contingencyBuffer, setContingencyBuffer] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [securityLevel, setSecurityLevel] = useState('');
  const [postLaunch, setPostLaunch] = useState(false);
  const [email, setEmail] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });
  
  const removeFile = (file) => {
    setFiles(files.filter(f => f !== file));
  };


  const handleQualityPriorityChange = (priority) => {
    setQualityPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      }
      if (prev.length < 3) {
        return [...prev, priority];
      }
      return prev;
    });
  };

  const handleIntegrationChange = (integrationId) => {
    setIntegrations(prev => {
      if (prev.includes(integrationId)) {
        return prev.filter(id => id !== integrationId);
      }
      return [...prev, integrationId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!projectType) {
      toast({
        title: "Validation Error",
        description: "Please select a project type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Import the service
      const { default: aiPredictorService } = await import('@/services/aiPredictorService');
      
      const formData = {
        email: email.trim() || undefined, // Only include if provided
        projectType,
        goal,
        coreFunctionality,
        briefUrl,
        qualityPriorities,
        integrations,
        teamSize,
        contingencyBuffer: contingencyBuffer ? parseInt(contingencyBuffer) : 20,
        securityLevel,
        startDate: startDate ? startDate.toISOString() : null,
        launchDate: launchDate ? launchDate.toISOString() : null,
        postLaunch,
      };

      const result = await aiPredictorService.getPrediction(formData);
      console.log('Prediction result received:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', result ? Object.keys(result) : 'null');
      
      // The service should already extract response.data, so result should be the prediction object
      // But let's handle both cases: if result has data property or if it's the prediction directly
      let predictionData = result;
      
      // Check if result has nested data property (backend returns { status: 'success', data: {...} })
      if (result && result.data && typeof result.data === 'object' && !result.predictedCost) {
        predictionData = result.data;
        console.log('Using nested data property from result');
      }
      
      // Check if result itself is the response wrapper
      if (predictionData && predictionData.status === 'success' && predictionData.data) {
        predictionData = predictionData.data;
        console.log('Extracting from status wrapper');
      }
      
      console.log('Final prediction data to display:', predictionData);
      console.log('PredictedCost value:', predictionData?.predictedCost);
      console.log('PredictedDuration value:', predictionData?.predictedDuration);
      
      // More lenient validation - just check if we have an object
      if (!predictionData || typeof predictionData !== 'object') {
        console.error('❌ Invalid prediction result - not an object:', predictionData);
        toast({
          title: "❌ Error",
          description: `Invalid response from server. Received: ${typeof predictionData}`,
          variant: "destructive",
        });
        return;
      }
      
      // Check if we have at least one prediction field
      const hasPredictionFields = predictionData.predictedCost !== undefined || 
                                  predictionData.predictedDuration || 
                                  predictionData.predictedTeamSize ||
                                  predictionData.predictionConfidence !== undefined ||
                                  (predictionData.breakdown && typeof predictionData.breakdown === 'object');
      
      // If no prediction fields found, try extracting from data one more time
      if (!hasPredictionFields && predictionData.data && typeof predictionData.data === 'object') {
        console.log('Trying nested data one more time:', predictionData.data);
        predictionData = predictionData.data;
      }
      
      // Final check - if still no fields, show helpful error
      const finalHasFields = predictionData.predictedCost !== undefined || 
                             predictionData.predictedDuration || 
                             predictionData.predictedTeamSize ||
                             predictionData.predictionConfidence !== undefined;
      
      if (!finalHasFields) {
        console.error('❌ Invalid prediction result - missing all prediction fields');
        console.error('Available keys:', Object.keys(predictionData));
        console.error('Full data:', JSON.stringify(predictionData, null, 2));
        toast({
          title: "❌ Error",
          description: `Server response missing prediction data. Keys received: ${Object.keys(predictionData).join(', ')}. Please check console for details.`,
          variant: "destructive",
        });
        return;
      }
      
      // Success! Set the prediction data
      console.log('✅ Valid prediction data found, setting state');
      setPredictionResult(predictionData);
      
      toast({
        title: "✅ Prediction Generated",
        description: "Your AI prediction has been calculated successfully!",
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const projectTypes = [
    { value: 'website', label: t('predictor_pt_website') },
    { value: 'mobile_app', label: t('predictor_pt_mobile_app') },
    { value: 'saas_module', label: t('predictor_pt_saas_module') },
    { value: 'ecommerce', label: t('predictor_pt_ecommerce') },
    { value: 'integration_api', label: t('predictor_pt_integration_api') },
    { value: 'cyber_security', label: t('predictor_pt_cyber_security') },
    { value: 'r_and_d', label: t('predictor_pt_r_and_d') },
    { value: 'education', label: t('predictor_pt_education') },
    { value: 'sales', label: t('predictor_pt_sales') },
    { value: 'games_dev', label: t('predictor_pt_games_dev') },
    { value: 'revamp_migration', label: t('predictor_pt_revamp_migration') },
    { value: 'ai_app', label: t('predictor_pt_ai_app') },
    { value: 'other', label: t('predictor_pt_other') },
  ];

  const qualityOptions = [
    { id: 'reliability', label: t('predictor_quality_reliability') },
    { id: 'performance', label: t('predictor_quality_performance') },
    { id: 'usability', label: t('predictor_quality_usability') },
    { id: 'security', label: t('predictor_quality_security') },
    { id: 'maintainability', label: t('predictor_quality_maintainability') },
    { id: 'portability', label: t('predictor_quality_portability') },
    { id: 'compatibility', label: t('predictor_quality_compatibility') },
    { id: 'functional_suitability', label: t('predictor_quality_functional_suitability') },
  ];

  const integrationOptions = [
    { id: 'payments', label: t('predictor_integration_payments') },
    { id: 'auth_sso', label: t('predictor_integration_auth_sso') },
    { id: 'crm_erp', label: t('predictor_integration_crm_erp') },
    { id: 'analytics', label: t('predictor_integration_analytics') },
    { id: 'cms', label: t('predictor_integration_cms') },
    { id: 'other_apis', label: t('predictor_integration_other_apis') },
  ];

  return (
    <div className="space-y-8">
    <form onSubmit={handleSubmit} className="space-y-12">
      <FormSection title={t('predictor_section_brief')}>
        <div className="space-y-4">
            <Label>{t('predictor_upload_brief', 'Upload Project Brief')}</Label>
            <div {...getRootProps()} className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <input {...getInputProps()} />
                <div className="text-center">
                    <FilePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">{t('predictor_dropzone_text', 'Drag & drop files here, or click to select files')}</p>
                </div>
            </div>
             {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">{t('predictor_uploaded_files', 'Uploaded Files:')}</h4>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-foreground truncate">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <div className="relative">
             <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               type="text" 
               placeholder={t('predictor_brief_url')} 
               className="h-12 pl-10"
               value={briefUrl}
               onChange={(e) => setBriefUrl(e.target.value)}
             />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="your.email@example.com (optional, for updates)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Provide your email if you'd like to receive the prediction results via email
          </p>
        </div>
      </FormSection>

      <FormSection title={t('predictor_section_details')}>
        <div className="space-y-4">
          <Label htmlFor="project-type">{t('predictor_project_type_label')}</Label>
          <Select onValueChange={setProjectType}>
            <SelectTrigger id="project-type">
              <SelectValue placeholder={t('predictor_project_type_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(pt => <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <AnimatePresence>
          {projectType === 'ai_app' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary flex items-center"><Wand2 className="mr-2 h-5 w-5" />{t('predictor_ai_addons_title')}</h4>
                <p className="text-sm text-muted-foreground mt-2">{t('predictor_ai_addons_desc')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-2">
          <Label htmlFor="goal">{t('predictor_goal_label')}</Label>
          <Input 
            id="goal" 
            placeholder={t('predictor_goal_placeholder')}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="core-functionality">{t('predictor_core_functionality_label', 'Core Functionality')}</Label>
            <Input 
              id="core-functionality" 
              placeholder={t('predictor_core_functionality_placeholder', 'e.g., User authentication, product catalog, real-time chat')}
              value={coreFunctionality}
              onChange={(e) => setCoreFunctionality(e.target.value)}
            />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliverables">{t('predictor_deliverables_label')}</Label>
          <Input id="deliverables" disabled placeholder={t('predictor_deliverables_placeholder')} />
        </div>
      </FormSection>

      <FormSection title={t('predictor_section_optional')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team-size" className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" />{t('predictor_team_size_label', 'Preferred Team Size')}</Label>
            <Select value={teamSize} onValueChange={setTeamSize}>
              <SelectTrigger id="team-size">
                <SelectValue placeholder={t('predictor_team_size_placeholder', 'Select team size')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (1-3 people)</SelectItem>
                <SelectItem value="medium">Medium (4-7 people)</SelectItem>
                <SelectItem value="large">Large (8+ people)</SelectItem>
                <SelectItem value="dont_know">Don't Know</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contingency-buffer" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-muted-foreground" />{t('predictor_contingency_label', 'Contingency Buffer')}</Label>
            <Select value={contingencyBuffer} onValueChange={setContingencyBuffer}>
              <SelectTrigger id="contingency-buffer">
                <SelectValue placeholder={t('predictor_contingency_placeholder', 'Select contingency buffer')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10% (Standard)</SelectItem>
                <SelectItem value="20">20% (Recommended)</SelectItem>
                <SelectItem value="30">30% (For complex projects)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{t('predictor_integrations_label')}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {integrationOptions.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`pred-${item.id}`}
                  checked={integrations.includes(item.id)}
                  onCheckedChange={() => handleIntegrationChange(item.id)}
                />
                <Label htmlFor={`pred-${item.id}`} className="font-normal">{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>{t('predictor_quality_label')} (Max 3)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {qualityOptions.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`pred-${item.id}`}
                  checked={qualityPriorities.includes(item.id)}
                  onCheckedChange={() => handleQualityPriorityChange(item.id)}
                  disabled={!qualityPriorities.includes(item.id) && qualityPriorities.length >= 3}
                />
                <Label htmlFor={`pred-${item.id}`} className="font-normal">{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="security-level">{t('predictor_security_label')}</Label>
          <Select value={securityLevel} onValueChange={setSecurityLevel}>
            <SelectTrigger id="security-level">
              <SelectValue placeholder={t('predictor_security_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="l1">{t('predictor_security_l1')}</SelectItem>
              <SelectItem value="l2">{t('predictor_security_l2')}</SelectItem>
              <SelectItem value="l3">{t('predictor_security_l3')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>{t('predictor_start_date_label')}</Label>
                <DatePicker date={startDate} setDate={setStartDate} placeholder={t('predictor_date_placeholder')} />
            </div>
            <div className="space-y-2">
                <Label>{t('predictor_launch_date_label')}</Label>
                <DatePicker date={launchDate} setDate={setLaunchDate} placeholder={t('predictor_date_placeholder')} />
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assumptions">{t('predictor_assumptions_label')}</Label>
          <Input id="assumptions" disabled placeholder={t('predictor_assumptions_placeholder')} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="post-launch" checked={postLaunch} onCheckedChange={setPostLaunch} />
          <Label htmlFor="post-launch">{t('predictor_post_launch_label')}</Label>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="font-bold" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Prediction...
            </>
          ) : (
            <>
              {t('predictor_submit_button', 'Get AI Prediction')}
              <Wand2 className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </form>

    {/* Prediction Results */}
    {predictionResult && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              AI Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Estimated Cost</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-50 mt-1">
                        ${predictionResult.predictedCost?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">Duration</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-50 mt-1">
                        {predictionResult.predictedDuration || 'N/A'}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Team Size</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-50 mt-1">
                        {predictionResult.predictedTeamSize || 'N/A'}
                      </p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Confidence</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-50 mt-1">
                        {predictionResult.predictionConfidence ? `${predictionResult.predictionConfidence}%` : 'N/A'}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {predictionResult.breakdown && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2 text-foreground">Project Breakdown</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(predictionResult.breakdown).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Button 
                onClick={() => setPredictionResult(null)} 
                variant="outline"
                className="flex-1"
              >
                Generate New Prediction
              </Button>
              <Button 
                onClick={() => window.print()} 
                variant="secondary"
                className="flex-1"
              >
                Print Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}
    </div>
  );
};

export default AiPredictorForm;