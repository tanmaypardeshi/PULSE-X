from django.db import models
from user.models import (User, )


class Review(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    text = models.TextField(default='')
    sentiment = models.IntegerField(default=0)
    helpfulness = models.IntegerField(default=0)
    flag = models.IntegerField(default=0)
    sarcasm = models.IntegerField(default=0)
    product = models.TextField(default='')
    visited = models.BooleanField(default=False)
    is_twitter = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name
