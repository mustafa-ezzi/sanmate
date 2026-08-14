"""
Seed dummy development data for SAMS Enterprises only.

Usage:
  python manage.py seed_dev
  python manage.py seed_dev --flush
"""

import json
from decimal import Decimal
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import AdminProfile
from catalog.models import Category, Product, ProductImage
from cms.models import Banner, Carousel, CarouselSlide, Policy
from companies.models import Company, CompanySettings
from notifications.models import WhatsAppNotifyRecipient

POLICIES_FILE = (
    Path(__file__).resolve().parents[3] / "cms" / "data" / "sams_policies.json"
)

class Command(BaseCommand):
    help = "Seed SAMS Enterprises dummy catalogue for development"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing SAMS company data first",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            Company.objects.filter(slug="sams").delete()
            # Remove legacy AM stub if present (admin no longer supports it)
            Company.objects.filter(slug="am").delete()
            self.stdout.write(self.style.WARNING("Flushed company seed data"))

        sams = self._upsert_company(
            slug="sams",
            name="SAMS Enterprises",
            storefront_enabled=True,
            theme={
                "primary": "#1B1D63",
                "accent": "#F5630D",
            },
            logo_url="https://cdn.example.com/sams/logo.jpg",
            contact_email="info.samsenterprise.pk@gmail.com",
            ga_measurement_id="G-SAMS-DEV-PLACEHOLDER",
            paysafe_account_id="paysafe-sams-dev-account",
        )

        self._seed_sams_catalogue(sams)
        self._seed_whatsapp_recipients(sams)
        self._seed_admin_user(sams)

        self.stdout.write(self.style.SUCCESS("Dev seed complete."))
        self.stdout.write("  SAMS storefront: ON  -> /api/v1/sams/")
        self.stdout.write("  Admin panel:     SAMS only -> /admin")
        self.stdout.write("  Admin user:      admin / admin123")
        self.stdout.write("  Django admin:    /django-admin/")

    def _upsert_company(
        self,
        *,
        slug,
        name,
        storefront_enabled,
        theme,
        logo_url,
        contact_email,
        ga_measurement_id,
        paysafe_account_id,
    ):
        company, created = Company.objects.update_or_create(
            slug=slug,
            defaults={
                "name": name,
                "logo_url": logo_url,
                "theme": theme,
                "domains": [],
                "is_active": True,
                "storefront_enabled": storefront_enabled,
            },
        )
        CompanySettings.objects.update_or_create(
            company=company,
            defaults={
                "currency": "PKR",
                "contact_email": contact_email,
                "ga_measurement_id": ga_measurement_id,
                "paysafe_account_id": paysafe_account_id,
                "paysafe_public_key_hint": f"{slug}-separate-bank-account",
                "shipping_notes": "Pakistan-wide shipping (dummy).",
            },
        )
        action = "Created" if created else "Updated"
        self.stdout.write(f"  {action} company: {slug}")
        return company

    def _seed_sams_catalogue(self, sams):
        # Child brands — examples only; production brands come from admin CRUD
        sanmate, _ = Category.objects.update_or_create(
            company=sams,
            slug="sanmate",
            defaults={
                "name": "Sanmate",
                "logo_url": "https://cdn.example.com/sams/brands/sanmate.png",
                "hero_image_url": "https://cdn.example.com/sams/brands/sanmate-hero.jpg",
                "description": "Premium sanitary fittings — waste pipes, bottle traps, and more.",
                "sort_order": 1,
                "is_active": True,
            },
        )
        wyped, _ = Category.objects.update_or_create(
            company=sams,
            slug="wyped",
            defaults={
                "name": "Wyped",
                "logo_url": "https://cdn.example.com/sams/brands/wyped.png",
                "hero_image_url": "https://cdn.example.com/sams/brands/wyped-hero.jpg",
                "description": "Household cleaning — wipers, mops, and everyday essentials.",
                "sort_order": 2,
                "is_active": True,
            },
        )

        products = [
            {
                "category": sanmate,
                "name": "Sanmate Waste Pipe",
                "slug": "sanmate-waste-pipe",
                "sku": "SM-WP-001",
                "short_description": "Durable chrome-finish waste pipe for modern washbasins.",
                "description": "Dummy product for development. Chrome-plated waste pipe with flexible joint.",
                "price": Decimal("1890.00"),
                "sale_price": Decimal("1590.00"),
                "cost_price": Decimal("900.00"),
                "stock": 120,
                "is_featured": True,
                "specs": {"material": "Chrome-plated metal", "length": "Variable"},
                "images": [
                    "https://cdn.example.com/sams/products/waste-pipe-1.jpg",
                    "https://cdn.example.com/sams/products/waste-pipe-2.jpg",
                ],
            },
            {
                "category": sanmate,
                "name": "Sanmate Bottle Trap",
                "slug": "sanmate-bottle-trap",
                "sku": "SM-BT-001",
                "short_description": "Compact bottle trap with clean seal design.",
                "description": "Dummy product for development. Easy-clean bottle trap.",
                "price": Decimal("2490.00"),
                "sale_price": None,
                "cost_price": Decimal("1100.00"),
                "stock": 80,
                "is_featured": True,
                "specs": {"finish": "Chrome", "inlet": "1-1/4\""},
                "images": [
                    "https://cdn.example.com/sams/products/bottle-trap-1.jpg",
                ],
            },
            {
                "category": wyped,
                "name": "Wyped Floor Mop Pro",
                "slug": "wyped-floor-mop-pro",
                "sku": "WY-MP-001",
                "short_description": "Microfiber mop for quick everyday cleaning.",
                "description": "Dummy Wyped mop product for multi-brand catalogue testing.",
                "price": Decimal("1290.00"),
                "sale_price": Decimal("1090.00"),
                "cost_price": Decimal("450.00"),
                "stock": 200,
                "is_featured": True,
                "specs": {"head": "Microfiber", "handle": "Telescopic"},
                "images": [
                    "https://cdn.example.com/sams/products/mop-1.jpg",
                ],
            },
            {
                "category": wyped,
                "name": "Wyped Window Wiper",
                "slug": "wyped-window-wiper",
                "sku": "WY-WW-001",
                "short_description": "Streak-free window wiper blade.",
                "description": "Dummy cleaning accessory for SAMS catalogue.",
                "price": Decimal("690.00"),
                "sale_price": None,
                "cost_price": Decimal("220.00"),
                "stock": 150,
                "is_featured": False,
                "specs": {"blade": "Rubber", "width": "30cm"},
                "images": [
                    "https://cdn.example.com/sams/products/wiper-1.jpg",
                ],
            },
        ]

        for data in products:
            images = data.pop("images")
            product, _ = Product.objects.update_or_create(
                company=sams,
                slug=data["slug"],
                defaults={
                    **data,
                    "company": sams,
                    "is_active": True,
                },
            )
            product.images.all().delete()
            for i, url in enumerate(images):
                ProductImage.objects.create(
                    product=product,
                    url=url,
                    alt=product.name,
                    sort_order=i,
                )

        Banner.objects.update_or_create(
            company=sams,
            title="Welcome to SAMS Enterprises",
            defaults={
                "subtitle": "Household brands you trust — Sanmate & Wyped",
                "image_url": "https://cdn.example.com/sams/banners/home-hero.jpg",
                "cta_label": "Shop now",
                "cta_link": "/products",
                "sort_order": 0,
                "is_active": True,
            },
        )

        carousel, _ = Carousel.objects.update_or_create(
            company=sams,
            key="home-hero",
            defaults={"name": "Home hero"},
        )
        carousel.slides.all().delete()
        CarouselSlide.objects.create(
            carousel=carousel,
            image_url="https://cdn.example.com/sams/carousel/slide-1.jpg",
            caption="Sanmate sanitary",
            link="/brands/sanmate",
            sort_order=0,
            is_active=True,
        )
        CarouselSlide.objects.create(
            carousel=carousel,
            image_url="https://cdn.example.com/sams/carousel/slide-2.jpg",
            caption="Wyped cleaning",
            link="/brands/wyped",
            sort_order=1,
            is_active=True,
        )

        with POLICIES_FILE.open(encoding="utf-8") as f:
            policy_rows = json.load(f)

        for row in policy_rows:
            Policy.objects.update_or_create(
                company=sams,
                policy_type=row["policy_type"],
                defaults={
                    "title": row["title"],
                    "body": row["body"],
                    "version": row.get("version", "1.0"),
                    "is_published": True,
                },
            )

        self.stdout.write("  Seeded SAMS categories, products, banners, policies")

    def _seed_whatsapp_recipients(self, sams):
        team = [
            ("Owner", "03363399445", 0),
            ("Mustafa", "03000000001", 1),
            ("Mustansir", "03000000002", 2),
            ("Ali", "03000000003", 3),
        ]
        for label, phone, order in team:
            WhatsAppNotifyRecipient.objects.update_or_create(
                company=sams,
                phone=phone,
                defaults={
                    "label": label,
                    "is_active": True,
                    "sort_order": order,
                },
            )
        self.stdout.write("  Seeded WhatsApp team recipients (4)")

    def _seed_admin_user(self, sams):
        User = get_user_model()
        user, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@samsenterprise.pk",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            user.set_password("admin123")
            user.save()
        profile, _ = AdminProfile.objects.get_or_create(
            user=user,
            defaults={"role": AdminProfile.Role.SUPERADMIN},
        )
        profile.role = AdminProfile.Role.SUPERADMIN
        profile.active_company = sams
        profile.save()
        profile.companies.set([sams])
        self.stdout.write(
            "  Admin user ready" + (" (created)" if created else " (exists)")
        )
