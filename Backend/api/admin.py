from django.contrib import admin
from api.models import User,Post,Comment,New,Review

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

    

class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['description', 'pdf_file_status', 'reviewer_id','post']
    search_fields = ['pdf_file_status','post']
    list_filter = ['pdf_file_status']


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(New, NewsAdmin)
admin.site.register(Review, ReviewAdmin)