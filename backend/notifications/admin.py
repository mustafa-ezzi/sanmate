from django.contrib import admin

from .models import NotificationLog, WhatsAppNotifyRecipient


@admin.register(WhatsAppNotifyRecipient)
class WhatsAppNotifyRecipientAdmin(admin.ModelAdmin):
    list_display = ("label", "phone", "company", "is_active", "sort_order")
    list_filter = ("company", "is_active")


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = (
        "channel",
        "recipient_label",
        "recipient_phone",
        "success",
        "order_number",
        "created_at",
    )
    list_filter = ("company", "channel", "success")
