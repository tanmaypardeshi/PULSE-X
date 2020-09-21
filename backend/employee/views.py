from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from user.models import (User, )
from user.permissions import (IsEmployee, IsManager, IsRND, )
from .data import (get_set, )
from .serializers import (ReviewSerializer, SaveSerializer, )
from .models import (Review, )


class ReviewView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmployee,)
    authentication_classes = (JSONWebTokenAuthentication,)
    serializer_class = ReviewSerializer

    def get(self, request, *args, **kwargs):
        try:
            review_set = get_set()
            return Response({
                'success': True,
                'message': 'Sent 10 reviews',
                'review_set': review_set
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.update(User.objects.get(email=request.user), request.data)
            response = {
                'success': True,
                'message': 'Saved Review'
            }
            return Response(response, status=status.HTTP_200_OK)

        response = {
            'success': False,
            'message': 'Could not save review'
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


class SavedReview(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsEmployee,)
    authentication_classes = (JSONWebTokenAuthentication,)
    serializer_class = SaveSerializer

    def get_queryset(self):
        saved = Review.objects.filter(user=self.request.user, flag=5)
        return saved

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            id = request.data['id']
            flag = request.data['flag']
            review = Review.objects.get(id=id)
            review.flag = flag
            review.save()
            return Response({
                'success': True,
                'message': 'Edited Review'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)


class GetReview(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsEmployee,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, *args, **kwargs):
        try:
            employee_reviews = Review.objects.filter(user=request.user).count()
            total_reviews = Review.objects.all().count()

            return Response({
                'success': True,
                'message': 'Fetched employee details',
                'data': {
                    'employee_reviews': employee_reviews,
                    'difference': total_reviews - employee_reviews,
                    'total_reviews': total_reviews
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)


class GetFlagDetails(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsEmployee,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, *args, **kwargs):
        try:
            flag0 = Review.objects.filter(flag=0).count()
            flag1 = Review.objects.filter(flag=1).count()
            flag2 = Review.objects.filter(flag=2).count()
            flag3 = Review.objects.filter(flag=3).count()
            flag4 = Review.objects.filter(flag=4).count()
            flag5 = Review.objects.filter(flag=5).count()
            total = Review.objects.all().count()
            return Response({
                'success': True,
                'message': 'Fetched employee details',
                'data': {
                    'flag0': flag0,
                    'flag1': flag1,
                    'flag2': flag2,
                    'flag3': flag3,
                    'flag4': flag4,
                    'flag5': flag5,
                    'total': total
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsManager,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, *args, **kwargs):
        try:
            employee = User.objects.get(id=request.data['id'])
            name = f"{employee.first_name} {employee.last_name}"
            email = employee.email
            manager_id = employee.manager_id
            last_login = employee.last_name
            date_joined = employee.date_joined
            flag0 = Review.objects.filter(user=employee, flag=0).count()
            flag1 = Review.objects.filter(user=employee, flag=1).count()
            flag2 = Review.objects.filter(user=employee, flag=2).count()
            flag3 = Review.objects.filter(user=employee, flag=3).count()
            flag4 = Review.objects.filter(user=employee, flag=4).count()
            flag5 = Review.objects.filter(user=employee, flag=5).count()
            total = Review.objects.all().count()

            return Response({
                'success': True,
                'message': 'Fetched employee details',
                'data': {
                    'name': name,
                    'email': email,
                    'manager_id': manager_id,
                    'last_login': last_login,
                    'date_joined': date_joined,
                    'flag0': flag0,
                    'flag1': flag1,
                    'flag2': flag2,
                    'flag3': flag3,
                    'flag4': flag4,
                    'flag5': flag5,
                    'total': total
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': e.__str__()
            }, status=status.HTTP_400_BAD_REQUEST)
