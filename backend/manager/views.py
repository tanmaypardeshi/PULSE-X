from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from user.permissions import IsManager
from user.models import User
from employee.models import Review
from .serializers import (MyEmployeeSerializer, ManagerReviewSerializer, )


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
                'message': 'User already exists.'
            }, status=status.HTTP_400_BAD_REQUEST)


class MyEmployeeView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsManager, )
    authentication_classes = (JSONWebTokenAuthentication, )
    serializer_class = MyEmployeeSerializer

    def get_queryset(self):
        manger = User.objects.get(email=self.request.user).pk
        employees = User.objects.filter(manager_id=manger)
        return employees

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ManagerReview(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsManager, )
    authentication_classes = (JSONWebTokenAuthentication, )
    serializer_class = ManagerReviewSerializer

    def get_queryset(self):
        manger = User.objects.get(email=self.request.user).pk
        employees = User.objects.filter(manager_id=manger)
        review_list = []
        for employee in employees:
            reviews = Review.objects.filter(user=employee, flag=3)
            for review in reviews:
                review_list.append(review)
        return review_list

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            review = Review.objects.get(id=request.data['id'])
            review.flag = request.data['flag']
            review.save()
            return Response({
                'success': True,
                'message': 'Changes made!'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': True,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)
