from django.urls import path
from . import views

urlpatterns = [
    path('', views.recruitment_dashboard, name='recruitment_dashboard'),
    path('api/process/', views.process_cvs, name='recruitment_process_cvs'),
    # Interview scheduling endpoints
    path('api/interviews/schedule/', views.schedule_interview, name='schedule_interview'),
    path('api/interviews/<int:interview_id>/', views.get_interview_details, name='get_interview_details'),
    path('api/interviews/confirm/', views.confirm_interview_slot, name='confirm_interview_slot'),
    # Follow-up reminders are sent automatically via management command
    # path('api/interviews/<int:interview_id>/reminder/', views.send_followup_reminder, name='send_followup_reminder'),
    path('api/interviews/', views.list_interviews, name='list_interviews'),
    # Public candidate slot selection page (no auth required)
    path('interview/select/<str:token>/', views.candidate_select_slot, name='candidate_select_slot'),
]


