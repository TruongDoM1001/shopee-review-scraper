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
            }
        });
    }

    scrapeCurrentReviews() {
        this.reviews = [];
        
        // Selector cho comment trong Shopee - cần điều chỉnh theo cấu trúc thực tế
        const reviewElements = document.querySelectorAll('[data-testid="comment-container"]') ||
                               document.querySelectorAll('.shopee-comment-item') ||
                               document.querySelectorAll('[class*="comment"]');

        reviewElements.forEach((element, index) => {
            try {
                const review = this.parseReviewElement(element);
                if (review) {
                    this.reviews.push(review);
                }
            } catch (error) {
                console.error(`Lỗi parse review ${index}:`, error);
            }
        });

        console.log(`Đã lấy ${this.reviews.length} reviews`);
    }

    parseReviewElement(element) {
        // Tìm username
        const usernameEl = element.querySelector('[class*="username"]') ||
                          element.querySelector('[class*="name"]') ||
                          element.querySelector('span:first-child');
        
        // Tìm rating (số sao)
        const ratingEl = element.querySelector('[class*="rating"]') ||
                        element.querySelector('[class*="star"]');
        
        // Tìm comment text
        const commentEl = element.querySelector('[class*="comment-text"]') ||
                         element.querySelector('[class*="text"]') ||
                         element.querySelector('p');
        
        // Tìm like count
        const likeEl = element.querySelector('[class*="like"]') ||
                      element.querySelector('[class*="favorite"]');
        
        // Tìm ngày
        const dateEl = element.querySelector('[class*="date"]') ||
                      element.querySelector('[class*="time"]');

        if (!usernameEl || !commentEl) return null;

        return {
            username: this.extractText(usernameEl),
            rating: this.extractRating(ratingEl),
            comment: this.extractText(commentEl),
            likes: this.extractNumber(likeEl),
            date: this.extractDate(dateEl)
        };
    }

    extractText(el) {
        return el ? el.textContent.trim() : 'N/A';
    }

    extractRating(el) {
        if (!el) return 0;
        const text = el.textContent;
        const match = text.match(/(\d)/);
        return match ? parseInt(match[1]) : 0;
    }

    extractNumber(el) {
        if (!el) return 0;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    extractDate(el) {
        return el ? el.textContent.trim() : 'N/A';
    }

    async scrollAndLoadMore(count) {
        const scrollContainer = document.querySelector('[class*="comments"]') || window;
        
        for (let i = 0; i < count; i++) {
            scrollContainer.scrollBy({ top: 500, behavior: 'smooth' });
            await this.delay(300);
            
            // Lấy reviews mới sau khi scroll
            this.scrapeCurrentReviews();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

new ShopeeContentScraper();
