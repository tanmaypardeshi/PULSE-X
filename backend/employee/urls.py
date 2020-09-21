from django.urls import path
from .views import (ReviewView, SavedReview, GetReview,
                    GetFlagDetails, EmployeeDetailView, )

urlpatterns = [
    path('review/', ReviewView.as_view(), name='get-review'),
    path('saved/', SavedReview.as_view(), name='saved'),
    path('review_data/', GetReview.as_view(), name='review'),
    path('flag_data/', GetFlagDetails.as_view(), name='flag'),
    path('detail/', EmployeeDetailView.as_view(), name='employee-detail')
]