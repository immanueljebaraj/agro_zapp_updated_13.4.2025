from rest_framework import serializers
from .models import LandDetail

class LandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandDetail
        fields = '__all__'  # Include all fields from the model