from typing import Any, Dict, Optional

# Import external packages
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

# Import from core
from core.error import ClientError

# Import other helpers
from .number import is_number

serializer = TypeSerializer()
deserializer = TypeDeserializer()


def replace_decimals(obj: Any) -> Any:
    """
    Thay thế các giá trị kiểu Decimal-like bằng số nguyên hoặc số thực native của Python.

    Args:
        obj: Đối tượng cần xử lý (có thể là dict, list, hoặc giá trị đơn).

    Returns:
        Đối tượng đã được chuyển đổi, với các giá trị Decimal-like được thay bằng int hoặc float.
    """
    if isinstance(obj, list):
        return [replace_decimals(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: replace_decimals(value) for key, value in obj.items()}
    elif hasattr(obj, "to_integral_value"):  # Decimal-like
        num = float(obj)
        return int(num) if num.is_integer() else num
    return obj


def get_attr_value(
    item: Optional[Dict[str, Any]], attr_name: Optional[str], attr_type: Optional[str]
) -> Any:
    """
    Trích xuất giá trị từ một thuộc tính trong DynamoDB item.

    Args:
        item: Item DynamoDB dưới dạng dict.
        attr_name: Tên thuộc tính cần lấy.
        attr_type: Kiểu dữ liệu DynamoDB (ví dụ: 'S', 'N', 'BOOL').

    Returns:
        Giá trị của thuộc tính nếu tồn tại, ngược lại trả về None.
    """
    if not item or not attr_name or not attr_type:
        return None
    attr = item.get(attr_name)
    return attr.get(attr_type) if attr else None


def to_dynamodb_item(plain: Dict[str, Any]) -> Dict[str, Any]:
    """
    Chuyển đổi native Python dict sang DynamoDB item format.

    Args:
        plain: Đối tượng Python gốc.

    Returns:
        Đối tượng đã được serialize theo chuẩn DynamoDB.
    """
    return {k: serializer.serialize(v) for k, v in plain.items()}


def from_dynamodb_item(dynamo_item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Chuyển đổi DynamoDB item sang native Python dict.

    Args:
        dynamo_item: Item DynamoDB đã được serialize.

    Returns:
        Đối tượng Python gốc sau khi deserialize.
    """
    return {k: deserializer.deserialize(v) for k, v in dynamo_item.items()}


def _build_expression_attr_values(
    obj: Optional[Dict[str, Any]] = None,
    allowed_attrs: Optional[list[str]] = None,
    fn: Optional[callable] = None,
) -> Dict[str, Any]:
    """
    Xây dựng ExpressionAttributeValues từ dict đầu vào.

    Args:
        obj: Dữ liệu đầu vào dạng dict.
        allowed_attrs: Danh sách các thuộc tính được phép xử lý.
        fn: Hàm callback để xử lý từng key.

    Returns:
        Dict chứa các ExpressionAttributeValues theo chuẩn DynamoDB.
    """
    expression_attr_values: Dict[str, Any] = {}

    if not obj:
        return expression_attr_values

    for key, value in obj.items():
        if allowed_attrs and key not in allowed_attrs:
            continue

        placeholder = f":{key}"

        if is_number(value):
            expression_attr_values[placeholder] = {"N": str(value)}
        elif isinstance(value, str):
            expression_attr_values[placeholder] = {"S": value}
        elif isinstance(value, list):
            expression_attr_values[placeholder] = {
                "L": [serializer.serialize(v) for v in value]
            }
        elif isinstance(value, dict):
            expression_attr_values[placeholder] = {
                "M": serializer.serialize(value)["M"]
            }
        elif isinstance(value, bool):
            expression_attr_values[placeholder] = {"BOOL": value}
        elif isinstance(value, set):
            arr = list(value)
            type_set = type(arr[0])
            if not all(isinstance(v, type_set) for v in arr):
                raise ClientError(f"Inconsistent types in set for key {key}")
            if type_set is str:
                expression_attr_values[placeholder] = {"SS": arr}
            elif type_set in [int, float]:
                expression_attr_values[placeholder] = {"NS": [str(v) for v in arr]}

        if fn:
            fn(key, value)

    return expression_attr_values


def build_set_update_expression(
    obj: Optional[Dict[str, Any]] = None,
    allowed_attrs: Optional[list[str]] = None,
) -> Optional[Dict[str, Any]]:
    """
    Tạo biểu thức SET cho DynamoDB update.

    Args:
        obj: Dữ liệu đầu vào dạng dict.
        allowed_attrs: Danh sách các thuộc tính được phép cập nhật.

    Returns:
        Dict chứa setExpression và expressionAttrValues, hoặc None nếu không có dữ liệu.
    """
    if not obj:
        return None

    set_parts = []

    def collect_expression(key: str, _: Any):
        set_parts.append(f"{key} = :{key}")

    expression_attr_values = _build_expression_attr_values(
        obj, allowed_attrs, collect_expression
    )
    set_expression = "SET " + ", ".join(set_parts)

    return {
        "setExpression": set_expression,
        "expressionAttrValues": expression_attr_values,
    }
