from django.urls import path
from .views import (MangerView, MyEmployeeView, ManagerReview)

urlpatterns = [
    path('login_employee/', MangerView.as_view(), name='manager'),
    path('my_employees/', MyEmployeeView.as_view(), name='my-employees'),
    path('review/', ManagerReview.as_view(), name='manager-employee-reviews'),
]
