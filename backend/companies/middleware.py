from companies.models import Company


class CompanyContextMiddleware:
    """
    Attach request.company from:
    1. URL kwargs (public storefront: /api/v1/{company}/...)
    2. Header X-Company-Slug (admin context)
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.company = None
        slug = request.headers.get("X-Company-Slug", "").strip().lower()
        if slug:
            request.company = Company.objects.filter(slug=slug, is_active=True).first()
        response = self.get_response(request)
        return response


def get_company_from_slug(slug: str) -> Company | None:
    return Company.objects.filter(slug=slug, is_active=True).first()
