from rest_framework import serializers
from .models import UserProfile, Skill, Project, SocialLink

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['name', 'tagline', 'bio', 'profile_image']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name']

class ProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.SerializerMethodField()
    # Rename fields to match frontend expectations
    liveDemo = serializers.URLField(source='live_demo_url')
    githubRepo = serializers.URLField(source='github_repo_url')

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'technologies', 'image', 'liveDemo', 'githubRepo']
    
    def get_technologies(self, obj):
        return obj.get_technologies_list()

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['name', 'url', 'icon_name']