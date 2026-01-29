# recruitment_agent/migrations/0019_alter_recruiterinterviewsettings_company_user_and_more.py

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0028_merge_20260122_2132'),
        ('recruitment_agent', '0018_recruiterinterviewsettings_job_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Drop the existing index first
        migrations.RunSQL(
            sql="DROP INDEX IF EXISTS recruitment_agent_recruiterinterviewsettings_recruiter_id_b57b8a19 ON recruitment_agent_recruiterinterviewsettings;",
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.AlterField(
            model_name='recruiterinterviewsettings',
            name='company_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='recruiter_interview_settings_company', to='core.companyuser'),
        ),
        migrations.AlterField(
            model_name='recruiterinterviewsettings',
            name='recruiter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='recruiter_interview_settings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='recruiterinterviewsettings',
            constraint=models.UniqueConstraint(condition=models.Q(('job__isnull', True)), fields=('company_user',), name='unique_company_user_no_job_settings'),
        ),
    ]