from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['text', 'lang', 'country_code', 'created_at', 'flag',
                  'date', 'time', 'hashtag', 'product', 'sentiment', ]

    def update(self, instance, validated_data):
        employee = Review.objects.create(user=instance, **validated_data)
        employee.save()
        return {
            'message': 'Success'
        }


class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

