from core.context.pipeline import Pipeline

# Import constants
from core.modules.auth.constants import TEAMS, ROLES

from core.error import AppError, is_standard_error
from core.modules.auth.functions import (
    create_roles_check_step_executor,
    create_teams_check_step_executor,
    create_verify_token_step_executor,
)

# Import functions
from core.modules.pcustomer_management.functions import (
    get_pcustomer,
    get_pcustomers,
    add_customer,
    update_customer,
    delete_customer,
)

get_customer_pipeline = Pipeline("Get Customer Pipeline")
get_customers_pipeline = Pipeline("Get Customers Pipeline")
add_customer_pipeline = Pipeline("Add Customer Pipeline")
update_customer_pipeline = Pipeline("Update Customer Pipeline")
delete_customer_pipeline = Pipeline("Delete Customer Pipeline")

get_customer_pipeline.add_step(
    create_verify_token_step_executor(get_customer_pipeline)
).add_step(
    create_roles_check_step_executor(
        get_customer_pipeline, [ROLES["EMPLOYEE"]["NAME"], ROLES["ADMIN"]["NAME"]]
    )
).add_step(
    create_teams_check_step_executor(
        get_customer_pipeline, [TEAMS["MARKETING"]["NAME"], TEAMS["SALES"]["NAME"]]
    )
).add_step(
    get_pcustomer
).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)

get_customers_pipeline.add_step(
    create_verify_token_step_executor(get_customers_pipeline)
).add_step(
    create_roles_check_step_executor(
        get_customers_pipeline, [ROLES["EMPLOYEE"]["NAME"], ROLES["ADMIN"]["NAME"]]
    )
).add_step(
    create_teams_check_step_executor(
        get_customers_pipeline, [TEAMS["MARKETING"]["NAME"], TEAMS["SALES"]["NAME"]]
    )
).add_step(
    get_pcustomers
).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)

add_customer_pipeline.add_step(
    create_verify_token_step_executor(add_customer_pipeline)
).add_step(
    create_roles_check_step_executor(
        add_customer_pipeline, [ROLES["EMPLOYEE"]["NAME"], ROLES["ADMIN"]["NAME"]]
    )
).add_step(
    create_teams_check_step_executor(
        add_customer_pipeline, [TEAMS["MARKETING"]["NAME"], TEAMS["SALES"]["NAME"]]
    )
).add_step(
    add_customer
).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)

update_customer_pipeline.add_step(
    create_verify_token_step_executor(update_customer_pipeline)
).add_step(
    create_roles_check_step_executor(
        update_customer_pipeline, [ROLES["EMPLOYEE"]["NAME"], ROLES["ADMIN"]["NAME"]]
    )
).add_step(
    create_teams_check_step_executor(
        update_customer_pipeline, [TEAMS["MARKETING"]["NAME"], TEAMS["SALES"]["NAME"]]
    )
).add_step(
    update_customer
).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)

delete_customer_pipeline.add_step(
    create_verify_token_step_executor(delete_customer_pipeline)
).add_step(
    create_roles_check_step_executor(
        delete_customer_pipeline, [ROLES["EMPLOYEE"]["NAME"], ROLES["ADMIN"]["NAME"]]
    )
).add_step(
    create_teams_check_step_executor(
        delete_customer_pipeline, [TEAMS["MARKETING"]["NAME"], TEAMS["SALES"]["NAME"]]
    )
).add_step(
    delete_customer
).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)
