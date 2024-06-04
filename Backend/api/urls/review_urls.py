from django.urls import path
from api.views import review_views as views

urlpatterns=[
    path('Editor/reviews/', views.EditorReviewListView.as_view()),
    path('Editor/review/<post_id>/<reviewer_id>/update/', views.EditorReviewListView.as_view()),
    path('Editor/review/<post_id>/create/', views.EditorReviewListView.as_view()),

    path('Reviewer/reviews/', views.ReviewerReviewViewset.as_view()),
    path('Reviewer/review/<post_id>/<editor_id>/update/', views.ReviewerReviewViewset.as_view()),
    path('review/:<review_id>/', views.ParticularReviewviewSet.as_view()),
    path('Reviewer/reviews/reviewed/',views.GetReviewedReviews),

    # path('reviewSendToEditor/<uuid:review_id>/',views.Send_Mail_Editor),
]