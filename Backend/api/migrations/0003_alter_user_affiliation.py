# Generated by Django 5.0.3 on 2024-03-29 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_user_affiliation_alter_user_default_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='affiliation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
