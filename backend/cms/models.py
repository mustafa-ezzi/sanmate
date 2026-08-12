from django.db import models

from companies.models import Company


class Banner(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="banners",
    )
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    image_url = models.URLField(blank=True)
    cta_label = models.CharField(max_length=80, blank=True)
    cta_link = models.CharField(max_length=300, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return f"{self.company.slug} · {self.title}"


class Carousel(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="carousels",
    )
    key = models.SlugField(help_text="e.g. home-hero, home-brands")
    name = models.CharField(max_length=120)

    class Meta:
        unique_together = [("company", "key")]
        ordering = ["key"]

    def __str__(self):
        return f"{self.company.slug} · {self.key}"


class CarouselSlide(models.Model):
    carousel = models.ForeignKey(
        Carousel,
        on_delete=models.CASCADE,
        related_name="slides",
    )
    image_url = models.URLField(blank=True)
    caption = models.CharField(max_length=200, blank=True)
    link = models.CharField(max_length=300, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.carousel.key} slide {self.sort_order}"


class Policy(models.Model):
    class PolicyType(models.TextChoices):
        PRIVACY = "privacy", "Privacy"
        RETURN = "return", "Return"
        EXCHANGE = "exchange", "Exchange"
        SHIPPING = "shipping", "Shipping"
        TERMS = "terms", "Terms"

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="policies",
    )
    policy_type = models.CharField(max_length=20, choices=PolicyType.choices)
    title = models.CharField(max_length=200)
    body = models.TextField()
    version = models.CharField(max_length=20, default="1.0")
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "policies"
        unique_together = [("company", "policy_type")]

    def __str__(self):
        return f"{self.company.slug} · {self.policy_type}"
