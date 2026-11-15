<?php

declare(strict_types=1);

namespace InterCT\Client\Security;

/**
 * Acesso às telas de cadastro, protegido por uma senha definida em variável de ambiente:
 * ADMIN_PASSWORD_HASH (hash gerado por password_hash) ou ADMIN_PASSWORD (valor gerado pela hospedagem).
 * Sem nenhuma das duas, as telas de cadastro ficam indisponíveis.
 */
final class Auth
{
    private const KEY = '_auth';
    private const MAX_ATTEMPTS = 5;
    private const LOCK_SECONDS = 300;

    public function __construct(private readonly ?string $passwordHash, private readonly ?string $password = null)
    {
    }

    public function enabled(): bool
    {
        return $this->passwordHash !== null || $this->password !== null;
    }

    /** Compara a senha informada sem revelar diferenças pelo tempo de resposta. */
    private function matches(string $given): bool
    {
        if ($this->passwordHash !== null) {
            return password_verify($given, $this->passwordHash);
        }
        return hash_equals(hash('sha256', (string) $this->password), hash('sha256', $given));
    }

    public function check(): bool
    {
        return $this->enabled() && ($_SESSION[self::KEY] ?? false) === true;
    }

    /**
     * Valida a senha. Após cinco tentativas erradas, bloqueia novas tentativas por cinco minutos na sessão.
     */
    public function attempt(string $password): bool
    {
        if (!$this->enabled() || $this->locked()) {
            return false;
        }
        if ($this->matches($password)) {
            session_regenerate_id(true);
            $_SESSION[self::KEY] = true;
            unset($_SESSION['_attempts'], $_SESSION['_locked_until']);
            return true;
        }
        $_SESSION['_attempts'] = ($_SESSION['_attempts'] ?? 0) + 1;
        if ($_SESSION['_attempts'] >= self::MAX_ATTEMPTS) {
            $_SESSION['_locked_until'] = time() + self::LOCK_SECONDS;
            $_SESSION['_attempts'] = 0;
        }
        return false;
    }

    public function locked(): bool
    {
        return ($_SESSION['_locked_until'] ?? 0) > time();
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_regenerate_id(true);
    }
}
