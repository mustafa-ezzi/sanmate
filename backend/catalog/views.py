from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.middleware import get_company_from_slug

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


def _require_company(company_slug, *, storefront_only=True):
    company = get_company_from_slug(company_slug)
    if not company:
        return None, Response(
            {"detail": "Company not found."},
            status=status.HTTP_404_NOT_FOUND,
        )
    if storefront_only and not company.storefront_enabled:
        return None, Response(
            {"detail": "Storefront not enabled for this company."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return company, None


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return Category.objects.none()
        self._company_error = None
        return Category.objects.filter(company=company, is_active=True)

    def list(self, request, *args, **kwargs):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return err
        return super().list(request, *args, **kwargs)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    search_fields = ("name", "sku", "short_description")
    filterset_fields = ("is_featured", "category__slug")
    ordering_fields = ("price", "name", "created_at")

    def get_queryset(self):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return Product.objects.none()
        qs = Product.objects.filter(company=company, is_active=True).select_related(
            "category"
        ).prefetch_related("images")
        brand = self.request.query_params.get("brand") or self.request.query_params.get(
            "category"
        )
        if brand:
            qs = qs.filter(category__slug=brand)
        return qs

    def list(self, request, *args, **kwargs):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return err
        return super().list(request, *args, **kwargs)


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return Product.objects.none()
        return Product.objects.filter(company=company, is_active=True).select_related(
            "category"
        ).prefetch_related("images")

    def retrieve(self, request, *args, **kwargs):
        company, err = _require_company(self.kwargs["company_slug"])
        if err:
            return err
        return super().retrieve(request, *args, **kwargs)


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CategorySerializer

    def get_queryset(self):
        slug = self.request.headers.get("X-Company-Slug", "sams")
        return Category.objects.filter(company__slug=slug).order_by("sort_order")

    def perform_create(self, serializer):
        from companies.models import Company

        slug = self.request.headers.get("X-Company-Slug", "sams")
        company = Company.objects.get(slug=slug)
        serializer.save(company=company)


class AdminProductListCreateView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ProductDetailSerializer

    def get_queryset(self):
        slug = self.request.headers.get("X-Company-Slug", "sams")
        return Product.objects.filter(company__slug=slug).select_related(
            "category"
        ).prefetch_related("images")


class AdminMediaUploadStubView(APIView):
    """
    Phase 1 stub: accepts metadata and returns a fake R2 URL.
    Same bucket, company-prefixed path. Wire real CF upload later.
    """

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        from django.conf import settings

        company = request.headers.get("X-Company-Slug", "sams")
        filename = request.data.get("filename") or "upload.bin"
        base = settings.CF_MEDIA_BASE_URL.rstrip("/") or "https://cdn.example.com"
        url = f"{base}/{company}/{filename}"
        return Response(
            {
                "url": url,
                "bucket": settings.CF_R2_BUCKET or "shared",
                "note": "Stub upload — replace with real Cloudflare R2 PUT in Phase 7",
            }
        )
