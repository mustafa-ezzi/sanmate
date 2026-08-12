from django.db import models


class Company(models.Model):
    """Tenant root — SAMS now, AM later (same admin, separate data)."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    logo_url = models.URLField(blank=True)
    theme = models.JSONField(
        default=dict,
        blank=True,
        help_text="Brand tokens e.g. {primary, accent}",
    )
    domains = models.JSONField(
        default=list,
        blank=True,
        help_text="Allowed storefront hostnames for this company",
    )
    is_active = models.BooleanField(default=True)
    storefront_enabled = models.BooleanField(
        default=False,
        help_text="False for AM until its website launches",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "companies"
        ordering = ["name"]

    def __str__(self):
        return self.name


class CompanySettings(models.Model):
    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        related_name="settings",
    )
    currency = models.CharField(max_length=8, default="PKR")
    contact_email = models.EmailField(blank=True)
    ga_measurement_id = models.CharField(
        max_length=64,
        blank=True,
        help_text="GA4 Measurement ID — different per company",
    )
    # Paysafe refs (secrets stay in env; these are account identifiers)
    paysafe_account_id = models.CharField(max_length=128, blank=True)
    paysafe_public_key_hint = models.CharField(
        max_length=64,
        blank=True,
        help_text="Optional short label for which merchant account is wired",
    )
    shipping_notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "company settings"

    def __str__(self):
        return f"Settings · {self.company.slug}"
