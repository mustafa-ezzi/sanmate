from django.db import models

from companies.models import Company
from orders.models import Order


class PaymentEvent(models.Model):
    """Audit log for Paysafe webhooks / payment attempts (per company)."""

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="payment_events",
    )
    order = models.ForeignKey(
        Order,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payment_events",
    )
    provider = models.CharField(max_length=40, default="paysafe")
    event_type = models.CharField(max_length=80)
    external_id = models.CharField(max_length=128, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.provider} · {self.event_type}"
