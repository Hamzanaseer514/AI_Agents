"""
Django management command to send automated interview reminders.

This command should be run periodically (e.g., via cron) to:
1. Send follow-up reminders for pending interviews (after 24 hours)
2. Send pre-interview reminders (24 hours and 1 hour before scheduled interviews)

Usage:
    python manage.py send_interview_reminders
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from recruitment_agent.models import Interview
from recruitment_agent.agents.interview_scheduling import InterviewSchedulingAgent
from recruitment_agent.log_service import LogService


class Command(BaseCommand):
    help = 'Send automated interview reminders (follow-ups and pre-interview reminders)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run without actually sending emails',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        log_service = LogService()
        interview_agent = InterviewSchedulingAgent(log_service=log_service)
        
        self.stdout.write(self.style.SUCCESS('Starting interview reminder process...'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No emails will be sent'))
        
        # 1. Send follow-up reminders for pending interviews (after 24 hours)
        # AUTOMATIC: These are sent automatically - no manual action needed
        self.stdout.write('\n1. Automatically checking for pending interviews needing follow-up...')
        pending_interviews = Interview.objects.filter(
            status='PENDING',
            invitation_sent_at__isnull=False
        )
        
        followup_count = 0
        for interview in pending_interviews:
            time_since_invitation = timezone.now() - interview.invitation_sent_at
            # Send follow-up if it's been more than 24 hours and no reminder sent in last 12 hours
            if time_since_invitation >= timedelta(hours=24):
                if not interview.last_reminder_sent_at or \
                   (timezone.now() - interview.last_reminder_sent_at) >= timedelta(hours=12):
                    if not dry_run:
                        result = interview_agent.send_followup_reminder(interview.id)
                        if result.get('success'):
                            followup_count += 1
                            self.stdout.write(
                                self.style.SUCCESS(f'  ✓ Automatically sent follow-up to {interview.candidate_name} ({interview.candidate_email})')
                            )
                        else:
                            self.stdout.write(
                                self.style.ERROR(f'  ✗ Failed to send follow-up to {interview.candidate_name}: {result.get("error")}')
                            )
                    else:
                        followup_count += 1
                        self.stdout.write(
                            self.style.WARNING(f'  [DRY RUN] Would automatically send follow-up to {interview.candidate_name} ({interview.candidate_email})')
                        )
        
        self.stdout.write(self.style.SUCCESS(f'  Automatic follow-up reminders sent: {followup_count}'))
        
        # 2. Send pre-interview reminders (24 hours before)
        self.stdout.write('\n2. Checking for interviews needing 24-hour reminder...')
        scheduled_interviews_24h = Interview.objects.filter(
            status='SCHEDULED',
            scheduled_datetime__isnull=False,
            scheduled_datetime__gt=timezone.now(),
            scheduled_datetime__lte=timezone.now() + timedelta(hours=25),  # Within next 25 hours
        )
        
        reminder_24h_count = 0
        for interview in scheduled_interviews_24h:
            hours_until = (interview.scheduled_datetime - timezone.now()).total_seconds() / 3600
            # Send if between 23-25 hours before
            if 23 <= hours_until <= 25:
                if not dry_run:
                    result = interview_agent.send_pre_interview_reminder(interview.id, hours_before=24)
                    if result.get('success'):
                        reminder_24h_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'  ✓ Sent 24h reminder to {interview.candidate_name} ({interview.candidate_email})')
                        )
                    else:
                        self.stdout.write(
                            self.style.ERROR(f'  ✗ Failed to send 24h reminder to {interview.candidate_name}: {result.get("error")}')
                        )
                else:
                    reminder_24h_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'  [DRY RUN] Would send 24h reminder to {interview.candidate_name} ({interview.candidate_email})')
                    )
        
        self.stdout.write(self.style.SUCCESS(f'  24-hour reminders: {reminder_24h_count}'))
        
        # 3. Send pre-interview reminders (1 hour before)
        self.stdout.write('\n3. Checking for interviews needing 1-hour reminder...')
        scheduled_interviews_1h = Interview.objects.filter(
            status='SCHEDULED',
            scheduled_datetime__isnull=False,
            scheduled_datetime__gt=timezone.now(),
            scheduled_datetime__lte=timezone.now() + timedelta(hours=2),  # Within next 2 hours
        )
        
        reminder_1h_count = 0
        for interview in scheduled_interviews_1h:
            hours_until = (interview.scheduled_datetime - timezone.now()).total_seconds() / 3600
            # Send if between 0.5-2 hours before
            if 0.5 <= hours_until <= 2:
                if not dry_run:
                    result = interview_agent.send_pre_interview_reminder(interview.id, hours_before=1)
                    if result.get('success'):
                        reminder_1h_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'  ✓ Sent 1h reminder to {interview.candidate_name} ({interview.candidate_email})')
                        )
                    else:
                        self.stdout.write(
                            self.style.ERROR(f'  ✗ Failed to send 1h reminder to {interview.candidate_name}: {result.get("error")}')
                        )
                else:
                    reminder_1h_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'  [DRY RUN] Would send 1h reminder to {interview.candidate_name} ({interview.candidate_email})')
                    )
        
        self.stdout.write(self.style.SUCCESS(f'  1-hour reminders: {reminder_1h_count}'))
        
        # Summary
        total = followup_count + reminder_24h_count + reminder_1h_count
        self.stdout.write('\n' + self.style.SUCCESS(f'✓ Reminder process complete. Total reminders: {total}'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING('This was a DRY RUN - no emails were actually sent'))

