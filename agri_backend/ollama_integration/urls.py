from django.urls import path
from .views import ask_ollama ,ask_groq

urlpatterns = [
    path('ask-ollama/', ask_ollama, name='ask_ollama'),
    path('ask-groq/', ask_groq, name='ask_groq'),
]