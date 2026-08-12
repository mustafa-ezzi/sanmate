from django.db import models

from companies.models import Company


class WhatsAppNotifyRecipient(models.Model):
    """
    Team members who each receive order alerts individually.
    Example labels: Owner, Mustafa, Mustansir, Ali.
    """

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="whatsapp_recipients",
    )
    label = models.CharField(max_length=80, help_text="e.g. Mustafa")
    phone = models.CharField(max_length=40)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "label"]
        unique_together = [("company", "phone")]

    def __str__(self):
        return f"{self.label} ({self.phone})"


class NotificationLog(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="notification_logs",
    )
    order_number = models.CharField(max_length=32, blank=True)
    channel = models.CharField(max_length=20, default="whatsapp")
    recipient_phone = models.CharField(max_length=40)
    recipient_label = models.CharField(max_length=80, blank=True)
    success = models.BooleanField(default=False)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
