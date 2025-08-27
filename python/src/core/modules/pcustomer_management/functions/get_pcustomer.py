# Import from core
from core.context.runtime_context import RuntimeContext
from core.context.internal_context.main import initialize_internal_context
from core.error import AppError, is_standard_error
from core.modules.pcustomer_management.data_model.dao import PCustomerDAO


async def get_pcustomer(ctx: RuntimeContext):
    """
    Lấy thông tin của một khách hàng ở trong hệ thống.

    Args:
        ctx (RuntimeContext): Ngữ cảnh runtime chứa thông tin request.

    Returns:
        dict | AppError: Thông tin khách hàng hoặc lỗi chuẩn hóa.
    """
    try:
        params = ctx.get_params()

        pcustomer_dao = PCustomerDAO()
        internal_ctx = initialize_internal_context()

        internal_ctx.params = {"query": {"id": params.get("id")}}
        internal_ctx.options["can_catch_error"] = True

        result = await pcustomer_dao.get_pcustomer(internal_ctx)
        return result

    except Exception as error:
        if is_standard_error(error):
            return error

        err = AppError("Cannot get potential customer")
        err.as_http_error("InternalServerError")
        return err
