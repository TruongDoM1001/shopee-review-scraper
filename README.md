# 🛒 Shopee Review Scraper - Chrome Extension

Chrome Extension để lấy dữ liệu comment/feedback khách hàng từ sản phẩm trên Shopee.

## ✨ Tính Năng

- 📊 Lấy tất cả comment của sản phẩm (username, rating, comment, likes, date)
- ⬇️ Scroll tự động tải thêm review
- 📈 Hiển thị thống kê (tổng comment, đánh giá trung bình, like trung bình)
- 📥 Export dữ liệu ra file CSV
- 💾 Lưu dữ liệu vào Chrome Storage
- 🗑️ Xóa dữ liệu cũ

## 🚀 Cài Đặt

1. Clone hoặc download project này
   ```bash
   git clone https://github.com/TruongDoM1001/shopee-review-scraper.git
   ```

2. Mở Chrome, vào `chrome://extensions/`

3. Bật **Developer mode** (góc trên bên phải)

4. Click **Load unpacked**

5. Chọn thư mục project

## 📖 Hướng Dùng

1. Vào trang sản phẩm trên Shopee
   ```
   https://shopee.vn/product/[product_id]
   ```

2. Click icon extension ở thanh công cụ Chrome

3. Click **"Bắt Đầu Lấy Dữ Liệu"** để scrape comment

4. Click **"Scroll Tải Thêm"** để tải thêm review (tối đa 10 lần)

5. Click **"Export CSV"** để tải file

## 📋 Dữ Liệu Lấy Được

```
- Tên người dùng
- Số sao đánh giá (1-5)
- Nội dung comment
- Số lượt like
- Ngày đăng
```

## 📁 Cấu Trúc Thư Mục

```
shopee-review-scraper/
├── manifest.json         # Cấu hình extension
├── popup.html           # Giao diện popup
├── popup.css            # Styling popup
├── popup.js             # Logic popup
├── content.js           # Scrape dữ liệu từ trang
├── background.js        # Background script
├── icons/               # Icon extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## ⚙️ Lưu Ý

- Extension chỉ hoạt động trên `shopee.vn` và `www.shopee.vn`
- Dữ liệu được lưu trong Chrome Storage (mỗi profile riêng)
- Có thể tải từng sản phẩm khác nhau, dữ liệu cũ sẽ bị thay thế
- Tốc độ scrape phụ thuộc vào tốc độ mạng và số lượng comment

## 🔧 Troubleshooting

### Nếu extension không hoạt động:

1. Kiểm tra URL có phải Shopee không
2. Mở DevTools (F12) và xem console có lỗi gì
3. Thử reload extension từ `chrome://extensions/`

### Nếu selector không hoạt động:

1. Mở DevTools (F12)
2. Inspect một comment element
3. Tìm class/id chứa dữ liệu
4. Cập nhật selector trong `content.js`

Ví dụ:
```javascript
// Thay đổi selector nếu cần
const reviewElements = document.querySelectorAll('[class*="your-class-name"]');
```

## 🎯 Tính Năng Nâng Cao (Tuỳ Chọn)

Bạn có thể tự thêm các tính năng sau:

### 1. Filter by Rating
```javascript
filterByRating(minRating) {
    return this.reviews.filter(r => r.rating >= minRating);
}
```

### 2. Search by Keyword
```javascript
searchByKeyword(keyword) {
    return this.reviews.filter(r => 
        r.comment.toLowerCase().includes(keyword.toLowerCase())
    );
}
```

### 3. Export JSON
```javascript
exportJSON() {
    const json = JSON.stringify(this.reviews, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shopee-reviews-${Date.now()}.json`;
    link.click();
}
```

### 4. Detailed Statistics
```javascript
getDetailedStats() {
    return {
        total: this.reviews.length,
        avgRating: (this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length).toFixed(2),
        distribution: {
            5: this.reviews.filter(r => r.rating === 5).length,
            4: this.reviews.filter(r => r.rating === 4).length,
            3: this.reviews.filter(r => r.rating === 3).length,
            2: this.reviews.filter(r => r.rating === 2).length,
            1: this.reviews.filter(r => r.rating === 1).length
        },
        totalLikes: this.reviews.reduce((sum, r) => sum + (r.likes || 0), 0)
    };
}
```

## 📊 Ví Dụ Export CSV

File CSV sẽ có định dạng như sau:

```
Người Dùng,Đánh Giá,Comment,Like,Ngày
Nguyễn Văn A,5,"Sản phẩm rất tốt, giao hàng nhanh",10,2 ngày trước
Trần Thị B,4,"Hài lòng với chất lượng",5,5 ngày trước
```

## 🤝 Contribute

Nếu bạn có ý tưởng cải tiến, vui lòng fork repo này và submit pull request.

## 📄 License

MIT License - xem file LICENSE để chi tiết

## ⚠️ Disclaimer

Extension này được tạo cho mục đích học tập và phân tích dữ liệu. Vui lòng sử dụng trách nhiệm và tuân theo điều khoản dịch vụ của Shopee.

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ trực tiếp.

---

**Made with ❤️ by TruongDoM1001**
