from django.db import models
from user.models import (User, )


class Review(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    productid = models.CharField(max_length=20, default='')
    userid = models.CharField(max_length=30, default='')
    profile_name = models.CharField(max_length=50)
    time = models.IntegerField(default=0)
    text = models.TextField(default='')
    sentiment = models.IntegerField(default=0)
    helpfulness = models.IntegerField(default=0)
    date = models.DateField()
    flag = models.IntegerField(default=0)
    sarcasm = models.IntegerField(default=0)
    product = models.IntegerField(default=0)
    country = models.CharField(max_length=10, default='')
    lang = models.CharField(max_length=10, default='')
    url = models.SlugField(default='', max_length=120)
    visited = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name
