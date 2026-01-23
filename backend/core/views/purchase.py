from rest_framework.viewsets import ModelViewSet
from core.models import Purchase
from core.serializers.purchase import PurchaseSerializer


class PurchaseViewSet(ModelViewSet):
    queryset = Purchase.objects.all().prefetch_related("items")
    serializer_class = PurchaseSerializer
