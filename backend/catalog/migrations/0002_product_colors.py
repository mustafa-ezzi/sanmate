# Generated manually for colors support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="colors",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text='Optional color options, e.g. [{"name":"Black","hex":"#111111"}]',
            ),
        ),
    ]
