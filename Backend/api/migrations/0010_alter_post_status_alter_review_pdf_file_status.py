# Generated by Django 5.0.4 on 2024-06-02 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_review_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='status',
            field=models.CharField(choices=[('Ongoing', 'Ongoing'), ('Under_Review', 'Under_Review'), ('Need_changes', 'Need_changes'), ('Reviewed', 'Reviewed')], default='Ongoing', max_length=20),
        ),
        migrations.AlterField(
            model_name='review',
            name='pdf_file_status',
            field=models.CharField(choices=[('Ongoing', 'Ongoing'), ('Under_Review', 'Under_Review'), ('Need_changes', 'Need_changes'), ('Reviewed', 'Reviewed')], default='Ongoing', max_length=20),
        ),
    ]