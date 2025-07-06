from rest_framework import serializers
from .models import Product, Category
from django.utils.text import slugify

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field="name"
    )
    subcategory = serializers.ChoiceField(choices=Product.SUBCATEGORY_CHOICES)

    class Meta:
        model = Product
        fields = "__all__"

    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Product name must be at least 3 characters long."
            )
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Description cannot be empty.")
        return value

    def validate_subcategory(self, value):
        if value not in dict(Product.SUBCATEGORY_CHOICES):
            raise serializers.ValidationError("Invalid subcategory selected.")
        return value

    def validate_category(self, value):
        if not value.is_active:
            raise serializers.ValidationError("Selected category is not active.")
        return value

    def validate(self, data):
        # Extra layer of validation if needed
        return data

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify(validated_data["name"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify(validated_data.get("name", instance.name))
        return super().update(instance, validated_data)