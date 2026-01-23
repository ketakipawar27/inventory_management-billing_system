from django.contrib import admin
from .models import (
    Category, Product,
    Purchase, PurchaseItem,
    Bill, BillItem
)

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Purchase)
admin.site.register(PurchaseItem)
admin.site.register(Bill)
admin.site.register(BillItem)
