# Generated by Django 3.0.4 on 2020-03-30 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('safecracker', '0004_answer'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='points',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=5),
            preserve_default=False,
        ),
    ]