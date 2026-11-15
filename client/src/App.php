<?php

declare(strict_types=1);

namespace InterCT\Client;

use InterCT\Client\Controllers\AuthController;
use InterCT\Client\Controllers\CoachController;
use InterCT\Client\Controllers\HomeController;
use InterCT\Client\Controllers\KitController;
use InterCT\Client\Controllers\PlayerController;
use InterCT\Client\Controllers\SessionController;
use InterCT\Client\Controllers\TeamController;
use InterCT\Client\Http\ApiClient;
use InterCT\Client\Http\ApiException;
use InterCT\Client\Security\Auth;
use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Flash;
use Throwable;

/**
 * Monta as rotas e atende a requisição.
 */
final class App
{
    private Router $router;
    private View $view;

    public function __construct(private readonly Config $config, ?ApiClient $api = null)
    {
        $api ??= new ApiClient($config->apiBaseUrl, $config->apiKey);
        $auth = new Auth($config->adminPasswordHash, $config->adminPassword);
        $this->view = new View(dirname(__DIR__) . '/views');
        $this->view->share('auth', $auth);

        $home = new HomeController($api, $this->view, $auth);
        $teams = new TeamController($api, $this->view, $auth);
        $players = new PlayerController($api, $this->view, $auth);
        $coaches = new CoachController($api, $this->view, $auth);
        $kits = new KitController($api, $this->view, $auth);
        $sessions = new SessionController($api, $this->view, $auth);
        $login = new AuthController($api, $this->view, $auth);

        $r = $this->router = new Router();
        $r->get('/', $home->index(...));
        $r->get('/cts/{id}', $home->showTrainingCenter(...));
        $r->get('/times/{id}', $teams->show(...));

        $r->get('/jogadores/novo', $players->create(...));
        $r->post('/jogadores', $players->store(...));
        $r->get('/jogadores/{id}', $players->show(...));
        $r->get('/jogadores/{id}/editar', $players->edit(...));
        $r->post('/jogadores/{id}', $players->update(...));
        $r->post('/jogadores/{id}/excluir', $players->destroy(...));

        $r->get('/tecnicos/{id}', $coaches->show(...));
        $r->get('/comissao/novo', $coaches->createStaff(...));
        $r->post('/comissao', $coaches->storeStaff(...));
        $r->get('/comissao/{id}/editar', $coaches->editStaff(...));
        $r->post('/comissao/{id}', $coaches->updateStaff(...));
        $r->post('/comissao/{id}/excluir', $coaches->destroyStaff(...));

        $r->get('/uniformes', $kits->index(...));
        $r->get('/uniformes/novo', $kits->create(...));
        $r->post('/uniformes', $kits->store(...));
        $r->get('/uniformes/{id}/editar', $kits->edit(...));
        $r->post('/uniformes/{id}', $kits->update(...));
        $r->post('/uniformes/{id}/excluir', $kits->destroy(...));

        $r->get('/treinos', $sessions->index(...));
        $r->get('/treinos/novo', $sessions->create(...));
        $r->post('/treinos', $sessions->store(...));
        $r->get('/treinos/{id}/editar', $sessions->edit(...));
        $r->post('/treinos/{id}', $sessions->update(...));
        $r->post('/treinos/{id}/excluir', $sessions->destroy(...));

        $r->get('/entrar', $login->form(...));
        $r->post('/entrar', $login->login(...));
        $r->post('/sair', $login->logout(...));
    }

    /**
     * Atende a requisição e devolve o HTML da resposta.
     */
    public function handle(string $method, string $uri): string
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $method = $method === 'HEAD' ? 'GET' : $method;
        $match = $this->router->match($method, $path);

        if ($match === null) {
            $allowed = $this->router->allowsOtherMethod($method, $path);
            return $this->error($allowed ? 405 : 404, $allowed ? 'Método não permitido' : 'Página não encontrada', 'Confira o endereço acessado.');
        }

        [$action, $params] = $match;
        try {
            return $action(...$params);
        } catch (ApiException $error) {
            if ($error->status === 401) {
                return $this->error(500, 'Configuração incompleta', 'A API recusou a chave configurada no cliente.');
            }
            if ($error->status === 409 || $error->status === 422) {
                Flash::add('error', $error->getMessage());
                return $this->redirectBack();
            }
            return $this->error($error->status, $error->title, $error->getMessage());
        } catch (Throwable $error) {
            error_log((string) $error);
            return $this->error(500, 'Erro inesperado', 'Não foi possível concluir a operação.');
        }
    }

    private function error(int $status, string $title, string $detail): string
    {
        http_response_code($status);
        return $this->view->render('erro', ['title' => $title, 'detail' => $detail, 'status' => $status]);
    }

    private function redirectBack(): string
    {
        $referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
        $path = parse_url($referer, PHP_URL_PATH);
        $host = parse_url($referer, PHP_URL_HOST);
        $target = is_string($path) && ($host === null || $host === ($_SERVER['HTTP_HOST'] ?? null)) ? $path : '/';
        header('Location: ' . $target, true, 303);
        return '';
    }

    /**
     * Configura a sessão com cookies protegidos.
     */
    public static function startSession(bool $secure): void
    {
        session_name('interct');
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        ini_set('session.use_strict_mode', '1');
        session_start();
        Csrf::token();
    }

    /**
     * Cabeçalhos de segurança enviados em todas as respostas.
     */
    public static function securityHeaders(): void
    {
        header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'");
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: same-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    }
}
