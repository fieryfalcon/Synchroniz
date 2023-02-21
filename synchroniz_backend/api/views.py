from django.shortcuts import render
import jwt
from rest_framework import viewsets
from rest_framework import permissions, filters
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from rest_framework.authentication import TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse, QueryDict
# import agora_rtc_sdk


def generate_token(room_name):
    app_id = "YOUR_APP_ID"
    app_certificate = "YOUR_APP_CERTIFICATE"
    channel_name = room_name
    role = agora_rtc_sdk.AGORA_APP_ID_ROLE_PUBLISHER
    uid = None
    expiration_time_in_seconds = 3600
    result, token = agora_rtc_sdk.generate_token(
        app_id, app_certificate, channel_name, role, uid, expiration_time_in_seconds)
    return token


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
            return Response({"error": "Invalid access token"})

# Create your views here.


class app_user_modelviewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = app_user_serializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['email']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.perform_create(serializer)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response_data = {
            'refresh': str(refresh),
            'access': str(access_token),
        }

        headers = self.get_success_headers(serializer.data)
        return Response(response_data, headers=headers)

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()
        return user


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


# class VideoChatRoomViewSet(viewsets.ModelViewSet):
#     queryset = VideoChatRoom.objects.all()
#     serializer_class = VideoChatRoomSerializer

#     def join_room(self, request, pk=None):
#         room = self.get_object()
#         token = generate_token(room.name)
#         return Response({'token': token})
