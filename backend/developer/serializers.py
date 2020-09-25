from rest_framework import serializers

from employee.models import Review


class RNDReviewSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'email', 'first_name', 'last_name',
                  'productid', 'userid', 'profile_name', 'time',
                  'text', 'sentiment', 'helpfulness', 'date',
                  'flag', 'sarcasm', 'product', 'country', 'lang',
                  'url', 'visited']
