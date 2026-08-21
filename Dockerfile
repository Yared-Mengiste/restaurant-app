# ------------------------------------------------------------
# 1. Base PHP image with FPM
# ------------------------------------------------------------
FROM php:8.2-fpm

# ------------------------------------------------------------
# 2. Install system dependencies
# ------------------------------------------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    nano \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libpq-dev \
    build-essential

# ------------------------------------------------------------
# 3. Install PHP extensions (Added pdo_pgsql for Neon)
# ------------------------------------------------------------
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

# Enable GD image library with WebP support
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd

# ------------------------------------------------------------
# 4. Install Composer
# ------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ------------------------------------------------------------
# 5. Install Node.js (for Vite)
# ------------------------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# ------------------------------------------------------------
# 6. Create project directory
# ------------------------------------------------------------
WORKDIR /var/www/html

# ------------------------------------------------------------
# 7. Copy app files
# ------------------------------------------------------------
COPY . .

# ------------------------------------------------------------
# 8. Install PHP dependencies
# ------------------------------------------------------------
RUN composer install --no-dev --optimize-autoloader

# ------------------------------------------------------------
# 9. Install JS dependencies and build React (Vite)
# ------------------------------------------------------------
RUN npm ci && npm run build

# ------------------------------------------------------------
# 10. Laravel permissions
# ------------------------------------------------------------
RUN mkdir -p /var/www/html/storage/framework/cache/data \
             /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/logs
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ------------------------------------------------------------
# 11. Expose port 8000 for Laravel
# ------------------------------------------------------------
EXPOSE 8000

# ------------------------------------------------------------
# 12. Start Laravel (Production Optimized)
# ------------------------------------------------------------
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan storage:link && \
    php artisan serve --host 0.0.0.0 --port 8000
