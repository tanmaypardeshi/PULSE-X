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
    permission_classes = (IsAuthenticated, IsManager,)
    authentication_classes = (JSONWebTokenAuthentication,)
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
    permission_classes = (IsAuthenticated, IsManager,)
    authentication_classes = (JSONWebTokenAuthentication,)
    serializer_class = ManagerReviewSerializer

    def get_queryset(self):
        manger = User.objects.get(email=self.request.user).pk
        employees = User.objects.filter(manager_id=manger)
        review_list = []
        for employee in employees:
            if self.kwargs['param'] == 'twitter':
                reviews = Review.objects.filter(user=employee, flag=3, visited=False, is_twitter=True)
            else:
                reviews = Review.objects.filter(user=employee, flag=3, visited=False, is_twitter=False)
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
            flag = request.data['flag']
            visited = request.data['visited']
            if not visited:
                review.flag = flag
            else:
                review.visited = True
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


class ManagerChart(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsManager,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, *args, **kwargs):
        try:
            manager = User.objects.get(email=request.user)
            employees = User.objects.filter(manager_id=manager.id).count()
            flag0 = Review.objects.filter(user__manager_id=request.user, flag=0).count()
            flag1 = Review.objects.filter(user__manager_id=request.user, flag=1).count()
            flag2 = Review.objects.filter(user__manager_id=request.user, flag=2).count()
            flag3 = Review.objects.filter(user__manager_id=request.user, flag=3).count()
            flag4 = Review.objects.filter(user__manager_id=request.user, flag=4).count()
            flag5 = Review.objects.filter(user__manager_id=request.user, flag=5).count()
            negative = Review.objects.filter(user__manager_id=request.user, sentiment=-1).count()
            neutral = Review.objects.filter(user__manager_id=request.user, sentiment=0).count()
            positive = Review.objects.filter(user__manager_id=request.user, sentiment=1).count()
            helpfulness_0 = Review.objects.filter(user__manager_id=request.user, helpfulness=0).count()
            helpfulness_1 = Review.objects.filter(user__manager_id=request.user, helpfulness=1).count()


            return Response({
                'success': True,
                'message': 'Fetched data',
                'data': {
                    'total_employees': employees,
                    'flag0': flag0,
                    'flag1': flag1,
                    'flag2': flag2,
                    'flag3': flag3,
                    'flag4': flag4,
                    'flag5': flag5,
                    'negative': negative,
                    'neutral': neutral,
                    'positive': positive,
                    'helpfulness_0': helpfulness_0,
                    'helpfulness_1': helpfulness_1
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)
