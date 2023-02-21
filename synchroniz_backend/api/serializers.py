from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import make_password


# class VideoChatRoomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VideoChatRoom
#         fields = ['id', 'name', 'type', 'user']


class app_user_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class category_serializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = "__all__"


class task_serializer(serializers.ModelSerializer):
    class Meta:
        model = task
        fields = "__all__"


class note_serializer(serializers.ModelSerializer):
    class Meta:
        model = note
        fields = "__all__"
