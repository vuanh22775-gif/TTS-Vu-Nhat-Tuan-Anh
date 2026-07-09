# VIETBLUETOUR — Website Du Lịch (Express + EJS + MongoDB)

## Cài đặt & chạy

```bash
npm install
cp .env.example .env   # rồi sửa MONGODB_URI nếu cần
npm run seed            # tạo dữ liệu mẫu (tours, destinations, reviews, services)
npm run dev              # chạy ở chế độ dev (nodemon)
# hoặc
npm start
```

Truy cập:
- Trang chủ: http://localhost:3000
- Trang quản trị: http://localhost:3000/admin/login (tài khoản demo: `admin` / `123456`)

## Những gì mới trong bản cập nhật này

### 1. Luồng đặt tour hoàn chỉnh
- `GET /dat-tour/:id` — form đặt tour (họ tên, SĐT, email, số khách, ngày khởi hành, ghi chú), có tóm tắt đơn hàng tự cập nhật tổng tiền theo số khách.
- `POST /dat-tour/:id` — xử lý, validate, lưu `Booking` vào MongoDB, tự sinh mã đặt tour (`VBT-YYMMDD-XXXX`).
- `GET /dat-tour-thanh-cong/:code` — trang xác nhận đặt tour thành công.
- Nút "Đặt Tour Ngay" ở trang chi tiết tour giờ trỏ thẳng đến form thật (trước đây chỉ hiện `alert()`).

### 2. Theo dõi lượt truy cập & tỉ lệ chuyển đổi
- Model `Visit` mới: mỗi lượt xem trang chi tiết tour được ghi lại kèm `visitorId` (cookie ẩn danh, tồn tại 1 năm).
- Khi khách đặt tour thành công, lượt truy cập tương ứng được đánh dấu `converted = true`.
- Nhờ đó admin biết được: tour nào có nhiều người xem nhưng ít người đặt, tỉ lệ chuyển đổi từng tour.

### 3. Trang Admin — Báo Cáo (`/admin/reports`)
- Tổng doanh thu, tổng lượt truy cập, số lượt đã đặt / chưa đặt, tỉ lệ chuyển đổi tổng thể.
- Biểu đồ cột doanh thu theo tháng (thuần CSS/SVG, không phụ thuộc thư viện ngoài).
- Bảng chi tiết theo từng tour: lượt xem, đã đặt, chưa đặt, % chuyển đổi, doanh thu.
- Sidebar admin được tách thành partial dùng chung (`views/admin/partials/sidebar.ejs`), thêm mục "📈 Báo Cáo" cho toàn bộ trang quản trị.

### 4. Sửa lỗi & dọn dẹp dữ liệu
- `Tour` model thiếu field `type` (trong/ngoài nước) khiến việc lọc tour và tạo tour mới từ admin bị sai — đã bổ sung.
- `Booking.totalPrice` chuyển từ `String` sang `Number` để tính doanh thu chính xác; `departureDate` chuyển sang kiểu `Date`.
- `seed.js` thiếu tour quốc tế và field `type` — đã bổ sung để trang "Tour nước ngoài" có dữ liệu thật.
- Bảng "Recent Contacts" (dashboard & trang Contacts) hiển thị sai field (email/subject không tồn tại trong model `Lead`) — đã sửa lại đúng field thật (tên, SĐT, trạng thái).
- Thêm `utils/price.js` dùng chung để chuyển đổi giữa chuỗi giá hiển thị ("3.990.000₫") và số nguyên VNĐ.

### 5. Tối ưu hiệu năng
- Bật nén gzip (middleware `compression`) cho toàn bộ response.
- Cache trình duyệt cho static assets (`/css`, `/js`: 7 ngày; `/media`: 30 ngày).
- Thêm `loading="lazy"` cho ảnh phụ (thumbnail, ảnh danh sách tour) để giảm tải trang ban đầu.
- Thêm `.gitignore` (loại `node_modules`, `.env` khỏi repo).

## Cấu trúc thư mục chính

```
routes/index.js     -> trang public + luồng đặt tour
routes/admin.js      -> toàn bộ trang quản trị, bao gồm /admin/reports
models/Visit.js       -> theo dõi lượt truy cập tour
models/Booking.js     -> đơn đặt tour
utils/price.js         -> tiện ích xử lý giá tiền
views/booking.ejs             -> form đặt tour
views/booking-success.ejs     -> trang xác nhận đặt tour
views/admin/reports.ejs       -> trang báo cáo
views/admin/partials/sidebar.ejs -> sidebar dùng chung cho admin
```
