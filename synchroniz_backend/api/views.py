from django.shortcuts import render

from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount


class ExchangeTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        provider = request.data.get("provider")
        uid = request.data.get("uid")
        try:
            social_account = SocialAccount.objects.get(
                provider=provider, uid=uid)
            user = social_account.user
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh.access_token),
                             'access': str(refresh.access_token)
                             })
        except SocialAccount.DoesNotExist:
            return Response({"error": "Invalid access token"}, status=status.HTTP_401_UNAUTHORIZED)

# Create your views here.


class app_user_modelviewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = app_user_serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class note_viewset(viewsets.ModelViewSet):
    queryset = note.objects.all()
    serializer_class = note_serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class task_viewset(viewsets.ModelViewSet):
    queryset = task.objects.all()
    serializer_class = task_serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class category_viewset(viewsets.ModelViewSet):
    queryset = category.objects.all()
    serializer_class = category_serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
