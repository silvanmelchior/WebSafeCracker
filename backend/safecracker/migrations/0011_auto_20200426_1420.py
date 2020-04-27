# Generated by Django 3.0.4 on 2020-04-26 12:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('safecracker', '0010_taskview'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='competitor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='safecracker.Competitor'),
        ),
        migrations.AlterField(
            model_name='answer',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='safecracker.Task'),
        ),
        migrations.AlterField(
            model_name='taskview',
            name='competitor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='safecracker.Competitor'),
        ),
        migrations.AlterField(
            model_name='taskview',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='safecracker.Task'),
        ),
    ]