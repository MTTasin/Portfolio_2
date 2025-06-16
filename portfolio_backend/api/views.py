from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile, Skill, Project, SocialLink
from .serializers import UserProfileSerializer, SkillSerializer, ProjectSerializer, SocialLinkSerializer

class PortfolioDataView(APIView):
    """
    A view to provide all necessary portfolio data in a single request.
    """
    def get(self, request, *args, **kwargs):
        # Fetch the first (and only) UserProfile instance
        profile = UserProfile.objects.first()
        # Fetch all other objects
        skills = Skill.objects.all()
        projects = Project.objects.all()
        social_links = SocialLink.objects.all()

        # Serialize the data
        profile_data = UserProfileSerializer(profile).data if profile else {}
        skills_data = SkillSerializer(skills, many=True).data
        projects_data = ProjectSerializer(projects, many=True).data
        social_links_data = SocialLinkSerializer(social_links, many=True).data
        
        # Combine into a single response object
        combined_data = {
            'profile': profile_data,
            'skills': [skill['name'] for skill in skills_data], # Send as a simple list of strings
            'projects': projects_data,
            'social_links': social_links_data
        }
        
        return Response(combined_data)