from django.contrib import admin

from .models import PaymentEvent


@admin.register(PaymentEvent)
class PaymentEventAdmin(admin.ModelAdmin):
    list_display = ("provider", "event_type", "company", "order", "created_at")
    list_filter = ("company", "provider", "event_type")
