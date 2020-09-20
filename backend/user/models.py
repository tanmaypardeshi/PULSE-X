from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import *


class User(AbstractBaseUser):
    email = models.EmailField(max_length=120, unique=True)
    manager_id = models.ForeignKey('self', blank=True, null=True, related_name='mananger_id', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    last_login = models.DateTimeField(auto_now_add=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_employee = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_rnd = models.BooleanField(default=False)

    admin = models.BooleanField(default=False)
    staff = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    is_otp_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return f"{self.first_name}"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_active(self):
        return self.active


class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='otp')
    otp = models.IntegerField(default=0)
    counter = models.IntegerField(default=0)

    def __str__(self):
        return self.user.email