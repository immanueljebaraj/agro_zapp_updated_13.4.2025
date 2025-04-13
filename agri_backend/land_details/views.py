from django.shortcuts import render

from rest_framework import status , generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import LandDetail
from .serializers import LandDetailSerializer


class LandDetailCreateView(APIView):
    def post(self, request, *args, **kwargs):
        # Deserialize the incoming JSON data
        serializer = LandDetailSerializer(data=request.data)
        
        # Validate the data
        if serializer.is_valid():
            # Save the data to the database
            serializer.save()
            # Return a success response
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return an error response if the data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LandDetailSearchView(generics.ListAPIView):
    serializer_class = LandDetailSerializer

    def get_queryset(self):
        queryset = LandDetail.objects.all()
        
        # Get query parameters from the request
        plot_id = self.request.query_params.get('plot_id', None)
        soil_type = self.request.query_params.get('soil_type', None)
        
        # Filter by plot_id if provided
        if plot_id is not None:
            queryset = queryset.filter(plot_id=plot_id)
        
        # Filter by soil_type if provided
        if soil_type is not None:
            queryset = queryset.filter(soil_type=soil_type)
        
        return queryset