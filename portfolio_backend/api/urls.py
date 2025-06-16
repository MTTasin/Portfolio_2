from django.urls import path
from .views import PortfolioDataView

urlpatterns = [
    path('portfolio-data/', PortfolioDataView.as_view(), name='portfolio-data'),
]