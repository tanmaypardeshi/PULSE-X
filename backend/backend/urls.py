from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # user
    path('api/user/', include('user.urls')),

    # employee
    path('api/employee/', include('employee.urls')),

    # admin
    path('admin/', admin.site.urls),
]
