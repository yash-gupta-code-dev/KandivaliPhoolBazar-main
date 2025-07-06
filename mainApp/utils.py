# your_app/utils.py
from django.core.mail import send_mail
from django.conf import settings


def send_email_util(address, subject, message):
    if address and subject and message:
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [address])
            return "Email sent successfully"
        except Exception as e:
            return f"Error sending email: {e}"
    return "All fields are required"
