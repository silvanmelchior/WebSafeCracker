# Generated by Django 3.0.4 on 2020-04-08 13:09

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('safecracker', '0006_setting_value_dec'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='description',
            field=ckeditor.fields.RichTextField(),
        ),
    ]
