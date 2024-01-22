from django.contrib import admin
from api.models import User,Profile

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['upload_verified']
    list_display = ['user', 'full_name' ,'upload_verified']

admin.site.register(User, UserAdmin)
admin.site.register( Profile,ProfileAdmin)

