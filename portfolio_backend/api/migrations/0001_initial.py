# Generated by Django 5.2.3 on 2025-06-16 08:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('technologies', models.CharField(max_length=500)),
                ('live_demo_url', models.URLField(blank=True, null=True)),
                ('github_repo_url', models.URLField(blank=True, null=True)),
                ('image_url', models.URLField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(default=0, help_text='Order in which to display the project.')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
