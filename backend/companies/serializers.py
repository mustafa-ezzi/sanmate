from rest_framework import serializers

from .models import Company, CompanySettings


class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = (
            "currency",
            "contact_email",
            "ga_measurement_id",
            "shipping_notes",
        )


class CompanySerializer(serializers.ModelSerializer):
    settings = CompanySettingsSerializer(read_only=True)

    class Meta:
        model = Company
        fields = (
            "id",
            "name",
            "slug",
            "logo_url",
            "theme",
            "storefront_enabled",
            "settings",
        )
