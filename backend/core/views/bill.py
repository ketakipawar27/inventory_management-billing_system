from rest_framework.viewsets import ModelViewSet
from core.models import Bill
from core.serializers.bill import BillSerializer


class BillViewSet(ModelViewSet):
    queryset = Bill.objects.all().prefetch_related("items")
    serializer_class = BillSerializer
