from django.urls import path
from roadmap.views import *

urlpatterns = [
    path('getCourseRecom', getRecommendation.as_view(), name='udemy_Web_Scrape')
]
