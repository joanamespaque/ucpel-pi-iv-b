# Dependências instaladas sem pacotes de desenvolvimento.
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
COPY src/helpers.php src/helpers.php
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

FROM php:8.3-apache
RUN a2enmod rewrite \
    && sed -ri 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
    && printf 'ServerTokens Prod\nServerSignature Off\n' > /etc/apache2/conf-available/zz-interct.conf \
    && a2enconf zz-interct \
    && cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && printf 'expose_php = Off\ndate.timezone = America/Sao_Paulo\n' > "$PHP_INI_DIR/conf.d/zz-interct.ini"
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY public ./public
COPY src ./src
COPY views ./views
ENV APP_ENV=production
EXPOSE 80
