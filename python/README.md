# Example Application with Python

---

## About

Nếu như bạn đã code quen với Python thì bạn có thể dùng mã nguồn này để triển khai, trong này mình sẽ hướng dẫn các bạn triển khai ứng dụng fastapi theo từng bước.

> Note: chúng ta sẽ cài đặt và triển khai ở trong môi trường Linux (Ubuntu).

## Installation

Trước khi bắt đầu, nếu như bạn đang ở trong thư mục gốc, thì bạn vào trong thư mục `python` trước để tiến hành cài đặt.

```bash
cd python
```

Kể từ giờ thì thư mục gốc sẽ là `python`.

> Note: ở phần này thì mình sẽ hướng dẫn theo dạng command line, nên là các bạn có thể thực hiện theo hoặc là thao tác thủ công.

## Setup Virtual Environment

Trước khi chúng ta có thể tải bất kì package nào, thì chúng ta sẽ cần phải tạo ra môi trường ảo trước.

```bash
python3 -m venv venv
```

Khi đã tạo trong môi trường ảo, thì mính sẽ trỏ source về môi trường này.

```bash
source ./venv/bin/activate
```

Khi đã vào được biến môi trường, thì trước mỗi line trong CLI, bạn sẽ thấy có (venv) ở đằng trước. Khi đó chúng ta có thể dùng lệnh `python` như bình thường thay vì là `python3`.

```bash
(venv) tuna@DESKTOP-31ODEV4:~/fcj-dntu/cognito-example-projects/python$
```

### Setup Environment Variables

Trong thư mục gốc, bạn sẽ thấy file `.env.example`. Đầu tiên thì bạn sẽ cần phải tạo ra một file mới `.env`, sau đó là copy nội dung từ file `.env.example` sang file mới này.

```bash
touch .env && cat .env.example >> .env
```

Trong này, có một số biến môi trường mà bạn sẽ cần phải chú ý như là:

- AWS_PROFILE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY và AWS_REGION: bạn sẽ cần phải có tài khoản AWS, tạo một IAM User, tạo Access Key, cài đặt AWS CLI và cần phải setup một profile mẫu.
- DYNAMODB_TABLE_NAME_PCUSTOMERS: bạn sẽ cần phải tạo một table trong DynamoDB, lưu tên nó lại và bỏ vô biến này.
- COGNITO_USER_POOL_ID, COGNITO_APP_CLIENT_ID và COGNITO_APP_CLIENT_SECRET: bạn sẽ cần phải setup User Pool Cognito, tạo App Client và lưu các thông tin cần thiết vào các biến này (Với COGNITO_APP_CLIENT_SECRET thì bạn không cần phải thêm cũng được).

### Install Packages

Cài các packages cần thiết trong python theo câu lệnh sau:

```bash
pip install -r requirements.txt
```

Khi cài xong thì bạn sẽ thấy message từ pip

```
Installing collected packages: websockets, uvloop, urllib3, typing-extensions, sniffio, six, shellingham, rignore, pyyaml, python-multipart, python-dotenv, PyJWT, pygments, pycparser, mdurl, MarkupSafe, jmespath, idna, httptools, h11, dnspython, click, charset_normalizer, certifi, annotated-types, uvicorn, typing-inspection, sentry-sdk, requests, python-dateutil, pydantic-core, markdown-it-py, jinja2, httpcore, email-validator, cffi, anyio, watchfiles, starlette, rich, pydantic, httpx, cryptography, botocore, typer, s3transfer, rich-toolkit, jwcrypto, fastapi, fastapi-cloud-cli, fastapi-cli, boto3
Successfully installed MarkupSafe-3.0.2 PyJWT-2.10.1 annotated-types-0.7.0 anyio-4.10.0 boto3-1.39.3 botocore-1.39.17 certifi-2025.8.3 cffi-1.17.1 charset_normalizer-3.4.3 click-8.2.1 cryptography-45.0.6 dnspython-2.7.0 email-validator-2.2.0 fastapi-0.116.1 fastapi-cli-0.0.8 fastapi-cloud-cli-0.1.5 h11-0.16.0 httpcore-1.0.9 httptools-0.6.4 httpx-0.28.1 idna-3.10 jinja2-3.1.6 jmespath-1.0.1 jwcrypto-1.5.6 markdown-it-py-4.0.0 mdurl-0.1.2 pycparser-2.22 pydantic-2.11.7 pydantic-core-2.33.2 pygments-2.19.2 python-dateutil-2.9.0.post0 python-dotenv-1.1.1 python-multipart-0.0.20 pyyaml-6.0.2 requests-2.32.4 rich-14.1.0 rich-toolkit-0.15.0 rignore-0.6.4 s3transfer-0.13.1 sentry-sdk-2.35.0 shellingham-1.5.4 six-1.17.0 sniffio-1.3.1 starlette-0.47.2 typer-0.16.1 typing-extensions-4.14.1 typing-inspection-0.4.1 urllib3-2.5.0 uvicorn-0.35.0 uvloop-0.21.0 watchfiles-1.1.0 websockets-15.0.1
```

### Run Application

Để có thể chạy application, thì đầu tiên bạn sẽ cần phải cd vào trong thư mục `python/src/runtimes/fastapi` (nhớ là đã kích hoạt môi trường ảo và cài các thư viện cần thiết rồi nhé). Sau đó dùng lệnh để start server.

```bash
python app.py
```

Kết quả sẽ như thế này:

```
INFO:     Will watch for changes in these directories: ['/home/tuna/fcj-dntu/cognito-example-projects/python/src/runtimes/fastapi']
INFO:     Uvicorn running on http://localhost:7800 (Press CTRL+C to quit)
INFO:     Started reloader process [11984] using WatchFiles
INFO:     Started server process [11986]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Truy vập vào đường dẫn `http://localhost:7800/dócs` là bạn có thể thấy được giao diện swagger.

## Testing

Để thực hiện kiểm thử thì làm đơn giản thôi, đầu tiên là bạn phải cd vào trong thư mục `python/test`.

```bash
cd python/test
```

Sau đó là chạy thử một script test nào đó và xem kết quả ! Ví dụ như mình chạy thử script test encode / decode base64 để xem kết quả nó trông như thế nào nhé.

```bash
python base64_crypto.test.py
```

Kết quả:

```
.......
----------------------------------------------------------------------
Ran 7 tests in 0.001s

OK
```

> Note: còn một script nữa dùng để test function get_pcustomers, bạn có thể xem qua để hiểu và chạy thử để xem kết quả.

> Note: Để cho nhanh và hiệu quả, thì bạn nên dùng GenAI để tạo các file test và nhớ chỉnh lại cho hợp lý. Các file test mình cũng tạo bằng AI.
