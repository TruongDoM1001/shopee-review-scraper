class ShopeeReviewScraper {
    constructor() {
        this.reviews = [];
        this.isScraped = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
    }

    setupEventListeners() {
        document.getElementById('scrapeBtn').addEventListener('click', () => this.startScraping());
        document.getElementById('scrollBtn').addEventListener('click', () => this.scrollAndLoadMore());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportCSV());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearData());
    }

    async startScraping() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('shopee.vn')) {
            this.showStatus('❌ Vui lòng mở trang sản phẩm Shopee trước!', 'error');
            return;
        }

        this.showStatus('⏳ Đang lấy dữ liệu...', 'info');
        document.getElementById('scrapeBtn').disabled = true;
        document.getElementById('scrollBtn').disabled = false;
        document.getElementById('progress').style.display = 'block';

        // Gửi message đến content.js
        chrome.tabs.sendMessage(tab.id, { action: 'scrapeReviews' }, (response) => {
            if (response) {
                this.reviews = response.reviews;
                this.isScraped = true;
                this.saveToStorage();
                this.updateUI();
                this.showStatus(`✅ Đã lấy ${this.reviews.length} bình luận!`, 'success');
                document.getElementById('exportBtn').disabled = false;
            }
        });
    }

    async scrollAndLoadMore() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        this.showStatus('⏳ Đang scroll tải thêm...', 'info');
        document.getElementById('scrollBtn').disabled = true;

        chrome.tabs.sendMessage(tab.id, { action: 'scrollLoadMore', count: 10 }, (response) => {
            if (response) {
                // Merge dữ liệu mới
                const newReviews = response.reviews.filter(
                    r => !this.reviews.some(existing => existing.username === r.username && existing.date === r.date)
                );
                this.reviews.push(...newReviews);
                this.saveToStorage();
                this.updateUI();
                this.showStatus(`✅ Đã thêm ${newReviews.length} bình luận! Tổng: ${this.reviews.length}`, 'success');
                document.getElementById('scrollBtn').disabled = false;
            }
        });
    }

    updateUI() {
        // Update bảng dữ liệu
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        this.reviews.forEach(review => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${this.escapeHtml(review.username)}</strong></td>
                <td>${this.renderStars(review.rating)}</td>
                <td>${this.escapeHtml(review.comment.substring(0, 100))}...</td>
                <td>${review.likes || 0}</td>
                <td>${review.date || 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });

        // Update stats
        const stats = document.getElementById('stats');
        if (this.reviews.length > 0) {
            stats.style.display = 'grid';
            document.getElementById('totalComments').textContent = this.reviews.length;
            document.getElementById('avgRating').textContent = 
                (this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length).toFixed(2);
            document.getElementById('avgLikes').textContent = 
                (this.reviews.reduce((sum, r) => sum + (r.likes || 0), 0) / this.reviews.length).toFixed(1);
        }

        document.getElementById('progress').style.display = 'none';
    }

    renderStars(rating) {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportCSV() {
        if (this.reviews.length === 0) {
            alert('Không có dữ liệu để export!');
            return;
        }

        const headers = ['Người Dùng', 'Đánh Giá', 'Comment', 'Like', 'Ngày'];
        const rows = this.reviews.map(r => [
            r.username,
            r.rating,
            `"${r.comment.replace(/"/g, '\"\"')}"`,
            r.likes || 0,
            r.date || 'N/A'
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', `shopee-reviews-${Date.now()}.csv`);
        link.click();

        this.showStatus('✅ Export CSV thành công!', 'success');
    }

    clearData() {
        if (confirm('Bạn chắc chắn muốn xóa tất cả dữ liệu?')) {
            this.reviews = [];
            this.isScraped = false;
            this.saveToStorage();
            this.updateUI();
            document.getElementById('tableBody').innerHTML = '';
            document.getElementById('stats').style.display = 'none';
            document.getElementById('exportBtn').disabled = true;
            document.getElementById('scrollBtn').disabled = true;
            document.getElementById('scrapeBtn').disabled = false;
            this.showStatus('🗑️ Đã xóa tất cả dữ liệu!', 'success');
        }
    }

    showStatus(message, type) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        setTimeout(() => {
            if (type !== 'error') status.classList.remove(type);
        }, 3000);
    }

    saveToStorage() {
        chrome.storage.local.set({ reviews: this.reviews });
    }

    loadFromStorage() {
        chrome.storage.local.get(['reviews'], (result) => {
            if (result.reviews && result.reviews.length > 0) {
                this.reviews = result.reviews;
                this.updateUI();
                document.getElementById('exportBtn').disabled = false;
                document.getElementById('scrollBtn').disabled = false;
            }
        });
    }
}

new ShopeeReviewScraper();
