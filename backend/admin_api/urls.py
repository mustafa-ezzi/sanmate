from django.urls import include, path
from rest_framework.routers import DefaultRouter

from companies.views import (
    AdminCompanyContextView,
    AdminCompanyListView,
    AdminDashboardSummaryView,
)
from .media import AdminMediaUploadView

from .views import (
    AdminBannerViewSet,
    AdminCarouselViewSet,
    AdminCategoryViewSet,
    AdminLoginView,
    AdminLogoutView,
    AdminMeView,
    AdminOrderViewSet,
    AdminPolicyViewSet,
    AdminProductViewSet,
    AdminSettingsView,
    AdminWhatsAppRecipientViewSet,
)

router = DefaultRouter()
router.register("categories", AdminCategoryViewSet, basename="admin-categories")
router.register("products", AdminProductViewSet, basename="admin-products")
router.register("banners", AdminBannerViewSet, basename="admin-banners")
router.register("carousels", AdminCarouselViewSet, basename="admin-carousels")
router.register("policies", AdminPolicyViewSet, basename="admin-policies")
router.register("orders", AdminOrderViewSet, basename="admin-orders")
router.register(
    "whatsapp-recipients",
    AdminWhatsAppRecipientViewSet,
    basename="admin-whatsapp",
)

urlpatterns = [
    path("login/", AdminLoginView.as_view(), name="admin-login"),
    path("logout/", AdminLogoutView.as_view(), name="admin-logout"),
    path("me/", AdminMeView.as_view(), name="admin-me"),
    path("companies/", AdminCompanyListView.as_view(), name="admin-companies"),
    path("context/", AdminCompanyContextView.as_view(), name="admin-context"),
    path(
        "dashboard/summary/",
        AdminDashboardSummaryView.as_view(),
        name="admin-dashboard",
    ),
    path("settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path(
        "media/upload/",
        AdminMediaUploadView.as_view(),
        name="admin-media-upload",
    ),
    path("", include(router.urls)),
]
