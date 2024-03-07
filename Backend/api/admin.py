from django.contrib import admin
from api.models import User,Post,Comment,Institute,Category

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

class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post','likes','body','created_at']
    fieldsets = (
        (None, {
            'fields': ('user', 'post', 'likes', 'body')
        }),
    )
    search_fields = ['body']
    list_filter = ['likes']

class InstituteAdmin(admin.ModelAdmin):
    list_display = ['college_name','is_approved']
    search_fields = ['college_name']
    list_filter = ['is_approved']

class CategoriesAdmin(admin.ModelAdmin):
    list_display = ['name','sub_categories']
    search_fields = ['name']
    list_filter = ['name']
    

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Institute,InstituteAdmin)
admin.site.register(Category,CategoriesAdmin)