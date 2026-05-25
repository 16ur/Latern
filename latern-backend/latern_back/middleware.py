from django.conf import settings


class ApiSessionCookieMiddleware:
    """Keep API sessions separate from Django admin sessions on localhost."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        is_api_request = request.path.startswith("/api/")
        session_cookie_name = settings.SESSION_COOKIE_NAME
        api_cookie_name = settings.API_SESSION_COOKIE_NAME

        if is_api_request:
            api_session_key = request.COOKIES.get(api_cookie_name)

            if api_session_key:
                request.COOKIES[session_cookie_name] = api_session_key
            else:
                request.COOKIES.pop(session_cookie_name, None)

        response = self.get_response(request)

        if is_api_request and session_cookie_name in response.cookies:
            source_cookie = response.cookies[session_cookie_name]
            response.cookies[api_cookie_name] = source_cookie.value
            target_cookie = response.cookies[api_cookie_name]

            for key in source_cookie.keys():
                if source_cookie[key]:
                    target_cookie[key] = source_cookie[key]

            target_cookie["path"] = settings.API_SESSION_COOKIE_PATH
            del response.cookies[session_cookie_name]

        return response
