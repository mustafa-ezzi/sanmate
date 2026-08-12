from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from catalog.views import (
    CategoryListView,
    ProductDetailView,
    ProductListView,
)
from cms.views import BannerListView, CarouselDetailView, PolicyDetailView
from companies.views import PublicCompanyDetailView
from orders.views import OrderCreateView
from payments.views import (
    PaysafeConfigView,
    PaysafeProcessPaymentView,
    PaysafeSimulatePaymentView,
    PaysafeWebhookView,
)

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/v1/admin/", include("admin_api.urls")),
    path(
        "api/v1/webhooks/paysafe/",
        PaysafeWebhookView.as_view(),
        name="paysafe-webhook",
    ),
    path(
        "api/v1/<slug:company_slug>/",
        PublicCompanyDetailView.as_view(),
        name="company-detail",
    ),
    path(
        "api/v1/<slug:company_slug>/categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),
    path(
        "api/v1/<slug:company_slug>/products/",
        ProductListView.as_view(),
        name="product-list",
    ),
    path(
        "api/v1/<slug:company_slug>/products/<slug:slug>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),
    path(
        "api/v1/<slug:company_slug>/banners/",
        BannerListView.as_view(),
        name="banner-list",
    ),
    path(
        "api/v1/<slug:company_slug>/carousels/<slug:key>/",
        CarouselDetailView.as_view(),
        name="carousel-detail",
    ),
    path(
        "api/v1/<slug:company_slug>/policies/<slug:policy_type>/",
        PolicyDetailView.as_view(),
        name="policy-detail",
    ),
    path(
        "api/v1/<slug:company_slug>/orders/",
        OrderCreateView.as_view(),
        name="order-create",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/paysafe/config/",
        PaysafeConfigView.as_view(),
        name="paysafe-config",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/paysafe/process/",
        PaysafeProcessPaymentView.as_view(),
        name="paysafe-process",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/paysafe/simulate/",
        PaysafeSimulatePaymentView.as_view(),
        name="paysafe-simulate",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
