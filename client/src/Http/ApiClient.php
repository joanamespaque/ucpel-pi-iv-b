<?php

declare(strict_types=1);

namespace InterCT\Client\Http;

use Closure;

/**
 * Cliente HTTP da InterCT API baseado em cURL.
 *
 * A chave de API é enviada apenas nas operações de escrita e nunca chega ao navegador.
 */
final class ApiClient
{
    private const PREFIX = '/api/v1';

    /**
     * @param Closure|null $transport substitui o cURL nos testes:
     *                                fn(string $method, string $url, array $headers, ?string $body): array{int, string, array}
     */
    public function __construct(
        private readonly string $baseUrl,
        private readonly ?string $apiKey = null,
        private readonly ?Closure $transport = null,
        private readonly int $timeoutSeconds = 75,
    ) {
    }

    /** @param array<string, scalar|null> $query */
    public function get(string $path, array $query = []): ApiResponse
    {
        return $this->send('GET', $path, $query);
    }

    /** @param array<string, mixed> $body */
    public function post(string $path, array $body): ApiResponse
    {
        return $this->send('POST', $path, [], $body);
    }

    /** @param array<string, mixed> $body */
    public function put(string $path, array $body): ApiResponse
    {
        return $this->send('PUT', $path, [], $body);
    }

    public function delete(string $path): ApiResponse
    {
        return $this->send('DELETE', $path);
    }

    /**
     * Monta a URL final, descartando filtros vazios.
     *
     * @param array<string, scalar|null> $query
     */
    public function url(string $path, array $query = []): string
    {
        $query = array_filter($query, static fn ($value) => $value !== null && $value !== '');
        return $this->baseUrl . self::PREFIX . $path . ($query ? '?' . http_build_query($query) : '');
    }

    /**
     * @param array<string, scalar|null> $query
     * @param array<string, mixed>|null $body
     */
    private function send(string $method, string $path, array $query = [], ?array $body = null): ApiResponse
    {
        $headers = ['Accept: application/json'];
        $payload = null;
        if ($body !== null) {
            $payload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            $headers[] = 'Content-Type: application/json';
        }
        if ($method !== 'GET') {
            if ($this->apiKey === null) {
                throw new ApiException(401, 'Não autenticado', 'O cliente não possui chave de API configurada.');
            }
            $headers[] = 'X-API-Key: ' . $this->apiKey;
        }

        [$status, $raw, $responseHeaders] = ($this->transport ?? $this->curl(...))($method, $this->url($path, $query), $headers, $payload);
        $data = $raw === '' ? null : json_decode($raw, true);

        if ($status >= 400) {
            throw ApiException::fromProblem($status, $data);
        }

        return new ApiResponse($status, $data, $responseHeaders);
    }

    /**
     * @param list<string> $headers
     * @return array{int, string, array<string, string>}
     */
    private function curl(string $method, string $url, array $headers, ?string $payload): array
    {
        $responseHeaders = [];
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => $this->timeoutSeconds,
            CURLOPT_TIMEOUT => $this->timeoutSeconds,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
            CURLOPT_HEADERFUNCTION => static function ($curl, string $line) use (&$responseHeaders): int {
                $parts = explode(':', $line, 2);
                if (count($parts) === 2) {
                    $responseHeaders[strtolower(trim($parts[0]))] = trim($parts[1]);
                }
                return strlen($line);
            },
        ]);
        if ($payload !== null) {
            curl_setopt($handle, CURLOPT_POSTFIELDS, $payload);
        }

        $raw = curl_exec($handle);
        if ($raw === false) {
            $error = curl_error($handle);
            curl_close($handle);
            throw ApiException::unavailable($error);
        }
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        curl_close($handle);

        return [$status, (string) $raw, $responseHeaders];
    }
}
