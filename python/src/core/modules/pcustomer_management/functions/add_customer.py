# Import from core
from core.context.runtime_context import RuntimeContext
from core.context.internal_context.main import initialize_internal_context
from core.error import AppError, is_standard_error
from core.modules.pcustomer_management.data_model.dao import PCustomerDAO


async def add_customer(ctx: RuntimeContext):
    """
    Thêm thông tin của một khách hàng vào trong hệ thống.

    Args:
        ctx (RuntimeContext): Ngữ cảnh runtime chứa thông tin request.

    Returns:
        dict | AppError: Thông tin khách hàng vừa thêm hoặc lỗi chuẩn hóa.
    """
    try:
        body = await ctx.get_body()

        pcustomer_dao = PCustomerDAO()
        internal_ctx = initialize_internal_context()

        internal_ctx.params = body
        internal_ctx.options["can_catch_error"] = True

        result = await pcustomer_dao.insert_pcustomer(internal_ctx)
        return result

    except Exception as error:
        if is_standard_error(error):
            return error

        err = AppError("Cannot add new potential customer")
        err.as_http_error("InternalServerError")
        return err
