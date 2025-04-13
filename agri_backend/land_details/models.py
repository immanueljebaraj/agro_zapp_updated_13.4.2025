from django.db import models

from django.db import models

class LandDetail(models.Model):
    plot_id = models.CharField(max_length=100, unique=True)
    gis_data = models.JSONField()  # Store GIS data as JSON
    soil_type = models.CharField(max_length=100)
    weather = models.CharField(max_length=100)
    npk_levels = models.JSONField()  # Store NPK levels as JSON
    moisture = models.FloatField()
    temperature = models.FloatField()  # New field for temperature

    def __str__(self):
        return self.plot_id
