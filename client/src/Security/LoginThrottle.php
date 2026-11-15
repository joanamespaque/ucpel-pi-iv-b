<?php

declare(strict_types=1);

namespace InterCT\Client\Security;

/**
 * Conta tentativas de login erradas por endereço IP, em arquivos no diretório temporário.
 * Complementa o bloqueio por sessão, que pode ser contornado descartando o cookie.
 */
final class LoginThrottle
{
    public function __construct(
        private readonly string $directory,
        private readonly int $maxAttempts = 10,
        private readonly int $lockSeconds = 900,
    ) {
    }

    public static function inTempDir(): self
    {
        return new self(sys_get_temp_dir() . '/interct-login');
    }

    public function locked(string $ip): bool
    {
        return ($this->read($ip)['until'] ?? 0) > time();
    }

    public function fail(string $ip): void
    {
        $data = $this->read($ip);
        $data['count'] = ($data['count'] ?? 0) + 1;
        if ($data['count'] >= $this->maxAttempts) {
            $data = ['count' => 0, 'until' => time() + $this->lockSeconds];
        }
        $this->write($ip, $data);
    }

    public function clear(string $ip): void
    {
        @unlink($this->file($ip));
    }

    private function file(string $ip): string
    {
        return $this->directory . '/' . hash('sha256', $ip) . '.json';
    }

    /** @return array{count?: int, until?: int} */
    private function read(string $ip): array
    {
        $raw = @file_get_contents($this->file($ip));
        $data = $raw === false ? null : json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    /** @param array{count?: int, until?: int} $data */
    private function write(string $ip, array $data): void
    {
        if (!is_dir($this->directory)) {
            @mkdir($this->directory, 0700, true);
        }
        @file_put_contents($this->file($ip), json_encode($data), LOCK_EX);
    }
}
