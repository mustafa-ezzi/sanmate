from rest_framework import serializers

from .models import Banner, Carousel, CarouselSlide, Policy


class BannerSerializer(serializers.ModelSerializer):
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
        )


class CarouselSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselSlide
        fields = ("id", "image_url", "caption", "link", "sort_order")


class CarouselSerializer(serializers.ModelSerializer):
    slides = CarouselSlideSerializer(many=True, read_only=True)

    class Meta:
        model = Carousel
        fields = ("id", "key", "name", "slides")


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = (
            "id",
            "policy_type",
            "title",
            "body",
            "version",
            "updated_at",
        )
