from .models import User
from django.http import HttpResponseForbidden

#본인인지 확인하는 작업
def account_ownership_required(func):
    def decorated(request, *args, **kwargs):
        print(kwargs)
        user = User.objects.get(email=kwargs['email'])
        if not user == request.user:
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)
    return decorated