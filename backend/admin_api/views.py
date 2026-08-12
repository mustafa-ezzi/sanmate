from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Category, Product
from cms.models import Banner, Carousel, Policy
from companies.company_context import get_admin_company
from companies.models import CompanySettings
from companies.serializers import CompanySerializer
from notifications.models import WhatsAppNotifyRecipient
from notifications.services import notify_order_whatsapp, whatsapp_is_configured
from orders.models import Order

from .serializers import (
    AdminBannerSerializer,
    AdminCarouselSerializer,
    AdminCategorySerializer,
    AdminCompanySettingsSerializer,
    AdminOrderSerializer,
    AdminPolicySerializer,
    AdminProductSerializer,
    WhatsAppRecipientSerializer,
)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""
        user = authenticate(username=username, password=password)
        if not user or not user.is_active or not user.is_staff:
            return Response(
                {"detail": "Invalid credentials or not a staff user."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token, _ = Token.objects.get_or_create(user=user)
        profile = getattr(user, "admin_profile", None)
        from companies.company_context import get_admin_company

        sams = get_admin_company(request)
        if profile:
            profile.active_company = sams
            profile.save(update_fields=["active_company"])
        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": profile.role if profile else "superadmin",
                },
                "active_company": CompanySerializer(sams).data,
            }
        )


class AdminMeView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        from companies.company_context import get_admin_company

        profile = getattr(request.user, "admin_profile", None)
        sams = get_admin_company(request)
        return Response(
            {
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "role": profile.role if profile else "superadmin",
                },
                "active_company": CompanySerializer(sams).data,
            }
        )


class AdminLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({"detail": "Logged out."})


class CompanyScopedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = None

    def get_company(self):
        return get_admin_company(self.request)

    def perform_create(self, serializer):
        serializer.save(company=self.get_company())


class AdminCategoryViewSet(CompanyScopedModelViewSet):
    serializer_class = AdminCategorySerializer

    def get_queryset(self):
        return Category.objects.filter(company=self.get_company()).order_by(
            "sort_order",
            "name",
        )


class AdminProductViewSet(CompanyScopedModelViewSet):
    serializer_class = AdminProductSerializer

    def get_queryset(self):
        return (
            Product.objects.filter(company=self.get_company())
            .select_related("category")
            .prefetch_related("images")
        )

    def perform_create(self, serializer):
        company = self.get_company()
        category = serializer.validated_data.get("category")
        if category and category.company_id != company.id:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"category": "Category must belong to active company."})
        serializer.save(company=company)


class AdminBannerViewSet(CompanyScopedModelViewSet):
    serializer_class = AdminBannerSerializer

    def get_queryset(self):
        return Banner.objects.filter(company=self.get_company())


class AdminCarouselViewSet(CompanyScopedModelViewSet):
    serializer_class = AdminCarouselSerializer

    def get_queryset(self):
        return Carousel.objects.filter(company=self.get_company()).prefetch_related(
            "slides"
        )


class AdminPolicyViewSet(CompanyScopedModelViewSet):
    serializer_class = AdminPolicySerializer

    def get_queryset(self):
        return Policy.objects.filter(company=self.get_company())


class AdminOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminOrderSerializer
    pagination_class = None
    http_method_names = ["get", "post", "patch", "put", "head", "options"]

    def get_queryset(self):
        return (
            Order.objects.filter(company=get_admin_company(self.request))
            .prefetch_related("items")
            .order_by("-created_at")
        )

    @action(detail=True, methods=["post"], url_path="resend-whatsapp")
    def resend_whatsapp(self, request, pk=None):
        order = self.get_object()
        result = notify_order_whatsapp(order)
        return Response(result)


class AdminSettingsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        company = get_admin_company(request)
        settings_obj, _ = CompanySettings.objects.get_or_create(
            company=company,
            defaults={"currency": "PKR"},
        )
        data = AdminCompanySettingsSerializer(settings_obj).data
        data["whatsapp"] = {
            "configured": whatsapp_is_configured(),
            "template_name": (settings.WHATSAPP_TEMPLATE_NAME or "").strip(),
            "phone_number_id_set": bool(
                (settings.WHATSAPP_PHONE_NUMBER_ID or "").strip()
            ),
            "token_set": bool((settings.WHATSAPP_API_TOKEN or "").strip()),
        }
        from admin_api.r2_storage import r2_is_configured

        data["media"] = {
            "r2_configured": r2_is_configured(),
            "public_base_url": (settings.CF_MEDIA_BASE_URL or "").rstrip("/"),
            "bucket": (settings.CF_R2_BUCKET or "").strip(),
        }
        return Response(data)

    def patch(self, request):
        company = get_admin_company(request)
        settings_obj, _ = CompanySettings.objects.get_or_create(
            company=company,
            defaults={"currency": "PKR"},
        )
        serializer = AdminCompanySettingsSerializer(
            settings_obj,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminWhatsAppRecipientViewSet(CompanyScopedModelViewSet):
    serializer_class = WhatsAppRecipientSerializer

    def get_queryset(self):
        return WhatsAppNotifyRecipient.objects.filter(
            company=self.get_company()
        ).order_by("sort_order", "label")
