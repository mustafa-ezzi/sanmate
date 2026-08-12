from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "company",
        "customer_name",
        "status",
        "payment_status",
        "total",
        "currency",
        "created_at",
    )
    list_filter = ("company", "status", "payment_status")
    search_fields = ("order_number", "customer_name", "customer_phone")
    inlines = [OrderItemInline]
