<?php

declare(strict_types=1);

namespace InterCT\Client;

/**
 * Roteador mínimo: associa método e caminho a uma ação.
 * O marcador {id} aceita apenas dígitos.
 */
final class Router
{
    /** @var list<array{string, string, callable}> */
    private array $routes = [];

    public function get(string $pattern, callable $action): void
    {
        $this->routes[] = ['GET', $pattern, $action];
    }

    public function post(string $pattern, callable $action): void
    {
        $this->routes[] = ['POST', $pattern, $action];
    }

    /**
     * Encontra a ação da requisição.
     *
     * @return array{callable, list<int>}|null ação e parâmetros numéricos da rota
     */
    public function match(string $method, string $path): ?array
    {
        $path = '/' . trim($path, '/');
        foreach ($this->routes as [$routeMethod, $pattern, $action]) {
            if ($routeMethod !== $method) {
                continue;
            }
            $regex = '#^' . str_replace('\{id\}', '([1-9]\d{0,9})', preg_quote($pattern, '#')) . '$#';
            if (preg_match($regex, $path, $matches)) {
                return [$action, array_map('intval', array_slice($matches, 1))];
            }
        }
        return null;
    }

    /**
     * Indica se o caminho existe para algum outro método (para responder 405).
     */
    public function allowsOtherMethod(string $method, string $path): bool
    {
        foreach (['GET', 'POST'] as $other) {
            if ($other !== $method && $this->match($other, $path) !== null) {
                return true;
            }
        }
        return false;
    }
}
