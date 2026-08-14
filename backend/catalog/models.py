from django.db import models

from companies.models import Company


class Category(models.Model):
    """Child brand / department — created via admin (e.g. Sanmate, Wype)."""

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    name = models.CharField(max_length=120)
    slug = models.SlugField()
    logo_url = models.URLField(blank=True)
    hero_image_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["sort_order", "name"]
        unique_together = [("company", "slug")]

    def __str__(self):
        return f"{self.company.slug} · {self.name}"


class Product(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="products",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    sku = models.CharField(max_length=64)
    short_description = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="For profit estimates in admin dashboard",
    )
    stock = models.PositiveIntegerField(default=0)
    specs = models.JSONField(default=dict, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "name"]
        unique_together = [
            ("company", "slug"),
            ("company", "sku"),
        ]

    def __str__(self):
        return self.name

    @property
    def effective_price(self):
        return self.sale_price if self.sale_price is not None else self.price


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    url = models.URLField(help_text="Cloudflare R2 / Images public URL")
    alt = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.slug} image {self.sort_order}"
