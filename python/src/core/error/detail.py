from typing import List, Optional, TypedDict


class BaseErrorDetail(TypedDict, total=False):
    source: str
    desc: str


class ErrorDetails(TypedDict, total=False):
    reasons: Optional[List[BaseErrorDetail]]
