# 📦 Hướng Dẫn Cài Đặt Chi Tiết

## Bước 1: Chuẩn Bị

- Cài đặt Chrome (phiên bản mới nhất)
- Tải project từ GitHub hoặc download ZIP

## Bước 2: Lấy Code

### Option A: Sử dụng Git
```bash
git clone https://github.com/TruongDoM1001/shopee-review-scraper.git
cd shopee-review-scraper
```

### Option B: Download ZIP
1. Vào https://github.com/TruongDoM1001/shopee-review-scraper
2. Click **Code** → **Download ZIP**
3. Giải nén file ZIP

## Bước 3: Mở Extension Management

1. Mở Chrome
2. Nhập vào thanh địa chỉ: `chrome://extensions/`
3. Hoặc: Menu → More tools → Extensions

## Bước 4: Kích Hoạt Developer Mode

1. Tìm **Developer mode** ở góc trên bên phải
2. Bật công tắc (sẽ chuyển sang màu xanh)

## Bước 5: Load Extension

1. Click nút **Load unpacked**
2. Chọn thư mục chứa extension
3. Chọn file `manifest.json` hoặc thư mục gốc

## Bước 6: Xác Nhận

- Bạn sẽ thấy extension hiển thị trong danh sách
- Icon sẽ xuất hiện ở thanh công cụ Chrome
- Nếu không thấy icon, click vào biểu tượng puzzle (⚙️) → Pin extension

## Bước 7: Sử Dụng

1. Vào một trang sản phẩm Shopee
   ```
   https://shopee.vn/product/[product_id]
   ```

2. Click icon extension

3. Click **"Bắt Đầu Lấy Dữ Liệu"**

4. Chờ dữ liệu tải xong

5. Click **"Export CSV"** để tải file

## 🐛 Xử Lý Sự Cố

### Extension không xuất hiện
- Tải lại trang (Ctrl+R hoặc Cmd+R)
- Kiểm tra Developer mode có bật không
- Xóa extension, load lại

### Khi scrape bị lỗi
- Mở DevTools (F12)
- Xem tab Console có thông báo lỗi gì
- Có thể Shopee đã thay đổi cấu trúc HTML
- Cập nhật selector trong `content.js`

### CSV export trống
- Đảm bảo đã click "Bắt Đầu Lấy Dữ Liệu" thành công
- Chờ cho đến khi status hiển thị "✅ Đã lấy X bình luận"
- Sau đó mới click Export

### Scrape từ từ
- Điều chỉnh delay trong `content.js`
- Tăng giá trị delay để ổn định hơn:
  ```javascript
  await this.delay(500); // Tăng từ 300 lên 500ms
  ```

## ✅ Kiểm Tra Cài Đặt Thành Công

- ✔️ Icon extension hiển thị ở thanh công cụ
- ✔️ Popup mở được khi click icon
- ✔️ Có thể nhập URL Shopee
- ✔️ Button "Bắt Đầu Lấy Dữ Liệu" hoạt động

## 📝 Ghi Chú

- Extension chỉ hoạt động khi bạn đang xem trang Shopee
- Dữ liệu được lưu cục bộ trên máy bạn (Chrome Storage)
- Mỗi profile Chrome khác nhau sẽ có dữ liệu riêng
- Dữ liệu sẽ bị xóa nếu bạn xóa dữ liệu duyệt web

## 🚀 Bước Tiếp Theo

Sau khi cài đặt thành công:
1. Vào một trang sản phẩm Shopee
2. Thử tính năng scrape
3. Export dữ liệu để kiểm tra
4. Nếu gặp vấn đề, xem phần Troubleshooting

---

**Chúc bạn cài đặt thành công! 🎉**
