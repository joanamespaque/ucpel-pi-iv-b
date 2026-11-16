<?php

declare(strict_types=1);

namespace InterCT\Client\Support;

use DateTimeImmutable;

/**
 * Formatação de datas e valores para exibição.
 */
final class Format
{
    private const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

    /** AAAA-MM-DD para DD/MM/AAAA. */
    public static function date(?string $isoDate): string
    {
        if ($isoDate === null || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $isoDate, $m)) {
            return '';
        }
        return "{$m[3]}/{$m[2]}/{$m[1]}";
    }

    /** Dia da semana e data, por exemplo "segunda-feira, 16/11/2026". */
    public static function weekday(string $isoDate): string
    {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $isoDate);
        return $date === false ? $isoDate : self::WEEKDAYS[(int) $date->format('w')] . ', ' . $date->format('d/m/Y');
    }

    /** Idade completa em anos na data de referência. */
    public static function age(string $birthDate, ?DateTimeImmutable $today = null): ?int
    {
        $birth = DateTimeImmutable::createFromFormat('!Y-m-d', $birthDate);
        return $birth === false ? null : $birth->diff($today ?? new DateTimeImmutable('today'))->y;
    }
}
