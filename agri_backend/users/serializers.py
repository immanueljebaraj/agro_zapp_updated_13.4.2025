from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [ 'contact_number', 'name', 'aadhar_card', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            contact_number=validated_data['contact_number'],
            aadhar_card=validated_data['aadhar_card'],
            password=validated_data['password'],
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    contact_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        contact_number = data.get('contact_number')
        password = data.get('password')

        if contact_number and password:
            user = authenticate(contact_number=contact_number, password=password)
            if user:
                if user.is_active:
                    refresh = RefreshToken.for_user(user)
                    data['tokens'] = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                    data['user'] = user
                else:
                    raise serializers.ValidationError("User is not active")
            else:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Must provide name and password")
        return data