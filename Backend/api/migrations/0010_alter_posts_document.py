# Generated by Django 5.0 on 2024-02-03 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_posts_document'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='document',
            field=models.FileField(upload_to=''),
        ),
    ]
