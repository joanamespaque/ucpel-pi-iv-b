<?php

declare(strict_types=1);

namespace InterCT\Client\Security;

/**
 * Acesso às telas de cadastro, protegido por uma senha definida em variável de ambiente:
 * ADMIN_PASSWORD_HASH (hash gerado por password_hash) ou ADMIN_PASSWORD (valor gerado pela hospedagem).
 * Sem nenhuma das duas, as telas de cadastro ficam indisponíveis. Em produção, a senha em texto precisa ter
 * ao menos 16 caracteres.
 */
final class Auth
{
    private const KEY = '_auth';
    private const MAX_ATTEMPTS = 5;
    private const LOCK_SECONDS = 300;
    private const MIN_PRODUCTION_LENGTH = 16;
    private const FAILURE_DELAY_MICROSECONDS = 500000;

    public function __construct(
        private readonly ?string $passwordHash,
        private readonly ?string $password = null,
        private readonly bool $production = false,
        private readonly ?LoginThrottle $throttle = null,
        private readonly string $clientIp = '',
        private readonly int $failureDelay = self::FAILURE_DELAY_MICROSECONDS,
    ) {
    }

    public function enabled(): bool
    {
        if ($this->passwordHash !== null) {
            return true;
        }
        return $this->password !== null
            && (!$this->production || mb_strlen($this->password) >= self::MIN_PRODUCTION_LENGTH);
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
     * Valida a senha. Cada erro espera meio segundo. Cinco erros na sessão bloqueiam novas tentativas por cinco
 * minutos, e o contador por IP bloqueia quem descarta o cookie para tentar de novo.
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
            $this->throttle?->clear($this->clientIp);
            return true;
        }
        if ($this->failureDelay > 0) {
            usleep($this->failureDelay);
        }
        $this->throttle?->fail($this->clientIp);
        $_SESSION['_attempts'] = ($_SESSION['_attempts'] ?? 0) + 1;
        if ($_SESSION['_attempts'] >= self::MAX_ATTEMPTS) {
            $_SESSION['_locked_until'] = time() + self::LOCK_SECONDS;
            $_SESSION['_attempts'] = 0;
        }
        return false;
    }

    public function locked(): bool
    {
        return ($_SESSION['_locked_until'] ?? 0) > time() || ($this->throttle?->locked($this->clientIp) ?? false);
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_regenerate_id(true);
    }
}
