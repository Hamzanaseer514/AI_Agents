import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, Calendar, Save } from 'lucide-react';
import { 
  getEmailSettings, 
  updateEmailSettings, 
  getInterviewSettings, 
  updateInterviewSettings 
} from '@/services/recruitmentAgentService';

const RecruiterSettings = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    followup_delay_hours: 48,
    min_hours_between_followups: 24,
    max_followup_emails: 3,
    reminder_hours_before: 24,
    auto_send_followups: true,
    auto_send_reminders: true,
  });
  const [interviewSettings, setInterviewSettings] = useState({
    schedule_from_date: '',
    schedule_to_date: '',
    start_time: '09:00',
    end_time: '17:00',
    interview_time_gap: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [emailRes, interviewRes] = await Promise.all([
        getEmailSettings(),
        getInterviewSettings(),
      ]);

      if (emailRes.status === 'success') {
        setEmailSettings(emailRes.data);
      }
      if (interviewRes.status === 'success') {
        const data = interviewRes.data;
        setInterviewSettings({
          schedule_from_date: data.schedule_from_date || '',
          schedule_to_date: data.schedule_to_date || '',
          start_time: data.start_time || '09:00',
          end_time: data.end_time || '17:00',
          interview_time_gap: data.interview_time_gap || 30,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      setSaving(true);
      const response = await updateEmailSettings(emailSettings);
      if (response.status === 'success') {
        toast({
          title: 'Success',
          description: 'Email settings saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save email settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInterviewSettings = async () => {
    try {
      setSaving(true);
      const response = await updateInterviewSettings(interviewSettings);
      if (response.status === 'success') {
        toast({
          title: 'Success',
          description: 'Interview settings saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving interview settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save interview settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email Settings
          </TabsTrigger>
          <TabsTrigger value="interview">
            <Calendar className="h-4 w-4 mr-2" />
            Interview Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email timing preferences for follow-ups and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="followup_delay">Follow-up Delay (hours)</Label>
                  <Input
                    id="followup_delay"
                    type="number"
                    step="0.1"
                    value={emailSettings.followup_delay_hours}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      followup_delay_hours: parseFloat(e.target.value) || 0,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Hours to wait before sending first follow-up email for unconfirmed interviews
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_hours_between">Min Hours Between Follow-ups</Label>
                  <Input
                    id="min_hours_between"
                    type="number"
                    step="0.1"
                    value={emailSettings.min_hours_between_followups}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      min_hours_between_followups: parseFloat(e.target.value) || 0,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum hours between follow-up emails
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_followups">Max Follow-up Emails</Label>
                  <Input
                    id="max_followups"
                    type="number"
                    value={emailSettings.max_followup_emails}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      max_followup_emails: parseInt(e.target.value) || 0,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of follow-up emails to send
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder_hours">Reminder Hours Before Interview</Label>
                  <Input
                    id="reminder_hours"
                    type="number"
                    step="0.1"
                    value={emailSettings.reminder_hours_before}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      reminder_hours_before: parseFloat(e.target.value) || 0,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Hours before scheduled interview to send reminder email
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_followups">Auto-send Follow-ups</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically send follow-up emails for unconfirmed interviews
                    </p>
                  </div>
                  <Switch
                    id="auto_followups"
                    checked={emailSettings.auto_send_followups}
                    onCheckedChange={(checked) => setEmailSettings({
                      ...emailSettings,
                      auto_send_followups: checked,
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_reminders">Auto-send Reminders</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically send pre-interview reminder emails
                    </p>
                  </div>
                  <Switch
                    id="auto_reminders"
                    checked={emailSettings.auto_send_reminders}
                    onCheckedChange={(checked) => setEmailSettings({
                      ...emailSettings,
                      auto_send_reminders: checked,
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveEmailSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Email Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview">
          <Card>
            <CardHeader>
              <CardTitle>Interview Settings</CardTitle>
              <CardDescription>
                Configure interview scheduling preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule_from">Schedule From Date</Label>
                    <Input
                      id="schedule_from"
                      type="date"
                      value={interviewSettings.schedule_from_date}
                      onChange={(e) => setInterviewSettings({
                        ...interviewSettings,
                        schedule_from_date: e.target.value,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Start date for scheduling (leave empty for today)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule_to">Schedule To Date</Label>
                    <Input
                      id="schedule_to"
                      type="date"
                      value={interviewSettings.schedule_to_date}
                      onChange={(e) => setInterviewSettings({
                        ...interviewSettings,
                        schedule_to_date: e.target.value,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      End date for scheduling (leave empty for no limit)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={interviewSettings.start_time}
                      onChange={(e) => setInterviewSettings({
                        ...interviewSettings,
                        start_time: e.target.value,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Start time of day for interviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={interviewSettings.end_time}
                      onChange={(e) => setInterviewSettings({
                        ...interviewSettings,
                        end_time: e.target.value,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      End time of day for interviews
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_gap">Interview Time Gap (minutes)</Label>
                  <Input
                    id="time_gap"
                    type="number"
                    value={interviewSettings.interview_time_gap}
                    onChange={(e) => setInterviewSettings({
                      ...interviewSettings,
                      interview_time_gap: parseInt(e.target.value) || 30,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time gap between interview slots in minutes
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveInterviewSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Interview Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruiterSettings;


