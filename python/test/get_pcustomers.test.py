import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "src"))

import unittest

import dotenv

dotenv.load_dotenv(dotenv_path="../.env")

from core.error import AppError
from core.modules.pcustomer_management.functions import get_pcustomers


class TestGetPCustomers(unittest.IsolatedAsyncioTestCase):
    async def test_should_return_list_of_potential_customers(self):
        class MockContext:
            runtime = "test"

            def get_query(self):
                return {"limit": "10"}

            async def get_body(self):
                return {}

            def get_temp_data(self):
                return {}

            def get_params(self):
                return {}

            def get_headers(self):
                return {}

            def set_http_status(self, code):
                pass

            def set_body(self, body):
                pass

            def add_temp_data(self, key, value):
                pass

            def send_streaming(self, data):
                pass

            def send_json(self, data):
                pass

            def send_html(self, html):
                pass

            def send_error(self, error):
                pass

        ctx = MockContext()
        customers = await get_pcustomers(ctx)
        self.assertFalse(isinstance(customers, AppError))


if __name__ == "__main__":
    unittest.main()
