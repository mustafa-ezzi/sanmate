# Generated manually for order item color

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="color",
            field=models.CharField(blank=True, max_length=80),
        ),
    ]
