import os
import django
import json
import re
from django.core.management import call_command
from io import StringIO

#  Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kandivaliPhoolMarket.settings')  # <- change if your settings module name is different
django.setup()

def clean_text(text):
    return re.sub(r'[^\x00-\x7F]+', ' ', text)  # replace non-ASCII with space

def clean_object(obj):
    fields = obj.get("fields", {})
    for key, value in fields.items():
        if isinstance(value, str):
            fields[key] = clean_text(value)
        elif isinstance(value, list):
            fields[key] = [clean_text(v) if isinstance(v, str) else v for v in value]
    return obj

def dump_clean_fixture(app_model, output_file):
    buffer = StringIO()
    call_command('dumpdata', app_model, indent=2, stdout=buffer)
    buffer.seek(0)
    data = json.loads(buffer.read())
    clean_data = [clean_object(obj) for obj in data]

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(clean_data, f, indent=2)

    print(f"Clean fixture saved to {output_file}")

# Run it
dump_clean_fixture('mainApp.Product', 'products_clean.json')
