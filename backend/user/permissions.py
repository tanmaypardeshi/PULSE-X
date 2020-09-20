from rest_framework import permissions


class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_employee


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_manager


class IsRND(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_rnd
