from django.db import models
from user.models import (User, )


class Review(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    text = models.TextField(default='')
    lang = models.CharField(max_length=10, default='')
    country_code = models.CharField(max_length=10, default='')
    created_at = models.DateTimeField()
    date = models.DateField()
    time = models.TimeField()
    hashtag = models.TextField(default='')
    product = models.IntegerField(default=0)
    sentiment = models.IntegerField(default=0)
    flag = models.IntegerField(default=0)
    visited = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name
