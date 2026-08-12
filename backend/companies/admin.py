from django.contrib import admin

from .models import Company, CompanySettings


class CompanySettingsInline(admin.StackedInline):
    model = CompanySettings
    extra = 0


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "is_active",
        "storefront_enabled",
        "updated_at",
    )
    list_filter = ("is_active", "storefront_enabled")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CompanySettingsInline]


@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ("company", "currency", "ga_measurement_id", "contact_email")
