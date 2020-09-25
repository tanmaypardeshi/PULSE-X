from django.urls import path
from .views import (MangerView, MyEmployeeView, ManagerReview,
                    ManagerChart, )

urlpatterns = [
    path('login_employee/', MangerView.as_view(), name='manager'),
    path('my_employees/', MyEmployeeView.as_view(), name='my-employees'),
    path('review/<str:param>/', ManagerReview.as_view(), name='manager-employee-reviews'),
    path('chart/', ManagerChart.as_view(), name='manager-chart')
]
