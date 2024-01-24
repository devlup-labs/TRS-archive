from django.contrib import admin
from api.models import User,Posts

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email','is_verified']






    

admin.site.register(User, UserAdmin)
admin.site.register(Posts)
