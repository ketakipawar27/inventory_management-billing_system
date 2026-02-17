from rest_framework.viewsets import ModelViewSet
from core.models import Product
from core.serializers.product import ProductSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

    def partial_update(self, request, *args, **kwargs):
        # ❌ Block stock edits from API
        if "stock_quantity" in request.data:
            request.data.pop("stock_quantity")
        return super().partial_update(request, *args, **kwargs)
