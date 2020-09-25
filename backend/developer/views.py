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
        review = Review.objects.filter(flag=4)
        return review

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

