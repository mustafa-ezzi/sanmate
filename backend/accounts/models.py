from django.conf import settings
from django.db import models

from companies.models import Company


class AdminProfile(models.Model):
    class Role(models.TextChoices):
        SUPERADMIN = "superadmin", "Superadmin"
        EDITOR = "editor", "Editor"
        ORDERS = "orders", "Orders"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="admin_profile",
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EDITOR,
    )
    companies = models.ManyToManyField(
        Company,
        blank=True,
        related_name="admins",
        help_text="Companies this user may access in the shared admin panel",
    )
    active_company = models.ForeignKey(
        Company,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    def __str__(self):
        return f"{self.user.username} ({self.role})"
