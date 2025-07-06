import site
from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product)
admin.site.register(Category)

admin.site.site_header = "Kandivali Phool Market"
admin.site.site_title = "Kandivali Phool Market"
admin.site.index_title = "Welcome to the Admin Area"
