# CHANGELOG - Cập nhật VIETBLUETOUR

## Cập nhật lần 2 (sửa lỗi đặt tour/chi tiết tour, admin, thêm tour, hiệu ứng)

### 🐛 Sửa lỗi nghiêm trọng: Không xem được chi tiết tour / không đặt được tour
- **Nguyên nhân**: Khi MongoDB chưa kết nối (hoặc chưa seed dữ liệu), trang chủ hiển thị tour từ dữ liệu mẫu dự phòng (fallback) với ID dạng `fallback-0`, `fallback-1`... Nhưng route `/tour-detail/:id` và `/dat-tour/:id` chỉ tra cứu bằng `Tour.findById()` của MongoDB — ID dạng `fallback-0` không phải ObjectId hợp lệ nên bị lỗi, dẫn đến trang chi tiết/đặt tour bị lỗi 500.
- **Đã sửa**: Thêm hàm `getTourById()` tra cứu thông minh — thử tìm trong MongoDB trước (nếu ID hợp lệ), nếu không có/lỗi thì tự động tìm trong dữ liệu mẫu dự phòng. Nhờ vậy **xem chi tiết tour và mở form đặt tour hoạt động được ngay cả khi chưa kết nối MongoDB**.
- Khi bấm "Xác Nhận Đặt Tour" mà MongoDB chưa kết nối (bắt buộc phải có DB thật để lưu đơn), hệ thống phản hồi ngay lập tức (0.03s) với thông báo rõ ràng bằng tiếng Việt kèm số hotline, thay vì treo ~10 giây rồi báo lỗi khó hiểu.

### 🐛 Sửa lỗi: Trang Admin Visa Services & Combo/Voucher chỉ có navbar, không có nội dung
- Trước đây 2 trang này là giao diện tĩnh (hardcode), không đọc/ghi gì vào MongoDB dù đã có sẵn model `Visa` và `ComboVoucher`.
- Đã nối cả 2 trang với dữ liệu thật: hiển thị danh sách từ DB, có form "+ Add" để tạo mới, nút Delete để xoá.
- Đã seed sẵn 5 dịch vụ visa mẫu (Hàn Quốc, Nhật Bản, Schengen, Mỹ, Úc) và 3 combo/voucher mẫu.

### 🐛 Sửa: Trang admin "trống" khi chưa có dữ liệu
- Thêm banner cảnh báo màu vàng ở đầu mọi trang admin (Dashboard, Tours, Bookings, Contacts, Reports, Visas, Combos) khi MongoDB chưa kết nối được — giải thích rõ nguyên nhân và cách khắc phục (kiểm tra `MONGODB_URI` trong `.env`), thay vì im lặng hiển thị "0" / bảng trống khiến admin tưởng là bị lỗi.

### ✅ Wiring thêm cho Admin
- Nút "Delete" ở trang Tours giờ xoá tour thật khỏi MongoDB (trước đây chỉ là `alert()`).
- Trang Bookings: đổi trạng thái đơn (Chờ xác nhận / Đã xác nhận / Đã huỷ) lưu thật vào DB qua dropdown chọn là cập nhật ngay.
- Mọi thao tác ghi dữ liệu (tạo/xoá/cập nhật) trong admin đều phản hồi tức thì nếu MongoDB chưa kết nối, tránh treo trang.

### 🎨 Thêm hiệu ứng chuyển động khi di chuột (hover)
- Badge tour ("HOT", "Bán chạy"...) có hiệu ứng nhấp nháy nhẹ (pulse) thu hút sự chú ý.
- Nút "Đặt Tour Ngay" / nút vàng gradient có hiệu ứng ánh sáng lướt qua khi di chuột.
- Card thống kê ở admin (stat-card, report-card) nhấc lên nhẹ + đổ bóng khi hover.
- Icon mạng xã hội ở footer xoay nhẹ khi hover; logo có hiệu ứng nghiêng nhẹ khi hover.
- Icon trong mục liên hệ phóng to + xoay nhẹ khi hover vào cả khối.

### ➕ Thêm tour mới (tổng cộng 24 tour, từ 18 tour)
Bổ sung: Vũng Tàu, Hà Giang, Cát Bà, Kuala Lumpur (Malaysia), Ấn Độ (Taj Mahal), Úc (Sydney - Melbourne) — cả trong dữ liệu mẫu dự phòng (`data/sampleData.js`) và dữ liệu seed MongoDB (`seed.js`) để đồng bộ.

---

## Cập nhật lần 1 (ban đầu)

