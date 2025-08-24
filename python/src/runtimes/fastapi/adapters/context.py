from typing import Any, Optional, Union, Callable, IO
from io import BytesIO

from fastapi import Request, Response
from fastapi.responses import StreamingResponse, HTMLResponse, JSONResponse

from core.context.runtime_context import RuntimeContext


class FastAPIRuntimeContext(RuntimeContext):
    """Xác định Runtime cho FastAPI, bao gồm các hàm, thuộc tính."""

    def __init__(
        self,
        request: Request,
        response: Response,
        call_next=lambda x: x,
    ):
        super().__init__("fastapi")
        self.request = request
        self.response = response
        self.call_next = call_next
        self._temp_data = {}

    def set_http_status(self, status: int) -> None:
        self.response.status_code = status

    async def get_body(self) -> Any:
        try:
            return await self.request.json()
        except Exception:
            return {}

    def get_temp_data(self, key: str) -> Any:
        return self._temp_data.get(key)

    def get_query(self) -> Any:
        return dict(self.request.query_params)

    def get_params(self) -> Any:
        return dict(self.request.path_params)

    def get_headers(self) -> Any:
        return dict(self.request.headers)

    def set_body(self, body: Union[Callable[[Any], Any], Any]) -> None:
        if callable(body):
            # Nếu body là function, gọi nó với current body
            current_body = getattr(self.request, "_body", None)
            self.request._body = body(current_body)
        else:
            self.request._body = body

    def add_temp_data(self, key: str, data: Any) -> None:
        self._temp_data[key] = data

    def send_streaming(
        self,
        source: Union[IO[bytes], bytes, BytesIO],
        content_type: Optional[str] = None,
    ):
        if isinstance(source, bytes):
            source = BytesIO(source)

        return StreamingResponse(
            source, media_type=content_type or "application/octet-stream"
        )

    def send_json(self, data: Any, meta: Optional[Any] = None):
        response_data = {"data": data}
        if meta is not None:
            response_data["meta"] = meta

        return JSONResponse(content=response_data)

    def send_html(self, html_str: str):
        return HTMLResponse(content=html_str)

    def send_error(self, error: Any):
        # Giả sử error có attributes message và status_code
        error_data = {"error": error.to_plain()}

        status_code = getattr(error, "status_code", 500)
        return JSONResponse(content=error_data, status_code=status_code)

    def next(self, p):
        return self.call_next(p)
