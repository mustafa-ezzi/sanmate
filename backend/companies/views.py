from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order

from .models import Company
from .serializers import CompanySerializer


class PublicCompanyDetailView(APIView):
    """Storefront bootstrap: company theme + settings (currency, GA id)."""

    def get(self, request, company_slug):
        company = Company.objects.filter(
            slug=company_slug,
            is_active=True,
            storefront_enabled=True,
        ).select_related("settings").first()
        if not company:
            return Response(
                {"detail": "Company storefront not available."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(CompanySerializer(company).data)


class AdminCompanyListView(APIView):
    """SAMS-only — admin panel does not expose AM or other companies."""

    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        from companies.company_context import get_admin_company

        company = get_admin_company(request)
        return Response([CompanySerializer(company).data])


class AdminCompanyContextView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        from companies.company_context import get_admin_company

        # Ignore requested slug — admin is always SAMS
        company = get_admin_company(request)
        profile = getattr(request.user, "admin_profile", None)
        if profile:
            profile.active_company = company
            profile.save(update_fields=["active_company"])
        request.session["admin_company_slug"] = company.slug
        return Response({"active_company": CompanySerializer(company).data})


class AdminDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        from datetime import timedelta
        from decimal import Decimal

        from django.db.models.functions import TruncDate

        from catalog.models import Category, Product
        from companies.company_context import get_admin_company
        from orders.models import OrderItem

        company = get_admin_company(request)
        if not company:
            return Response(
                {"detail": "Company not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        today = timezone.localdate()
        start_30 = today - timedelta(days=29)
        orders = Order.objects.filter(company=company)
        paid = orders.filter(payment_status=Order.PaymentStatus.PAID)
        today_orders = orders.filter(created_at__date=today)

        revenue = paid.aggregate(total=Sum("total"))["total"] or Decimal("0")
        sales_count = paid.count()

        cost = Decimal("0")
        for order in paid.prefetch_related("items"):
            for line in order.items.all():
                if line.cost_price is not None:
                    cost += line.cost_price * line.quantity
        profit = float(revenue) - float(cost)

        products_qs = Product.objects.filter(company=company)
        low_stock_qs = products_qs.filter(is_active=True, stock__lte=5)

        paid_30 = paid.filter(created_at__date__gte=start_30)
        revenue_rows = (
            paid_30.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(total=Sum("total"), count=Count("id"))
            .order_by("day")
        )
        by_day = {
            row["day"].isoformat(): {
                "revenue": float(row["total"] or 0),
                "orders": row["count"],
            }
            for row in revenue_rows
            if row["day"]
        }
        revenue_by_day = []
        orders_by_day = []
        for i in range(30):
            day = start_30 + timedelta(days=i)
            key = day.isoformat()
            point = by_day.get(key, {"revenue": 0.0, "orders": 0})
            revenue_by_day.append({"date": key, "value": point["revenue"]})
            orders_by_day.append({"date": key, "value": point["orders"]})

        top_products = []
        top_rows = (
            OrderItem.objects.filter(
                order__company=company,
                order__payment_status=Order.PaymentStatus.PAID,
            )
            .values("product_name", "sku")
            .annotate(units=Sum("quantity"), revenue=Sum("line_total"))
            .order_by("-units")[:6]
        )
        for row in top_rows:
            top_products.append(
                {
                    "name": row["product_name"],
                    "sku": row["sku"],
                    "units": row["units"] or 0,
                    "revenue": float(row["revenue"] or 0),
                }
            )

        recent_orders = [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "status": o.status,
                "payment_status": o.payment_status,
                "total": str(o.total),
                "created_at": o.created_at.isoformat(),
            }
            for o in orders.order_by("-created_at")[:8]
        ]

        return Response(
            {
                "company": company.slug,
                "currency": getattr(
                    getattr(company, "settings", None),
                    "currency",
                    "PKR",
                ),
                "orders_today": today_orders.count(),
                "orders_total": orders.count(),
                "sales_count": sales_count,
                "revenue": float(revenue),
                "profit_estimate": profit,
                "low_stock_products": low_stock_qs.count(),
                "products_count": products_qs.count(),
                "categories_count": Category.objects.filter(
                    company=company
                ).count(),
                "orders_by_status": list(
                    orders.values("status").annotate(count=Count("id"))
                ),
                "revenue_by_day": revenue_by_day,
                "orders_by_day": orders_by_day,
                "top_products": top_products,
                "recent_orders": recent_orders,
                "low_stock": [
                    {
                        "id": p.id,
                        "name": p.name,
                        "sku": p.sku,
                        "stock": p.stock,
                    }
                    for p in low_stock_qs.order_by("stock")[:8]
                ],
            }
        )
