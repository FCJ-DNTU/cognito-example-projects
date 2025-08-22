# Example Application with Typescript

---

## About

Nếu như bạn đã code quen với Typescript thì bạn có thể dùng mã nguồn này để triển khai, trong này mình sẽ hướng dẫn các bạn triển khai ứng dụng typescript theo từng bước.

> Note: chúng ta sẽ cài đặt và triển khai ở trong môi trường Linux (Ubuntu).

## Installation

Trước khi bắt đầu, nếu như bạn đang ở trong thư mục gốc, thì bạn vào trong thư mục `typescript` trước để tiến hành cài đặt.

```bash
cd typescript
```

Kể từ giờ thì thư mục gốc sẽ là `typescript`.

> Note: ở phần này thì mình sẽ hướng dẫn theo dạng command line, nên là các bạn có thể thực hiện theo hoặc là thao tác thủ công.

### Setup Environment Variables

Trong thư mục gốc, bạn sẽ thấy file `.env.example`. Đầu tiên thì bạn sẽ cần phải tạo ra một file mới `.env`, sau đó là copy nội dung từ file `.env.example` sang file mới này.

```bash
touch .env && cat .env.example >> .env
```

Trong này, có một số biến môi trường mà bạn sẽ cần phải chú ý như là:

- AWS_PROFILE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY và AWS_REGION: bạn sẽ cần phải có tài khoản AWS, tạo một IAM User, tạo Access Key, cài đặt AWS CLI và cần phải setup một profile mẫu.
- DYNAMODB_TABLE_NAME_PCUSTOMERS: bạn sẽ cần phải tạo một table trong DynamoDB, lưu tên nó lại và bỏ vô biến này.
- COGNITO_USER_POOL_ID, COGNITO_APP_CLIENT_ID và COGNITO_APP_CLIENT_SECRET: bạn sẽ cần phải setup User Pool Cognito, tạo App Client và lưu các thông tin cần thiết vào các biến này (Với COGNITO_APP_CLIENT_SECRET thì bạn không cần phải thêm cũng được).

### Build Application

Trước khi bắt đầu build app, thì mình sẽ cần phải thực hiện cài đặt các package trước.

```bash
npm install

# Hoặc
pnpm install
```

Khi đã cài đặt xong thì bạn sẽ cần chạy tiếp câu lệnh bên dưới để tiến hành build app. Mã nguồn được viết với typescript, nhưng NodeJS không hiểu Typescript, nên chúng ta sẽ buộc dịch nó về mã Javascript thì mới chạy với NodeJS được.

```bash
npm run build:dev-express

# Hoặc
pnpm run build:dev-express
```

Mã nguồn có thể được chạy trên nhiều runtime khác nhau, bạn có thể setup các runtime khác nhau dựa trên cái mà mình đã setup với ExpressJS.

### Run Application

Sau khi build xong rồi thì chúng ta sẽ chạy thử app thôi !!

```bash
npm run start:dev-express

# Hoặc
pnpm run start:dev-express
```

Trong command line sẽ hiện kết quả giống như như này:

```bash
> example-application-typescript@1.0.0 start:dev-express /home/tuna/fcj-dntu/cognito-example-projects/typescript
> node build/runtimes/express/app.js

[dotenv@17.2.1] injecting env (10) from .env -- tip: 📡 observe env with Radar: https://dotenvx.com/radar
[dotenv@17.2.1] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
✅ Server chạy tại http://localhost:7800
📖 Swagger UI tại http://localhost:7800/api-docs
```

Như vậy là chúng ta đã hoàn thành việc triển khai ứng dụng, bạn có thể truy vập đường dẫn trong browser để hiện giao diện Swagger.

## Testing

Để có thể thực hiện kiểm thử, thì chúng ta tạo các file test trong `test/`. Trong folder này thì mình có một số các file mẫu. Để chạy được test, thì cần phải dùng thêm option `-r ts-node/register`, khi đó mình có lệnh.

```bash
npx mocha -r ts-node/register test/file.test.ts
```

Ví dụ:

```bash
npx mocha -r ts-node/register test/base64-crypto.test.ts


  Crypto Base64 - Unit Test
    ✔ should encode and decode a string
    ✔ should encode and decode a number
    ✔ should encode and decode an object
    ✔ should encode and decode an array
    ✔ should decode object with items[] property as array
    ✔ should urlSafeEncode and urlSafeDecode properly
    ✔ should urlSafeDecode object with items[] property as array


  7 passing (10ms)
```

> Note: Để cho nhanh và hiệu quả, thì bạn nên dùng GenAI để tạo các file test và nhớ chỉnh lại cho hợp lý. Các file test mình cũng tạo bằng AI.
