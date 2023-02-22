from django.shortcuts import render
import jwt
from rest_framework import viewsets
from rest_framework import permissions, filters
from .models import *
from .serializers import *
import random
import time
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
from agora_token_builder import RtcTokenBuilder
from .models import RoomMember
import json
from django.views.decorators.csrf import csrf_exempt


# Create your views here.

def lobby(request):
    return render(request, 'base/lobby.html')


def room(request):
    return render(request, 'base/room.html')


def getToken(request):
    appId = "aaacc98a97ee49c481dbf72c402745c1"
    appCertificate = "5187085835e642fbbbdf6e2ab8aa2ec4"
    channelName = "123"
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(
        appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token, 'uid': uid}, safe=False)


@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name': data['name']}, safe=False)


def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name': member.name}, safe=False)


@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)


# def generate_token(room_name):
#     app_id = "YOUR_APP_ID"
#     app_certificate = "YOUR_APP_CERTIFICATE"
#     channel_name = room_name
#     role = agora_rtc_sdk.AGORA_APP_ID_ROLE_PUBLISHER
#     uid = None
#     expiration_time_in_seconds = 3600
#     result, token = agora_rtc_sdk.generate_token(
#         app_id, app_certificate, channel_name, role, uid, expiration_time_in_seconds)
#     return token


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
