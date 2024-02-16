from django.contrib import admin
from api.models import User,Post

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email','is_verified']



class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'title','body','category','sub_category','status', 'document','created_at']
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'body','status','category','sub_category','document')
        }),
    )
    search_fields = ['title', 'category', 'sub_category']
    list_filter = ['status', 'category', 'sub_category']


    

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)