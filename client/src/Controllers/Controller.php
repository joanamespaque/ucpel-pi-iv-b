<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use InterCT\Client\Http\ApiClient;
use InterCT\Client\Http\ApiException;
use InterCT\Client\Security\Auth;
use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Flash;
use InterCT\Client\View;

/**
 * Base dos controladores: acesso à API, renderização e respostas.
 */
abstract class Controller
{
    public function __construct(
        protected readonly ApiClient $api,
        protected readonly View $view,
        protected readonly Auth $auth,
    ) {
    }

    /** @param array<string, mixed> $data */
    protected function render(string $template, array $data = [], int $status = 200): string
    {
        http_response_code($status);
        return $this->view->render($template, $data);
    }

    protected function redirect(string $location): string
    {
        header('Location: ' . $location, true, 303);
        return '';
    }

    /**
     * Interrompe ações de escrita sem login ou com token CSRF inválido.
     */
    protected function guardWrite(): ?string
    {
        if (!$this->auth->check()) {
            Flash::add('error', 'Entre com a senha de administração para alterar dados.');
            return $this->redirect('/entrar');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !Csrf::valid($_POST['_csrf'] ?? null)) {
            http_response_code(419);
            return $this->view->render('erro', [
                'title' => 'Formulário expirado',
                'detail' => 'Recarregue a página e envie o formulário novamente.',
            ]);
        }
        return null;
    }

    /** Lê um campo de texto do formulário, com espaços removidos. */
    protected function text(string $name): string
    {
        $value = $_POST[$name] ?? '';
        return is_string($value) ? trim($value) : '';
    }

    /** Campo de texto opcional: vazio vira null. */
    protected function optionalText(string $name): ?string
    {
        $value = $this->text($name);
        return $value === '' ? null : $value;
    }

    /**
     * Campo numérico: inteiro quando válido; texto quando inválido, para a API devolver a mensagem de validação.
     */
    protected function number(string $name): int|string|null
    {
        $value = $this->text($name);
        if ($value === '') {
            return null;
        }
        return preg_match('/^-?\d{1,10}$/', $value) ? (int) $value : $value;
    }

    /** Campo decimal opcional. */
    protected function decimal(string $name): float|string|null
    {
        $value = str_replace(',', '.', $this->text($name));
        if ($value === '') {
            return null;
        }
        return is_numeric($value) ? (float) $value : $value;
    }

    /** Lê um filtro da query string. */
    protected function query(string $name): string
    {
        $value = $_GET[$name] ?? '';
        return is_string($value) ? trim($value) : '';
    }

    /**
     * Busca uma lista na API, retornando lista vazia quando o recurso não existe.
     *
     * @param array<string, scalar|null> $query
     * @return list<array<string, mixed>>
     */
    protected function list(string $path, array $query = []): array
    {
        return $this->api->get($path, $query)->data ?? [];
    }

    /**
     * Busca todas as páginas de uma listagem paginada, de 100 em 100 itens, até o total
     * informado no cabeçalho X-Total-Count ou o limite de páginas.
     *
     * @param array<string, scalar> $query
     * @return list<array<string, mixed>>
     */
    protected function listAll(string $path, array $query = [], int $maxPages = 10): array
    {
        $items = [];
        for ($page = 1; $page <= $maxPages; $page++) {
            $response = $this->api->get($path, $query + ['pagina' => $page, 'limite' => 100]);
            $batch = $response->data ?? [];
            $items = array_merge($items, $batch);
            $total = $response->total();
            if ($batch === [] || count($batch) < 100 || count($items) >= $total) {
                break;
            }
        }
        return $items;
    }

    /**
     * Mostra o formulário novamente com os erros devolvidos pela API.
     *
     * @param array<string, mixed> $data
     */
    protected function formError(ApiException $error, string $template, array $data): string
    {
        $message = $error->status === 400 ? 'Corrija os campos destacados.' : $error->getMessage();
        return $this->render($template, ['errors' => $error->fieldErrors, 'formError' => $message] + $data, $error->status === 503 ? 503 : 422);
    }
}
