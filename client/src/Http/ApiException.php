<?php

declare(strict_types=1);

namespace InterCT\Client\Http;

use RuntimeException;

/**
 * Erro retornado pela API no formato Problem Details (RFC 9457) ou falha de comunicação.
 */
final class ApiException extends RuntimeException
{
    /**
     * @param array<string, string> $fieldErrors mensagens de validação por campo
     */
    public function __construct(
        public readonly int $status,
        public readonly string $title,
        public readonly string $detail,
        public readonly array $fieldErrors = [],
    ) {
        parent::__construct($detail !== '' ? $detail : $title, $status);
    }

    /**
     * Cria a exceção a partir do corpo de erro da API.
     */
    public static function fromProblem(int $status, mixed $body): self
    {
        $problem = is_array($body) ? $body : [];
        $fields = [];
        foreach ($problem['errors'] ?? [] as $error) {
            if (is_array($error) && isset($error['field'], $error['message'])) {
                $fields[(string) $error['field']] ??= (string) $error['message'];
            }
        }

        return new self(
            $status,
            (string) ($problem['title'] ?? 'Erro na API'),
            (string) ($problem['detail'] ?? ''),
            $fields,
        );
    }

    public static function unavailable(string $reason): self
    {
        return new self(503, 'API indisponível', "Não foi possível se comunicar com a API: {$reason}");
    }
}
