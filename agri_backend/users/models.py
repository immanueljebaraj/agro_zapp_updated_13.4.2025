from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, contact_number, name, aadhar_card, password=None):
        if not contact_number:
            raise ValueError("Users must have a name")
        if not name:
            raise ValueError("Users must have a contact number")
        if not aadhar_card:
            raise ValueError("Users must have an Aadhar card")

        user = self.model(
            
            contact_number=contact_number,
            name=name,
            aadhar_card=aadhar_card,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, contact_number, aadhar_card, password):
        user = self.create_user(
            name=name,
            contact_number=contact_number,
            aadhar_card=aadhar_card,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    name = models.CharField(max_length=100, unique=True)
    contact_number = models.CharField(max_length=15, unique=True)
    aadhar_card = models.CharField(max_length=12, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'contact_number'
    REQUIRED_FIELDS = ['name', 'aadhar_card']

    def __str__(self):
        return self.contact_number

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin