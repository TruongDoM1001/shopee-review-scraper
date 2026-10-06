class ShopeeContentScraper {
    constructor() {
        this.reviews = [];
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'scrapeReviews') {
                this.scrapeCurrentReviews();
                sendResponse({ reviews: this.reviews });
            } else if (request.action === 'scrollLoadMore') {
                this.scrollAndLoadMore(request.count).then(() => {
                    sendResponse({ reviews: this.reviews });
                });
                return true; // giữ kênh message mở cho phản hồi bất đồng bộ
            }
        });
    }

    // querySelectorAll luôn trả về NodeList (truthy) nên không dùng || được
    queryFirstNonEmpty(root, selectors) {
        for (const sel of selectors) {
            const found = root.querySelectorAll(sel);
            if (found.length > 0) return found;
        }
        return [];
    }

    scrapeCurrentReviews() {
        const found = [];

        // Selector cần chỉnh theo cấu trúc thực tế của Shopee (dùng DevTools để kiểm tra)
        const reviewElements = this.queryFirstNonEmpty(document, [
            '[data-testid="comment-container"]',
            '.shopee-product-rating',
            '[class*="product-rating"]'
        ]);

        reviewElements.forEach((element, index) => {
            try {
                const review = this.parseReviewElement(element);
                if (review) found.push(review);
            } catch (error) {
                console.error(`Lỗi parse review ${index}:`, error);
            }
        });

        // Gộp, loại trùng
        for (const r of found) {
            const dup = this.reviews.some(e => e.username === r.username && e.comment === r.comment && e.date === r.date);
            if (!dup) this.reviews.push(r);
        }

        console.log(`Đã lấy ${this.reviews.length} reviews`);
    }

    first(root, selectors) {
        for (const sel of selectors) {
            const el = root.querySelector(sel);
            if (el) return el;
        }
        return null;
    }

    parseReviewElement(element) {
        const usernameEl = this.first(element, ['[class*="author"]', '[class*="username"]', '[class*="name"]']);
        const ratingEl = this.first(element, ['[class*="rating"]', '[class*="star"]']);
        const commentEl = this.first(element, ['[class*="comment-text"]', '[class*="content"]', 'p']);
        const likeEl = this.first(element, ['[class*="like"]', '[class*="favorite"]']);
        const dateEl = this.first(element, ['[class*="date"]', '[class*="time"]']);

        if (!usernameEl || !commentEl) return null;

        return {
            username: this.extractText(usernameEl),
            rating: this.extractRating(element, ratingEl),
            comment: this.extractText(commentEl),
            likes: this.extractNumber(likeEl),
            date: this.extractText(dateEl)
        };
    }

    extractText(el) {
        return el ? el.textContent.trim() : 'N/A';
    }

    extractRating(root, el) {
        // Shopee thường hiển thị sao bằng các icon; đếm icon sao đầy nếu có
        const solid = root.querySelectorAll('[class*="star"][class*="solid"], [class*="icon-rating-solid"]');
        if (solid.length > 0) return Math.min(solid.length, 5);
        if (!el) return 0;
        const match = el.textContent.match(/(\d)/);
        return match ? Math.min(parseInt(match[1], 10), 5) : 0;
    }

    extractNumber(el) {
        if (!el) return 0;
        const match = el.textContent.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    async scrollAndLoadMore(count) {
        for (let i = 0; i < count; i++) {
            window.scrollBy({ top: 600, behavior: 'smooth' });
            await this.delay(800);
            this.scrapeCurrentReviews();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

new ShopeeContentScraper();
