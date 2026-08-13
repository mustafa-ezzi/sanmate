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
    RapidGatewayConfigView,
    RapidGatewayInitiateView,
    RapidGatewayOrderStatusView,
    RapidGatewaySimulatePaymentView,
    RapidGatewayWebhookView,
)

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/v1/admin/", include("admin_api.urls")),
    path(
        "api/v1/webhooks/rapid-gateway/",
        RapidGatewayWebhookView.as_view(),
        name="rapid-gateway-webhook",
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
        "api/v1/<slug:company_slug>/payments/rapid-gateway/config/",
        RapidGatewayConfigView.as_view(),
        name="rapid-gateway-config",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/rapid-gateway/initiate/",
        RapidGatewayInitiateView.as_view(),
        name="rapid-gateway-initiate",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/rapid-gateway/simulate/",
        RapidGatewaySimulatePaymentView.as_view(),
        name="rapid-gateway-simulate",
    ),
    path(
        "api/v1/<slug:company_slug>/payments/rapid-gateway/orders/<str:order_number>/",
        RapidGatewayOrderStatusView.as_view(),
        name="rapid-gateway-order-status",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
