from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views.category import CategoryViewSet
from core.views.product import ProductViewSet
from core.views.purchase import PurchaseViewSet
from core.views.bill import BillViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("purchases", PurchaseViewSet)
router.register("bills", BillViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
