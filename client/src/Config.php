<?php

declare(strict_types=1);

namespace InterCT\Client;

/**
 * Configuração lida das variáveis de ambiente.
 */
final class Config
{
    public function __construct(
        public readonly string $apiBaseUrl,
        public readonly ?string $apiKey,
        public readonly ?string $adminPasswordHash,
        public readonly bool $production,
    ) {
    }

    public static function fromEnvironment(): self
    {
        $read = static function (string $name): ?string {
            $value = getenv($name);
            return $value === false || trim($value) === '' ? null : trim($value);
        };

        return new self(
            apiBaseUrl: rtrim($read('API_BASE_URL') ?? 'http://localhost:3000', '/'),
            apiKey: $read('API_KEY'),
            adminPasswordHash: $read('ADMIN_PASSWORD_HASH'),
            production: ($read('APP_ENV') ?? 'production') === 'production',
        );
    }

    /**
     * Carrega um arquivo .env simples (CHAVE=valor) sem sobrescrever variáveis já definidas.
     */
    public static function loadDotEnv(string $path): void
    {
        if (!is_readable($path)) {
            return;
        }
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$name, $value] = array_map('trim', explode('=', $line, 2));
            if (getenv($name) === false) {
                putenv($name . '=' . trim($value, "\"'"));
            }
        }
    }
}
