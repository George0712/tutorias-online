from django.contrib import admin

from django.contrib import admin
from .models import User, Student, Tutor

admin.site.register(User)
admin.site.register(Student)
admin.site.register(Tutor)
