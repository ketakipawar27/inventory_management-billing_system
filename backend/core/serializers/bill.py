from rest_framework import serializers
from django.db import transaction
from core.models import Bill, BillItem, Product


class BillItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    price_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Invalid or inactive product.")
        return value

class BillSerializer(serializers.ModelSerializer):
    items = BillItemInputSerializer(many=True)

    class Meta:
        model = Bill
        fields = ("id", "customer_name", "bill_date", "items", "total_amount")
        read_only_fields = ("total_amount",)

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        bill = Bill.objects.create(**validated_data)

        total_amount = 0

        for item in items_data:
            product = Product.objects.select_for_update().get(
                id=item["product_id"]
            )

            quantity = item["quantity"]

            # 🚨 Critical check
            if product.stock_quantity < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock for {product.name}"
                )

            price_per_unit = item["price_per_unit"]
            total_price = quantity * price_per_unit

            BillItem.objects.create(
                bill=bill,
                product=product,
                quantity=quantity,
                price_per_unit=price_per_unit,
                total_price=total_price,
            )

            # Update stock
            product.stock_quantity -= quantity
            product.save(update_fields=["stock_quantity"])

            total_amount += total_price

        bill.total_amount = total_amount
        bill.save(update_fields=["total_amount"])

        return bill
