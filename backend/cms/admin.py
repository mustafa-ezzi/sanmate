from django.contrib import admin

from .models import Banner, Carousel, CarouselSlide, Policy


class CarouselSlideInline(admin.TabularInline):
    model = CarouselSlide
    extra = 1


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "sort_order", "is_active")
    list_filter = ("company", "is_active")


@admin.register(Carousel)
class CarouselAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "company")
    list_filter = ("company",)
    inlines = [CarouselSlideInline]


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ("title", "policy_type", "company", "is_published", "version")
    list_filter = ("company", "policy_type", "is_published")
