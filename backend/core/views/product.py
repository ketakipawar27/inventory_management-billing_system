from rest_framework.viewsets import ModelViewSet
from core.models import Product
from core.serializers.product import ProductSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

    def perform_update(self, serializer):
        # Even if the serializer marks it read-only,
        # we explicitly ensure stock_quantity isn't changed here
        # unless it's via a Purchase or Bill.
        serializer.save()

    def update(self, request, *args, **kwargs):
        # ❌ Block manual stock edits from PUT/PATCH
        if "stock_quantity" in request.data:
            request.data.pop("stock_quantity")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if "stock_quantity" in request.data:
            request.data.pop("stock_quantity")
        return super().partial_update(request, *args, **kwargs)
