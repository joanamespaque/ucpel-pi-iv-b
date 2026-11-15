<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Flash;

/**
 * Entrada e saída da área de administração.
 */
final class AuthController extends Controller
{
    public function form(): string
    {
        return $this->render('auth/login', ['enabled' => $this->auth->enabled(), 'locked' => $this->auth->locked()]);
    }

    public function login(): string
    {
        if (!Csrf::valid($_POST['_csrf'] ?? null)) {
            Flash::add('error', 'Formulário expirado. Tente novamente.');
            return $this->redirect('/entrar');
        }
        if ($this->auth->attempt((string) ($_POST['password'] ?? ''))) {
            Flash::add('success', 'Acesso liberado para cadastros e alterações.');
            return $this->redirect('/');
        }
        Flash::add('error', $this->auth->locked() ? 'Muitas tentativas. Aguarde alguns minutos.' : 'Senha incorreta.');
        return $this->redirect('/entrar');
    }

    public function logout(): string
    {
        if (Csrf::valid($_POST['_csrf'] ?? null)) {
            $this->auth->logout();
            Flash::add('success', 'Sessão encerrada.');
        }
        return $this->redirect('/');
    }
}
