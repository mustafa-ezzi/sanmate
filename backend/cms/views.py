from django.db.models import Q, Prefetch
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response

from companies.middleware import get_company_from_slug

from .models import Banner, Carousel, CarouselSlide, Policy
from .serializers import BannerSerializer, CarouselSerializer, PolicySerializer


def _company_or_404(company_slug):
    company = get_company_from_slug(company_slug)
    if not company or not company.storefront_enabled:
        return None, Response(
            {"detail": "Company storefront not available."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return company, None


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer

    def get_queryset(self):
        company = get_company_from_slug(self.kwargs["company_slug"])
        if not company or not company.storefront_enabled:
            return Banner.objects.none()
        now = timezone.now()
        return Banner.objects.filter(company=company, is_active=True).filter(
            Q(starts_at__isnull=True) | Q(starts_at__lte=now),
            Q(ends_at__isnull=True) | Q(ends_at__gte=now),
        )

    def list(self, request, *args, **kwargs):
        company, err = _company_or_404(self.kwargs["company_slug"])
        if err:
            return err
        return super().list(request, *args, **kwargs)


class CarouselDetailView(generics.RetrieveAPIView):
    serializer_class = CarouselSerializer
    lookup_field = "key"

    def get_queryset(self):
        company = get_company_from_slug(self.kwargs["company_slug"])
        if not company or not company.storefront_enabled:
            return Carousel.objects.none()
        return Carousel.objects.filter(company=company).prefetch_related(
            Prefetch(
                "slides",
                queryset=CarouselSlide.objects.filter(is_active=True),
            )
        )

    def retrieve(self, request, *args, **kwargs):
        company, err = _company_or_404(self.kwargs["company_slug"])
        if err:
            return err
        return super().retrieve(request, *args, **kwargs)


class PolicyDetailView(generics.RetrieveAPIView):
    serializer_class = PolicySerializer
    lookup_field = "policy_type"
    lookup_url_kwarg = "policy_type"

    def get_queryset(self):
        company = get_company_from_slug(self.kwargs["company_slug"])
        if not company or not company.storefront_enabled:
            return Policy.objects.none()
        return Policy.objects.filter(company=company, is_published=True)

    def retrieve(self, request, *args, **kwargs):
        company, err = _company_or_404(self.kwargs["company_slug"])
        if err:
            return err
        return super().retrieve(request, *args, **kwargs)
