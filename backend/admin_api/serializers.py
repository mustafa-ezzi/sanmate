from rest_framework import serializers

from catalog.models import Category, Product, ProductImage
from cms.models import Banner, Carousel, CarouselSlide, Policy
from companies.models import CompanySettings
from notifications.models import WhatsAppNotifyRecipient
from orders.models import Order, OrderItem


class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "logo_url",
            "hero_image_url",
            "description",
            "sort_order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "url", "alt", "sort_order")
        read_only_fields = ("id",)


class AdminProductSerializer(serializers.ModelSerializer):
    images = AdminProductImageSerializer(many=True, required=False)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_name",
            "name",
            "slug",
            "sku",
            "short_description",
            "description",
            "price",
            "sale_price",
            "cost_price",
            "stock",
            "specs",
            "is_featured",
            "is_active",
            "images",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        product = Product.objects.create(**validated_data)
        for img in images_data:
            ProductImage.objects.create(product=product, **img)
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images_data is not None:
            instance.images.all().delete()
            for img in images_data:
                ProductImage.objects.create(product=instance, **img)
        return instance


class AdminBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = (
            "id",
            "title",
            "subtitle",
            "image_url",
            "cta_label",
            "cta_link",
            "sort_order",
            "is_active",
            "starts_at",
            "ends_at",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class AdminCarouselSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselSlide
        fields = ("id", "image_url", "caption", "link", "sort_order", "is_active")
        read_only_fields = ("id",)


class AdminCarouselSerializer(serializers.ModelSerializer):
    slides = AdminCarouselSlideSerializer(many=True, required=False)

    class Meta:
        model = Carousel
        fields = ("id", "key", "name", "slides")
        read_only_fields = ("id",)

    def create(self, validated_data):
        slides = validated_data.pop("slides", [])
        carousel = Carousel.objects.create(**validated_data)
        for slide in slides:
            CarouselSlide.objects.create(carousel=carousel, **slide)
        return carousel

    def update(self, instance, validated_data):
        slides = validated_data.pop("slides", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if slides is not None:
            instance.slides.all().delete()
            for slide in slides:
                CarouselSlide.objects.create(carousel=instance, **slide)
        return instance


class AdminPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = (
            "id",
            "policy_type",
            "title",
            "body",
            "version",
            "is_published",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at")


class AdminOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_name",
            "sku",
            "quantity",
            "unit_price",
            "line_total",
        )


class AdminOrderSerializer(serializers.ModelSerializer):
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "status",
            "payment_status",
            "customer_name",
            "customer_email",
            "customer_phone",
            "shipping_address",
            "city",
            "currency",
            "subtotal",
            "shipping_fee",
            "total",
            "paysafe_payment_id",
            "whatsapp_notified",
            "notes",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "order_number",
            "subtotal",
            "shipping_fee",
            "total",
            "paysafe_payment_id",
            "whatsapp_notified",
            "items",
            "created_at",
            "updated_at",
        )


class AdminCompanySettingsSerializer(serializers.ModelSerializer):
    storefront_enabled = serializers.BooleanField(
        source="company.storefront_enabled",
        required=False,
    )
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_slug = serializers.CharField(source="company.slug", read_only=True)

    class Meta:
        model = CompanySettings
        fields = (
            "company_name",
            "company_slug",
            "currency",
            "contact_email",
            "ga_measurement_id",
            "paysafe_account_id",
            "paysafe_public_key_hint",
            "shipping_notes",
            "storefront_enabled",
            "updated_at",
        )
        read_only_fields = ("company_name", "company_slug", "updated_at")

    def update(self, instance, validated_data):
        company_data = validated_data.pop("company", {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if "storefront_enabled" in company_data:
            instance.company.storefront_enabled = company_data["storefront_enabled"]
            instance.company.save(update_fields=["storefront_enabled", "updated_at"])
        return instance


class WhatsAppRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppNotifyRecipient
        fields = ("id", "label", "phone", "is_active", "sort_order", "created_at")
        read_only_fields = ("id", "created_at")
