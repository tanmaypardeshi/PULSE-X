import random
import datetime
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings

from .permissions import (IsManager, )
from .models import (User, OTP, )
from .serializers import (UserSerializer, EditSerializer, LoginSerializer,
                          ChangeSerializer, ForgotSerializer, )

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            user = User.objects.get(email=request.data['email'])
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)

            response = {
                'success': True,
                'message': 'User registered successfully',
                'token': token,
                'is_manager': user.is_manager,
                'is_rnd': user.is_rnd
            }

            return Response(response, status=status.HTTP_201_CREATED)
        response = {
            'success': 'False',
            'message': 'User Already Registered!',
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class MangerView(APIView):
    permission_classes = (IsAuthenticated, IsManager,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            email = request.data['email']
            password = request.data['password']
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            employee = User.objects.create_user(email=email, password=password)
            employee.first_name = first_name
            employee.last_name = last_name
            employee.is_employee = True
            employee.is_rnd = False
            employee.is_manager = False
            employee.manager_id = request.user
            employee.save()

            return Response({
                'success': True,
                'message': 'Saved employee'
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'success': False,
                'message': 'Could not save employee.'
            }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            response = {
                'success': True,
                'message': 'User logged in successfully',
                'token': serializer.data['token'],
                'is_manager': serializer.data['is_manager'],
                'is_employee': serializer.data['is_employee'],
                'is_rnd': serializer.data['is_rnd']
            }
            return Response(response, status=status.HTTP_200_OK)
        response = {
            'success': False,
            'message': 'Invalid Credentials',
        }

        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request):
        try:
            user = User.objects.get(email=request.user)
            last_login = str(user.last_login + datetime.timedelta(hours=5.5))
            date_joined = str(user.date_joined + datetime.timedelta(hours=5.5))
            last_login = f"{last_login[:10]} {last_login[11:19]}"
            date_joined = f"{date_joined[:10]} {date_joined[11:19]}"
            status_code = status.HTTP_200_OK
            response = {
                'success': True,
                'status_code': status.HTTP_200_OK,
                'message': 'Profile fetched',
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_employee': user.is_employee,
                'is_manager': user.is_manager,
                'is_rnd': user.is_rnd,
                'last_login': last_login,
                'date_joined': date_joined
            }
        except Exception as e:
            status_code = status.HTTP_400_BAD_REQUEST
            response = {
                'success': False,
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'User does not exists',
                'error': str(e)
            }
        return Response(response, status=status_code)

    def patch(self, request):
        serializer = EditSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(User.objects.get(email=request.user), request.data)
            response = {
                'success': 'True',
                'status code': status.HTTP_200_OK,
            }
            status_code = status.HTTP_200_OK

            return Response(response, status=status_code)
        response = {
            'success': 'False',
            'status code': status.HTTP_401_UNAUTHORIZED,
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class OTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
            try:
                otp = OTP.objects.get(user=user)
                otp.otp = random.randint(1000, 9999)
                otp.counter = otp.counter + 1
            except OTP.DoesNotExist:
                otp = OTP()
                otp.user = user
                otp.otp = random.randint(1000, 9999)
                otp.counter = otp.counter + 1
            otp.save()
            try:
                send_mail(
                    'OTP for Forgotten Password',
                    f"Dear {user.first_name} {user.last_name},\nFollowing are the details for your forgotten password registered under {user.email}.\n\nOTP : {otp.otp}\nThank you",
                    'credenzuser@gmail.com',
                    [f"{user.email}"],
                    fail_silently=False
                )
            except:
                response = {
                    'success': 'False',
                    'status code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                    'message': 'Could not send email. Please try again later',
                }
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            response = {
                'success': 'True',
                'status code': status.HTTP_200_OK,
                'message': 'OTP sent to email successfully',
            }
            return Response(response, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            response = {
                'success': 'False',
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'Email does not exist',
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class VerifyOtp(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data['email']
        otp = int(request.data['otp'])
        try:
            user = User.objects.get(email=email)
            try:
                otp_obj = OTP.objects.get(user=user)
                if otp == otp_obj.otp and user == otp_obj.user:
                    user.is_otp_verified = True
                    user.save()
                    response = {
                        'success': 'True',
                        'status code': status.HTTP_200_OK,
                        'message': 'OTP verified'
                    }
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    response = {
                        'success': 'False',
                        'status code': status.HTTP_400_BAD_REQUEST,
                        'message': 'OTP could not be verified'
                    }
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)
            except OTP.DoesNotExist:
                response = {
                    'success': 'False',
                    'status code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Please generate an OTP on registered email'
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            response = {
                'success': 'False',
                'status code': status.HTTP_401_UNAUTHORIZED,
                'message': 'Could not find user'
            }
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPassword(APIView):
    permission_classes = (AllowAny,)
    serializer_class = ForgotSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = {
            'success': 'True',
            'status code': status.HTTP_200_OK,
        }
        return Response(response, status=status.HTTP_200_OK)


class ChangePassword(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangeSerializer(User.objects.get(email=request.user), request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = {
            'success': 'True',
            'status code': status.HTTP_200_OK,
            'message': 'Password updated successfully',
        }
        status_code = status.HTTP_200_OK
        return Response(response, status=status_code)