## 1. Trang Đặt Tour (mới)
- `GET /dat-tour/:id` — form đặt tour thật (họ tên, SĐT, email, số khách, ngày khởi hành, ghi chú), có tóm tắt đơn hàng tự cập nhật tổng tiền theo số khách.
- `POST /dat-tour/:id` — validate dữ liệu, tính tổng tiền tự động từ giá tour, sinh mã đặt tour (VD: `VBT-260704-A1B2`), lưu vào MongoDB.
- `GET /dat-tour-thanh-cong/:code` — trang xác nhận đặt tour thành công, hiển thị đầy đủ thông tin đơn.
- Nút "Đặt Tour Ngay" ở trang chi tiết tour nay dẫn thẳng tới form thật (trước đây chỉ hiện `alert()`).

## 2. Trang Chi Tiết Tour
- Đã có sẵn (`/tour-detail/:id`), bổ sung: ghi nhận lượt truy cập (phục vụ báo cáo), thêm `loading="lazy"` cho ảnh phụ.

## 3. Theo Dõi Lượt Truy Cập & Tỉ Lệ Đặt Tour
- Model mới `models/Visit.js`: ghi lại mỗi lượt xem trang chi tiết tour (gắn với `visitorId` ẩn danh qua cookie 1 năm, không cần đăng nhập).
- Khi khách đặt tour thành công, lượt truy cập tương ứng được đánh dấu `converted: true`.
- Nhờ vậy admin biết được: bao nhiêu lượt xem tour dẫn tới đặt tour, bao nhiêu lượt xem nhưng không đặt.

## 4. Trang Admin - Báo Cáo (mới): `/admin/reports`
- Thẻ tổng quan: Tổng doanh thu, Tổng lượt truy cập, Lượt đã đặt, Lượt chưa đặt (kèm tỉ lệ chuyển đổi %).
- Biểu đồ cột doanh thu theo tháng (dựng bằng CSS, không phụ thuộc thư viện ngoài).
- Bảng chi tiết theo từng tour: lượt truy cập / đã đặt / chưa đặt / tỉ lệ chuyển đổi / doanh thu.
- Thêm mục "📈 Báo Cáo" vào sidebar admin.

## 5. Sửa Lỗi Trong Dữ Liệu / Model
- `models/Tour.js`: thêm field `type` (domestic/international) và `description` — trước đây bị thiếu nên lọc "Tour trong nước / Tour nước ngoài" hoạt động sai, và admin tạo tour mới sẽ mất field `type` khi lưu.
- `models/Booking.js`: đổi `totalPrice` từ String sang Number (để tính tổng doanh thu chính xác), `departureDate` sang kiểu Date thật, thêm `unitPrice` và `visitorId`, tự sinh `bookingCode`.
- `seed.js`: thêm field `type` cho các tour mẫu + bổ sung 3 tour quốc tế (trước đây seed thiếu hoàn toàn tour quốc tế nên trang "Tour Nước Ngoài" luôn trống khi dùng dữ liệu thật từ MongoDB).
- `routes/api.js`: sửa logic lọc tour trong nước/nước ngoài cho tương thích tour cũ chưa có field `type`.
- Trang Admin Dashboard & Contacts: sửa hiển thị đúng theo model `Lead` thực tế (trước đây hiển thị field `email`/`subject` không tồn tại trong model).
- Admin Dashboard: "Total Revenue" giờ tính tổng thật từ các booking (trước đây hiển thị cố định `∞`).

## 6. Tối Ưu Hóa Website
- Thêm `compression` middleware — nén gzip toàn bộ response (HTML/CSS/JS/JSON), giảm dung lượng tải xuống.
- Cache-Control cho file tĩnh: CSS/JS cache 7 ngày, ảnh trong `/media` cache 30 ngày → giảm tải server, tăng tốc độ load lại trang.
- Thêm `loading="lazy"` cho ảnh danh sách tour và ảnh phụ trong trang chi tiết → giảm thời gian tải trang ban đầu.
- Refactor sidebar admin thành 1 file dùng chung (`views/admin/partials/sidebar.ejs`) thay vì lặp lại HTML ở 6 trang — dễ bảo trì hơn.
- Thêm `.gitignore` (loại `node_modules`, `.env` khỏi git — trước đây `node_modules` bị commit thẳng vào repo, làm repo nặng không cần thiết).
- Tạo `utils/price.js` dùng chung để xử lý định dạng tiền tệ nhất quán giữa các nơi.

## Cần Làm Sau Khi Nhận Code
1. `npm install` để cài `compression` và `cookie-parser` (đã thêm vào `package.json`).
2. `npm run seed` để nạp lại dữ liệu mẫu (đã có tour quốc tế + field `type`).
3. Kiểm tra `.env` có `MONGODB_URI` trỏ đúng tới MongoDB (xem `.env.example`).
4. `npm run dev` để chạy thử.

## Lưu Ý
- Đăng nhập admin demo: `admin` / `123456` (nên đổi khi triển khai thật, xem `routes/admin.js`).
- Trang lọc theo khoảng giá ở `/tour-trong-nuoc` hiện chưa lọc thật (chỉ lọc theo miền) — có thể nâng cấp thêm nếu cần.
