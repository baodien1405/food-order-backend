# Thông tin API

URL: `http://localhost:8080/`
Đối với các route cần xác thực => Gửi token lên bằng headers với key là `Authorization`. Token phải bắt đầu bằng 'Bearer '

## Format trả về

Là một object

```ts
interface Response {
  status: string
  message: string
  data?: any
}
```

Ví dụ

```json
{
  "status": "OK",
  "message": "Success",
  "data": {
    "_id": "64180824c057cc62c5f8decf",
    "name": "Iphone 13",
    "image": "http://res.cloudinary.com/dktajq8sb/image/upload/v1679297374/products/um6rssm7gkrum0by64jl.png",
    "type": "phone",
    "price": 1500444,
    "countInStock": 123,
    "rating": 4.4,
    "description": "Điện thoại nè"
  }
}
```

## Format lỗi

### Trong trường hợp lỗi 422 (thường do form) hoặc lỗi do truyền query / param bị sai

Ví dụ đăng ký email đã tồn tại

```json
{
  "status": "ERROR",
  "message": "Email đã tồn tại"
}
```

### Trong trường hợp lỗi còn lại

```json
{
  "message": "Lỗi do abcxyz"
}
```

## Refresh Token: `/refresh-token`

Method: POST

Body:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxNUBnbWFpbC5jb20iLCJpZCI6IjYwYzZmNGViNGVhMWRlMzg5ZjM1NjA1YiIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjEtMDYtMTRUMDY6MTk6MjMuNzQ5WiIsImlhdCI6MTYyMzY1MTU2MywiZXhwIjoxNjI0MjU2MzYzfQ.WbNgnd4cewdDNpx-ZLebk1kLgogLctBqgh9fc9Mb3yg"
}
```
