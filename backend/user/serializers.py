from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework_jwt.settings import api_settings
from .models import User

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name',
                  'last_name', 'is_manager', 'is_rnd']

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data['email'],
                                        password=validated_data['password'])
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.is_manager = validated_data['is_manager']
        user.is_rnd = validated_data['is_rnd']
        user.save()
        return user


class LoginSerializer(Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    is_manager = serializers.BooleanField(default=False)
    is_employee = serializers.BooleanField(default=False)
    is_rnd = serializers.BooleanField(default=False)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)
        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError(
                'Invalid Credentials'
            )
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        update_last_login(None, user)
        return {
            'email': user.email,
            'token': token,
            'is_manager': user.is_manager,
            'is_employee': user.is_employee,
            'is_rnd': user.is_rnd
        }


class EditSerializer(serializers.Serializer):

    def update(self, instance, data):
        user = instance
        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password is not found.'
            )
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.save()
        return user


class ChangeSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128)
    new_password = serializers.CharField(max_length=128)

    def update(self, instance, data):
        user = instance
        password = data['password']
        new_password = data['new_password']
        if password == new_password:
            raise serializers.ValidationError(
                'Old and New password cannot be the same'
            )

        user = authenticate(email=user, password=password)
        if user is None:
            raise serializers.ValidationError(
                'Invalid Credentials'
            )
        user.set_password(new_password)
        user.save()
        return {
            'email': user.email,
        }


class ForgotSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    new_password = serializers.CharField(max_length=128)

    def validate(self, data):
        email = data['email']
        new_password = data['new_password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise serializers.ValidationError(
                'Could not find user'
            )
        if not user.is_otp_verified:
            raise serializers.ValidationError(
                'Verify OTP first'
            )
        user.set_password(new_password)
        user.is_otp_verified = False
        user.save()
        return {
            'email': user.email,
        }
