from django.db import models
import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

class UserProfile(models.Model):
    """
    Singleton model to store the main user's profile information.
    """
    name = models.CharField(max_length=100, default="John Doe")
    tagline = models.CharField(max_length=200, default="Full Stack Developer | Animation Enthusiast")
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Skill(models.Model):
    """
    Represents a skill to be displayed in the portfolio.
    """
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return self.name

class Project(models.Model):
    """
    Represents a project in the portfolio.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies.")
    image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    live_demo_url = models.URLField(max_length=200, blank=True)
    github_repo_url = models.URLField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which to display the project.")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def get_technologies_list(self):
        """Returns the technologies as a list."""
        return [tech.strip() for tech in self.technologies.split(',')]

class SocialLink(models.Model):
    """
    Represents a social media link.
    """
    name = models.CharField(max_length=50, help_text="e.g., 'GitHub', 'LinkedIn'")
    url = models.URLField(max_length=200)
    icon_name = models.CharField(max_length=50, help_text="e.g., 'Github', 'Linkedin'. Use names from lucide-react library.")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name
    



@receiver(pre_save, sender=UserProfile)
def delete_old_profile_image_on_update(sender, instance, **kwargs):
    """
    Deletes the old profile image file when a UserProfile is updated with a new image.
    """
    if not instance.pk:
        return False
    try:
        old_instance = sender.objects.get(pk=instance.pk)
        old_file = old_instance.profile_image
    except sender.DoesNotExist:
        return False

    new_file = instance.profile_image
    if old_file and old_file != new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

@receiver(post_delete, sender=UserProfile)
def delete_profile_image_on_delete(sender, instance, **kwargs):
    """
    Deletes the profile image file when a UserProfile instance is deleted.
    """
    if instance.profile_image:
        if os.path.isfile(instance.profile_image.path):
            os.remove(instance.profile_image.path)

@receiver(pre_save, sender=Project)
def delete_old_project_image_on_update(sender, instance, **kwargs):
    """
    Deletes the old project image file when a Project is updated with a new image.
    """
    if not instance.pk:
        return False
    try:
        old_instance = sender.objects.get(pk=instance.pk)
        old_file = old_instance.image
    except sender.DoesNotExist:
        return False

    new_file = instance.image
    if old_file and old_file != new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

@receiver(post_delete, sender=Project)
def delete_project_image_on_delete(sender, instance, **kwargs):
    """
    Deletes the project image file when a Project instance is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)