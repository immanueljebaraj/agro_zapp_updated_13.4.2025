from django.urls import path
from .views import LandDetailCreateView , LandDetailSearchView

urlpatterns = [
    path('land-details/', LandDetailCreateView.as_view(), name='land-detail-create'),
    path('land-details/search/', LandDetailSearchView.as_view(), name='land-detail-search'),  # For searching data

]