<?php

declare(strict_types=1);

use InterCT\Client\App;
use InterCT\Client\Config;

require dirname(__DIR__) . '/vendor/autoload.php';

// Arquivos estáticos no servidor embutido do PHP (php -S).
if (PHP_SAPI === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

Config::loadDotEnv(dirname(__DIR__) . '/.env');
$config = Config::fromEnvironment();

ini_set('display_errors', $config->production ? '0' : '1');
$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

App::securityHeaders();
App::startSession($https || $config->production);
header('Content-Type: text/html; charset=utf-8');

echo (new App($config))->handle($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');
