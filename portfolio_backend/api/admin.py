from django.contrib import admin
from .models import UserProfile, Skill, Project, SocialLink

admin.site.register(UserProfile)

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'live_demo_url', 'github_repo_url')
    list_editable = ('order',)

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'icon_name', 'order')
    list_editable = ('order',)