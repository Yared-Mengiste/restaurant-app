#!/bin/sh
set -eu

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link || true

php-fpm -D
exec nginx -g 'daemon off;'
