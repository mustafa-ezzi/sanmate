from django.contrib import admin

from .models import AdminProfile


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "active_company")
    list_filter = ("role",)
    filter_horizontal = ("companies",)
