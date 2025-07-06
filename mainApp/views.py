from django.shortcuts import render
from django.shortcuts import redirect
from .models import Product, Category, Location
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .utils import send_email_util
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.paginator import Paginator


# Create your views here.


def BaseHTML(request):
    return render(request, "base.html")


def HomePageView(request):
    return render(request, "homepage.html")



class ProductListView(APIView):
    def get(self, request, format=None):
        # Get basic products ordered by newest first
        basic_products = Product.objects.filter(subcategory='basic').order_by('-created_at')
        # Get premium products ordered by newest first
        premium_products = Product.objects.filter(subcategory='premium').order_by('-created_at')
        
        # Combine results (basic first, then premium)
        products = list(basic_products) + list(premium_products)
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def ProductPage(request):
    product_list = Product.objects.all().order_by("product_id")
    paginator = Paginator(product_list, 10)  # Show 20 products per page

    page_number = request.GET.get("page")  # Get the page number from query parameters
    product = paginator.get_page(page_number)  # Get the products for that page

    return render(request, "product.html", {"product": product})


def product_detail(request, product_id):
    # Get the product or return 404 if not found
    product = get_object_or_404(Product, product_id=product_id)
    print(product)
    # Check if the request is an AJAX request (for template loading)
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        # Return just the product detail template
        return render(request, "product_view.html", {"product": product})

    # Regular request - return full page
    return render(request, "product_view.html", {"product": product})


@csrf_exempt  # Optional if using CSRF token in JS
def send_email(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        full_message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

        send_mail(
            subject="New Contact Form Submission",
            message=full_message,
            from_email="your_email@gmail.com",
            recipient_list=["contact@yourdomain.com"],
            fail_silently=False,
        )
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "invalid request"}, status=400)


def map_view(request):
    # Get the first location (or filter as needed)
    location = Location.objects.first()
    context = {
        'maps_embed_url': location.maps_embed_url if location else None
    }
    return render(request, 'map_template.html', context)



