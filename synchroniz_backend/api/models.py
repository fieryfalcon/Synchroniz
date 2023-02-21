from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        if not first_name:
            raise ValueError('Users must have an first name')
        if not last_name:
            raise ValueError('Users must have an last name')
        user = self.model(email=self.normalize_email(
            email), first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(email,
                                password=password,
                                first_name=first_name, last_name=last_name)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model with email as the primary key
    """
    email = models.EmailField(
        verbose_name='email address', max_length=255, unique=True,)
    first_name = models.CharField(max_length=255, null=False, blank=False)
    last_name = models.CharField(max_length=255, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email


class category(models.Model):
    class Meta:
        verbose_name_plural = "categories"

    category_name = models.CharField(max_length=40)

    def __str__(self):
        return self.category_name


# class VideoChatRoom(models.Model):
#     name = models.CharField(max_length=100)
#     type = models.CharField(max_length=100)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)


class task(models.Model):

    STATUS_CHOICES = ((1, "To do"), ("In Progress",
                      "In Progress"), (3, "Done"))

    task_text = models.TextField()
    date_of_creation = models.DateTimeField(auto_now_add=True)
    date_of_due = models.DateField()
    time_of_due = models.DateTimeField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=1)
    email = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ManyToManyField(category)

    def __str__(self):
        return self.task_text


class note(models.Model):

    note_text = models.TextField()
    date_of_creation = models.DateTimeField(auto_now=True)
    email = models.ManyToManyField(User)

    def __str__(self):
        return self.note_text
