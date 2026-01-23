from rest_framework.viewsets import ModelViewSet
from core.models import Category
from core.serializers.category import CategorySerializer


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
