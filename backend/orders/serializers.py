from decimal import Decimal

from rest_framework import serializers

from catalog.models import Product

from .models import Order, OrderItem


class OrderItemWriteSerializer(serializers.Serializer):
    product_slug = serializers.SlugField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=120)
    customer_email = serializers.EmailField(required=False, allow_blank=True)
    customer_phone = serializers.CharField(max_length=40)
    shipping_address = serializers.CharField()
    city = serializers.CharField(max_length=80, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemWriteSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Cart is empty.")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
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


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

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
            "notes",
            "items",
            "created_at",
        )


def create_order_from_payload(company, data) -> Order:
    from django.utils import timezone

    items_data = data["items"]
    slugs = [i["product_slug"] for i in items_data]
    products = {
        p.slug: p
        for p in Product.objects.filter(
            company=company,
            slug__in=slugs,
            is_active=True,
        )
    }
    if len(products) != len(set(slugs)):
        missing = set(slugs) - set(products)
        raise serializers.ValidationError(
            {"items": f"Unknown products: {', '.join(sorted(missing))}"}
        )

    subtotal = Decimal("0")
    line_rows = []
    for row in items_data:
        product = products[row["product_slug"]]
        qty = row["quantity"]
        if product.stock < qty:
            raise serializers.ValidationError(
                {"items": f"Insufficient stock for {product.name}."}
            )
        unit = product.effective_price
        line_total = unit * qty
        subtotal += line_total
        line_rows.append((product, qty, unit, line_total))

    shipping_fee = Decimal("0")
    total = subtotal + shipping_fee
    stamp = timezone.now().strftime("%y%m%d%H%M%S")
    order_number = f"{company.slug.upper()}-{stamp}"

    currency = "PKR"
    try:
        currency = company.settings.currency or "PKR"
    except Exception:
        pass

    order = Order.objects.create(
        company=company,
        order_number=order_number,
        customer_name=data["customer_name"],
        customer_email=data.get("customer_email", ""),
        customer_phone=data["customer_phone"],
        shipping_address=data["shipping_address"],
        city=data.get("city", ""),
        currency=currency,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        notes=data.get("notes", ""),
    )
    for product, qty, unit, line_total in line_rows:
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            sku=product.sku,
            quantity=qty,
            unit_price=unit,
            line_total=line_total,
            cost_price=product.cost_price,
        )
        product.stock = max(0, product.stock - qty)
        product.save(update_fields=["stock", "updated_at"])
    return order
