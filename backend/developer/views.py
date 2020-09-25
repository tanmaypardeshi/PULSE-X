from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from user.permissions import IsRND
from user.models import User
from employee.models import Review

from .serializers import RNDReviewSerializer


class RNDReview(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsRND,)
    authentication_classes = (JSONWebTokenAuthentication,)
    serializer_class = RNDReviewSerializer

    def get_queryset(self):
        manger = User.objects.get(email=self.request.user).pk
        employees = User.objects.filter(manager_id=manger)
        review_list = []
        for employee in employees:
            reviews = Review.objects.filter(user=employee, flag=4, visited=False)
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
            review.visited = request.data['visited']
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

