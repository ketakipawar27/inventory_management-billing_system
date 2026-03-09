from rest_framework import serializers
from django.db import transaction
from core.models import Purchase, PurchaseItem, Product
from decimal import Decimal


class PurchaseItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    price_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Invalid or inactive product.")
        return value

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemInputSerializer(many=True)

    class Meta:
        model = Purchase
        fields = ("id", "dealer_name", "purchase_date", "items", "total_amount")
        read_only_fields = ("total_amount",)

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        purchase = Purchase.objects.create(**validated_data)

        total_amount = Decimal("0.00")

        for item in items_data:
            product = Product.objects.select_for_update().get(
                id=item["product_id"]
            )

            quantity = Decimal(str(item["quantity"]))
            price_per_unit = Decimal(str(item["price_per_unit"]))
            total_price = quantity * price_per_unit

            # Create purchase item record
            PurchaseItem.objects.create(
                purchase=purchase,
                product=product,
                quantity=item["quantity"],
                price_per_unit=item["price_per_unit"],
                total_price=total_price,
            )

            # 🧮 WEIGHTED AVERAGE COST CALCULATION
            current_stock = Decimal(str(product.stock_quantity))
            current_avg_cost = Decimal(str(product.purchase_price))

            total_value_before = current_stock * current_avg_cost
            total_value_added = quantity * price_per_unit
            total_quantity_after = current_stock + quantity

            if total_quantity_after > 0:
                new_avg_cost = (total_value_before + total_value_added) / total_quantity_after
                product.purchase_price = new_avg_cost

            # 🏷️ UPDATE LATEST PURCHASE PRICE (For display to owner)
            product.latest_purchase_price = item["price_per_unit"]

            # ⬆️ Update stock quantity
            product.stock_quantity += item["quantity"]
            product.save(update_fields=["stock_quantity", "purchase_price", "latest_purchase_price"])

            total_amount += total_price

        purchase.total_amount = total_amount
        purchase.save(update_fields=["total_amount"])

        return purchase
