from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.middleware import get_company_from_slug

from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    create_order_from_payload,
)


class OrderCreateView(APIView):
    def post(self, request, company_slug):
        company = get_company_from_slug(company_slug)
        if not company or not company.storefront_enabled:
            return Response(
                {"detail": "Company storefront not available."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = create_order_from_payload(company, serializer.validated_data)
        except Exception as exc:
            from rest_framework.exceptions import ValidationError

            if isinstance(exc, ValidationError):
                raise
            # serializer.ValidationError from create helper
            from rest_framework import serializers as drf_serializers

            if isinstance(exc, drf_serializers.ValidationError):
                return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
            raise
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )
