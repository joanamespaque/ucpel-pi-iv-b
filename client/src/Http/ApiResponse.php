<?php

declare(strict_types=1);

namespace InterCT\Client\Http;

/**
 * Resposta recebida da API.
 */
final class ApiResponse
{
    /**
     * @param array<string, string> $headers cabeçalhos com nomes em minúsculas
     */
    public function __construct(
        public readonly int $status,
        public readonly mixed $data,
        public readonly array $headers = [],
    ) {
    }

    /**
     * Total de registros informado pelo cabeçalho X-Total-Count nas listagens paginadas.
     */
    public function total(): int
    {
        return isset($this->headers['x-total-count'])
            ? (int) $this->headers['x-total-count']
            : (is_array($this->data) ? count($this->data) : 0);
    }
}
