import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "src"))

import unittest
import re
from utils.crypto.base64 import (
    encode,
    decode,
    url_safe_encode,
    url_safe_decode,
)


class TestCryptoBase64(unittest.TestCase):

    def test_encode_decode_string(self):
        input_data = "hello world"
        encoded = encode(input_data)
        decoded = decode(encoded)
        self.assertEqual(decoded, input_data)

    def test_encode_decode_number(self):
        input_data = 12345
        encoded = encode(input_data)
        decoded = decode(encoded)
        self.assertEqual(decoded, input_data)

    def test_encode_decode_object(self):
        input_data = {"foo": "bar", "count": 42}
        encoded = encode(input_data)
        decoded = decode(encoded)
        self.assertEqual(decoded, input_data)

    def test_encode_decode_array(self):
        input_data = ["a", "b", "c"]
        encoded = encode(input_data)
        decoded = decode(encoded)
        self.assertEqual(decoded, input_data)

    def test_decode_items_property_as_array(self):
        input_data = (1, 2, 3)
        encoded = encode(input_data)
        decoded = decode(encoded)
        self.assertEqual(decoded, (1, 2, 3))

    def test_url_safe_encode_decode(self):
        input_data = {"user": "alice", "id": 99}
        encoded = url_safe_encode(input_data)

        # base64url không có ký tự +, / hoặc =
        self.assertIsNone(re.search(r"[+/=]", encoded))

        decoded = url_safe_decode(encoded)
        self.assertEqual(decoded, input_data)

    def test_url_safe_decode_items_property_as_array(self):
        input_data = ("x", "y")
        encoded = url_safe_encode(input_data)
        decoded = url_safe_decode(encoded)
        self.assertEqual(decoded, ("x", "y"))


if __name__ == "__main__":
    unittest.main()
