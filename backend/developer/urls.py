from django.urls import path
from .views import RNDReview

urlpatterns = [
    path('review/', RNDReview.as_view(), name='rnd-employee-reviews')
]
