import re

# Common Regexes
CUSTOMER_ID_PREFIX_PATTERN = r"^CUSTOMER#"
CUSTOMER_ID_PREFIX_REGEX = re.compile(CUSTOMER_ID_PREFIX_PATTERN)

VIETNAMESE_NAME_PATTERN = (
    r"^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]"
    r"[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ "
    r"[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]"
    r"[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+"
    r"(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ]"
    r"[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*"
)
VIETNAMESE_NAME_REGEX = re.compile(VIETNAMESE_NAME_PATTERN)

VIETNAMESE_PHONENUMBER_PATTERN = r"(84|0[3|5|7|8|9])+([0-9]{8})\b"
VIETNAMESE_PHONENUMBER_REGEX = re.compile(VIETNAMESE_PHONENUMBER_PATTERN)

USERNAME_PATTERN = r"^[a-zA-Z0-9._-]{3,30}$"
USERNAME_REGEX = re.compile(USERNAME_PATTERN)

PASSWORD_PATTERN = r"^[A-Za-z0-9!@#$%^&*()\[\]{}:;.,<>?/\\|_~`+=\-]{8,128}$"
PASSWORD_REGEX = re.compile(PASSWORD_PATTERN)

# Date Regex
ISO8601_DATETIME_PATTERN = r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$"
ISO8601_DATETIME_REGEX = re.compile(ISO8601_DATETIME_PATTERN)

# Other Regex
SNAKECASE_PATTERN = r"^[a-z]+(_[a-z]+)*$"
SNAKECASE_REGEX = re.compile(SNAKECASE_PATTERN)
