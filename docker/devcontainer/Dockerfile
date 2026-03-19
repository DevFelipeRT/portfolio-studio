FROM node:22-bookworm AS node

FROM php:8.4-cli-bookworm

ARG UID=1000
ARG GID=1000

ENV APP_BASE_DIR=/var/www/html \
    COMPOSER_ALLOW_SUPERUSER=1 \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        less \
        nano \
        openssh-client \
        procps \
        sudo \
        tzdata \
        unzip \
        zip \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd intl zip pdo_mysql mbstring exif \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN groupadd --gid "${GID}" devgroup \
    && useradd --uid "${UID}" --gid devgroup --shell /bin/bash --create-home devuser \
    && usermod -aG sudo devuser \
    && echo "devuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/devuser \
    && chmod 0440 /etc/sudoers.d/devuser \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && ln -sf /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack \
    && mkdir -p /var/www/html/.composer /var/www/html/.cache /var/www/html/.npm \
    && chown -R devuser:devgroup /var/www/html

USER devuser

ENV PATH="/home/devuser/.composer/vendor/bin:${PATH}" \
    COMPOSER_HOME="/var/www/html/.composer" \
    NPM_CONFIG_CACHE="/var/www/html/.npm" \
    XDG_CACHE_HOME="/var/www/html/.cache"

WORKDIR ${APP_BASE_DIR}

RUN composer --version \
    && node --version \
    && npm --version

CMD ["sleep", "infinity"]
