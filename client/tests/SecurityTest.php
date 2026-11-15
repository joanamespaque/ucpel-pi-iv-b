<?php

declare(strict_types=1);

namespace InterCT\Client\Tests;

use InterCT\Client\Security\Auth;
use InterCT\Client\Security\Csrf;
use InterCT\Client\Security\LoginThrottle;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use PHPUnit\Framework\TestCase;

final class SecurityTest extends TestCase
{
    protected function setUp(): void
    {
        $_SESSION = [];
    }

    public function testTokenCsrfEhEstavelNaSessaoEValidadoComComparacaoSegura(): void
    {
        $token = Csrf::token();

        self::assertSame(64, strlen($token));
        self::assertSame($token, Csrf::token());
        self::assertTrue(Csrf::valid($token));
        self::assertFalse(Csrf::valid('outro'));
        self::assertFalse(Csrf::valid(null));
        self::assertStringContainsString('name="_csrf"', Csrf::field());
    }

    public function testSemHashConfiguradoOAcessoFicaDesativado(): void
    {
        $auth = new Auth(null);

        self::assertFalse($auth->enabled());
        self::assertFalse($auth->attempt('qualquer'));
        self::assertFalse($auth->check());
    }

    #[RunInSeparateProcess]
    public function testSenhaCorretaLiberaOAcesso(): void
    {
        session_start();
        $auth = new Auth(password_hash('senha-de-teste', PASSWORD_DEFAULT));

        self::assertTrue($auth->attempt('senha-de-teste'));
        self::assertTrue($auth->check());
    }

    #[RunInSeparateProcess]
    public function testSenhaEmTextoDaVariavelDeAmbienteTambemEhAceita(): void
    {
        session_start();
        $auth = new Auth(null, 'valor-gerado');

        self::assertTrue($auth->enabled());
        self::assertFalse($auth->attempt('valor-errado'));
        self::assertTrue($auth->attempt('valor-gerado'));
    }

    public function testEmProducaoSenhaCurtaDesativaOsCadastros(): void
    {
        self::assertFalse((new Auth(null, 'curta', true))->enabled());
        self::assertTrue((new Auth(null, str_repeat('a', 16), true))->enabled());
        self::assertTrue((new Auth(null, 'curta', false))->enabled());
    }

    public function testContadorPorIpBloqueiaMesmoSemACookieDaSessao(): void
    {
        $directory = sys_get_temp_dir() . '/interct-teste-' . bin2hex(random_bytes(4));
        $throttle = new LoginThrottle($directory, 3, 60);
        $hash = password_hash('senha-de-teste', PASSWORD_DEFAULT);

        for ($i = 0; $i < 3; $i++) {
            $_SESSION = [];
            (new Auth($hash, null, false, $throttle, '203.0.113.7', 0))->attempt('errada');
        }

        $_SESSION = [];
        $auth = new Auth($hash, null, false, $throttle, '203.0.113.7', 0);
        self::assertTrue($auth->locked());
        self::assertFalse($auth->attempt('senha-de-teste'));
        self::assertFalse((new Auth($hash, null, false, $throttle, '198.51.100.2', 0))->locked());
        array_map('unlink', glob($directory . '/*') ?: []);
        rmdir($directory);
    }

    public function testCincoTentativasErradasBloqueiamNovasTentativas(): void
    {
        $auth = new Auth(password_hash('senha-de-teste', PASSWORD_DEFAULT), null, false, null, '', 0);

        for ($i = 0; $i < 5; $i++) {
            self::assertFalse($auth->attempt('errada'));
        }

        self::assertTrue($auth->locked());
        self::assertFalse($auth->attempt('senha-de-teste'));
    }
}
