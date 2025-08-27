# Import from core
from core.context.runtime_context import RuntimeContext
from core.context.internal_context.main import initialize_internal_context
from core.error import AppError, is_standard_error
from core.modules.pcustomer_management.data_model.dao import PCustomerDAO


async def get_pcustomers(ctx: RuntimeContext):
    """
    Lấy thông tin của nhiều khách hàng ở trong hệ thống.

    Args:
        ctx (RuntimeContext): Ngữ cảnh runtime chứa thông tin request.

    Returns:
        dict | AppError: Danh sách thông tin khách hàng hoặc lỗi chuẩn hóa.
    """
    try:
        query = ctx.get_query()

        pcustomer_dao = PCustomerDAO()
        internal_ctx = initialize_internal_context()

        internal_ctx.params = {
            "limit": query.get("limit", "10"),
            "start_key": query.get("startKey"),
        }
        internal_ctx.options["can_catch_error"] = True

        result = await pcustomer_dao.list_pcustomers(internal_ctx)
        return result

    except Exception as error:
        if is_standard_error(error):
            return error

        err = AppError("Cannot find list of potential customers.")
        err.as_http_error("InternalServerError")
        return err
