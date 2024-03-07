from django.contrib import admin
from api.models import User,Post,Comment,Institute,Category, Review, New

class UserAdmin(admin.ModelAdmin):
    list_display = ['id','username', 'email','is_verified']



class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title','body','category','sub_category','status', 'document','created_at']
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

    

class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class CategoriesAdmin(admin.ModelAdmin):
    list_display = ['name','sub_categories']
    search_fields = ['name']
    list_filter = ['name']
    
class InstituteAdmin(admin.ModelAdmin):
    list_display = ['college_name', 'email_tag', 'is_approved']
    fieldsets = (
        (None, {
            'fields': ('college_name', 'email_tag', 'is_approved')
        }),
    )
    search_fields = ['college_name', 'email_tag']
    list_filter = ['is_approved']

class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']
    search_fields = ['title']

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['description', 'pdf_file_status', 'reviewer_id', 'post']
    search_fields = ['description', 'pdf_file_status', 'reviewer_id', 'post']
    list_filter = ['pdf_file_status','post']

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Institute,InstituteAdmin)
admin.site.register(Category,CategoriesAdmin)
admin.site.register(New, NewsAdmin)
admin.site.register(Review, ReviewAdmin)