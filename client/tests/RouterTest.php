<?php

declare(strict_types=1);

namespace InterCT\Client\Tests;

use InterCT\Client\Router;
use PHPUnit\Framework\TestCase;

final class RouterTest extends TestCase
{
    private Router $router;

    protected function setUp(): void
    {
        $this->router = new Router();
        $this->router->get('/jogadores/novo', fn () => 'novo');
        $this->router->get('/jogadores/{id}', fn (int $id) => "jogador {$id}");
        $this->router->post('/jogadores/{id}/excluir', fn (int $id) => "excluir {$id}");
    }

    public function testRotaFixaTemPrioridadeSobreParametro(): void
    {
        [$action, $params] = $this->router->match('GET', '/jogadores/novo');

        self::assertSame('novo', $action(...$params));
    }

    public function testParametroNumericoEhConvertidoParaInteiro(): void
    {
        [$action, $params] = $this->router->match('GET', '/jogadores/42/');

        self::assertSame([42], $params);
        self::assertSame('jogador 42', $action(...$params));
    }

    public function testParametroInvalidoNaoCorresponde(): void
    {
        self::assertNull($this->router->match('GET', '/jogadores/abc'));
        self::assertNull($this->router->match('GET', '/jogadores/0'));
        self::assertNull($this->router->match('GET', '/jogadores/12345678901'));
    }

    public function testMetodoDiferenteNaoCorrespondeMasEhIdentificado(): void
    {
        self::assertNull($this->router->match('GET', '/jogadores/5/excluir'));
        self::assertTrue($this->router->allowsOtherMethod('GET', '/jogadores/5/excluir'));
        self::assertFalse($this->router->allowsOtherMethod('GET', '/inexistente'));
    }
}
