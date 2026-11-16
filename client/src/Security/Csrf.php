<?php

declare(strict_types=1);

namespace InterCT\Client\Security;

/**
 * Token contra falsificação de requisições entre sites (CSRF), guardado na sessão.
 */
final class Csrf
{
    private const KEY = '_csrf';

    public static function token(): string
    {
        if (empty($_SESSION[self::KEY])) {
            $_SESSION[self::KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::KEY];
    }

    public static function field(): string
    {
        return '<input type="hidden" name="_csrf" value="' . htmlspecialchars(self::token(), ENT_QUOTES, 'UTF-8') . '">';
    }

    public static function valid(mixed $token): bool
    {
        return is_string($token) && !empty($_SESSION[self::KEY]) && hash_equals($_SESSION[self::KEY], $token);
    }
}
