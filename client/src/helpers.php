<?php

declare(strict_types=1);

/**
 * Escapa um valor para exibição segura em HTML.
 */
function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Gera as opções de um <select> a partir de um mapa valor => rótulo.
 *
 * @param array<int|string, string> $options
 */
function options(array $options, mixed $selected, ?string $empty = null): string
{
    $html = $empty !== null ? '<option value="">' . e($empty) . '</option>' : '';
    foreach ($options as $value => $label) {
        $isSelected = (string) $value === (string) ($selected ?? '') ? ' selected' : '';
        $html .= '<option value="' . e($value) . '"' . $isSelected . '>' . e($label) . '</option>';
    }
    return $html;
}

/**
 * Mensagem de erro de um campo do formulário, se houver.
 *
 * @param array<string, string> $errors
 */
function field_error(array $errors, string $field): string
{
    return isset($errors[$field]) ? '<p class="field-error">' . e($errors[$field]) . '</p>' : '';
}
