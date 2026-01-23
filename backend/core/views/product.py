from rest_framework.viewsets import ModelViewSet
from core.models import Product
from core.serializers.product import ProductSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
