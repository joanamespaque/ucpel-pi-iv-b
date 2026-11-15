<?php

declare(strict_types=1);

namespace InterCT\Client\Tests;

use DateTimeImmutable;
use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;
use PHPUnit\Framework\TestCase;

final class SupportTest extends TestCase
{
    public function testFormataDatasNoPadraoBrasileiro(): void
    {
        self::assertSame('16/11/2026', Format::date('2026-11-16'));
        self::assertSame('', Format::date('16/11/2026'));
        self::assertSame('segunda-feira, 16/11/2026', Format::weekday('2026-11-16'));
    }

    public function testCalculaIdadeCompleta(): void
    {
        $reference = new DateTimeImmutable('2026-11-15');

        self::assertSame(29, Format::age('1997-07-28', $reference));
        self::assertSame(25, Format::age('2000-11-16', $reference));
    }

    public function testTraduzValoresEnumerados(): void
    {
        self::assertSame('Em tratamento', Labels::of(Labels::STATUSES, 'EM_TRATAMENTO'));
        self::assertSame('Bola parada', Labels::of(Labels::SESSIONS, 'BOLA_PARADA'));
        self::assertSame('NOVO_VALOR', Labels::of(Labels::KITS, 'NOVO_VALOR'));
    }

    public function testEscapaHtml(): void
    {
        self::assertSame('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;', e('<script>alert("x")</script>'));
        self::assertSame('<option value="A" selected>Á</option>', options(['A' => 'Á'], 'A'));
    }
}
