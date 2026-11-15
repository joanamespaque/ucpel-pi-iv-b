<?php

declare(strict_types=1);

namespace InterCT\Client;

use RuntimeException;

/**
 * Renderiza os templates PHP de views/ dentro do layout.
 */
final class View
{
    /** @var array<string, mixed> */
    private array $shared = [];

    /** Título definido pelo template na variável $title, usado pelo layout. */
    private ?string $title = null;

    public function __construct(private readonly string $directory)
    {
    }

    /** Dados disponíveis em todos os templates. */
    public function share(string $name, mixed $value): void
    {
        $this->shared[$name] = $value;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function render(string $template, array $data = [], ?string $layout = 'layout/base'): string
    {
        $content = $this->capture($template, $data);
        if ($layout === null) {
            return $content;
        }
        return $this->capture($layout, ['content' => $content, 'title' => $this->title ?? ($data['title'] ?? null)] + $data);
    }

    /**
     * @param array<string, mixed> $data
     */
    private function capture(string $template, array $data): string
    {
        $file = $this->directory . '/' . $template . '.php';
        if (!preg_match('#^[a-z0-9/_-]+$#', $template) || !is_file($file)) {
            throw new RuntimeException("Template inexistente: {$template}");
        }
        extract($this->shared + $data, EXTR_SKIP);
        ob_start();
        try {
            include $file;
            if (isset($title) && is_string($title)) {
                $this->title = $title;
            }
            return (string) ob_get_clean();
        } catch (\Throwable $error) {
            ob_end_clean();
            throw $error;
        }
    }
}
