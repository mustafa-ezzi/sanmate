from rest_framework.exceptions import NotFound

from companies.models import Company

ADMIN_COMPANY_SLUG = "sams"


def get_admin_company(request=None) -> Company:
    """
    Admin panel is SAMS Enterprises only.
    No other company context is supported.
    """
    company = Company.objects.filter(slug=ADMIN_COMPANY_SLUG, is_active=True).first()
    if not company:
        raise NotFound("SAMS Enterprises company is not set up. Run seed_dev.")
    return company
