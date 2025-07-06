import json
from mainApp.models import Product

products = Product.objects.values("name", "slug", "description", "category")

with open("products.json", "w", encoding="utf-8") as f:
    json.dump(list(products), f, indent=2, ensure_ascii=False)
