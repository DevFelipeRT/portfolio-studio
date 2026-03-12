# ------------------------------------------------------------------------------
# PHP-FPM Image for Laravel (DEV)
#
# Base: PHP 8.4 on Alpine 3.22
# Extensions: gd, intl, zip, opcache, pdo_mysql, mbstring, exif
# Tools: Composer (official), Laravel Installer, Node.js + npm, bash
#
# Design goals:
# - Project-agnostic: no hardcoded project names
# - NPM available inside the PHP container (by requirement)
# - Deterministic user mapping via UID/GID (WSL2-friendly)
# - Sensible PHP dev defaults (errors visible, opcache tuned for dev)
#
# Runtime layout (matched by docker-compose):
# - Application mount: /var/www/html
# ------------------------------------------------------------------------------

FROM php:8.4-fpm-alpine3.22

LABEL org.opencontainers.image.title="php-fpm-8.4-alpine" \
    org.opencontainers.image.description="PHP-FPM 8.4 on Alpine 3.22 with Laravel-ready extensions, Composer, Laravel Installer, Node/NPM, and bash" \
    org.opencontainers.image.licenses="MIT"

# Stable application base directory. Do not point to a subfolder here.
ENV APP_BASE_DIR=/var/www/html \
    COMPOSER_ALLOW_SUPERUSER=1

# Build-time arguments for user/group mapping (match host/WSL user).
ARG UID=1000
ARG GID=1000

# System packages and PHP extensions
RUN set -eux; \
    apk add --no-cache \
    bash curl git nano tzdata shadow ca-certificates \
    openssh-client \
    icu-dev libzip-dev oniguruma-dev \
    libpng-dev freetype-dev libjpeg-turbo-dev \
    nodejs npm; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" gd intl zip opcache pdo_mysql mbstring exif; \
    docker-php-ext-enable opcache

# Create a non-root development user that mirrors the host UID/GID.
RUN set -eux; \
    addgroup -g "${GID}" devgroup; \
    adduser -D -u "${UID}" -G devgroup devuser

# Use bash for subsequent RUN steps.
SHELL ["/bin/bash", "-c"]

# Install Composer from the official image and verify.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN set -eux; composer --version

# Switch to the non-root user for global tooling (Composer/NPM caches, etc.).
USER devuser

# Ensure Composer/NPM binaries are on PATH; route caches to the bind-mount path.
# These can also be overridden at runtime by docker-compose.
ENV PATH="/home/devuser/.composer/vendor/bin:${PATH}" \
    COMPOSER_HOME="/var/www/html/.composer" \
    NPM_CONFIG_CACHE="/var/www/html/.npm" \
    XDG_CACHE_HOME="/var/www/html/.cache"

# Create Composer/NPM cache directories and set sane Composer defaults.
# Note: These directories may be shadowed by the bind-mount at runtime, which is expected.
RUN set -eux; \
    mkdir -p "$COMPOSER_HOME" "$NPM_CONFIG_CACHE" "$XDG_CACHE_HOME"; \
    composer config --global process-timeout 300; \
    composer config --global repos.packagist composer https://packagist.org

# Install Laravel Installer globally (best-effort to avoid build failures on flaky networks).
RUN set -eux; \
    composer global require --no-interaction --no-progress laravel/installer || \
    echo "Warning: Laravel Installer installation failed (likely a network timeout). The container remains usable."; \
    if command -v laravel >/dev/null 2>&1; then laravel --version; else echo "Laravel CLI not available"; fi

# Development-oriented PHP overrides (error visibility, opcache tuned for hot reload).
USER root
RUN set -eux; \
    { \
    echo 'opcache.enable=1'; \
    echo 'opcache.enable_cli=0'; \
    echo 'opcache.validate_timestamps=1'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.jit=tracing'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'upload_max_filesize=20M'; \
    echo 'post_max_size=20M'; \
    echo 'date.timezone=America/Sao_Paulo'; \
    echo 'expose_php=0'; \
    echo 'display_errors=1'; \
    echo 'display_startup_errors=1'; \
    echo 'error_reporting=E_ALL'; \
    } > /usr/local/etc/php/conf.d/zz-laravel-dev.ini

# Return to the non-root user for runtime.
USER devuser

# Fixed working directory for the application root.
WORKDIR ${APP_BASE_DIR}

# Expose php-fpm default port.
EXPOSE 9000

# Start PHP-FPM.
CMD ["php-fpm"]
