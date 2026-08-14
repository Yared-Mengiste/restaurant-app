# Bello Restaurant

Bello Restaurant is a full-stack restaurant ordering application built with Laravel, Inertia, and React. Customers can browse the menu, manage favorites and a cart, place orders, pay through Chapa, and review their order history. Administrators can manage products, categories, availability, and order statuses.

## Stack

- PHP 8.2+ and Laravel 12
- React 18 with Inertia.js
- Tailwind CSS and Vite
- SQLite by default; other Laravel-supported databases can be configured
- Laravel Breeze, Sanctum, Socialite, and Ziggy

## Local Setup

Install PHP, Composer, Node.js, and npm, then run:

```bash
composer run setup
composer run dev
```

The setup command installs dependencies, creates `.env`, generates the application key, runs migrations, and builds the frontend. The development command starts the Laravel server, queue worker, log viewer, and Vite development server.

For manual setup:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
php artisan serve
```

If product or category images are stored on the public disk, create the storage link:

```bash
php artisan storage:link
```

## Configuration

Keep local credentials in `.env`, which is ignored by Git. In addition to the standard Laravel settings, integrations use these variables when enabled:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_REDIRECTS=
CHAPA_SECRET_KEY=
```

Set `APP_URL` to the URL serving the application so callbacks and generated links resolve correctly.

## Development

Build production frontend assets with:

```bash
npm run build
```

Generated files under `public/build/assets/` are intentionally ignored and must not be committed. Build them during deployment instead.

Run the test suite with:

```bash
composer test
```

Format PHP code with:

```bash
./vendor/bin/pint
```

## Security

Never place private API keys or secrets in React code or any variable prefixed with `VITE_`. Frontend values are embedded in browser-readable build files. Server-side credentials belong in `.env` and should be accessed through Laravel configuration.

If a credential is committed, rotate it immediately. Removing a file from the latest commit does not remove the credential from earlier Git history.

## License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
