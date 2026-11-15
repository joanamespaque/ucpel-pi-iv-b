<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Flash;

/** @var string $content */
/** @var \InterCT\Client\Security\Auth $auth */
$current = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$active = static fn (string $prefix): string => ($prefix === '/' ? $current === '/' : str_starts_with($current, $prefix)) ? ' aria-current="page"' : '';
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e(($title ?? null) ? $title . ' · ' : '') ?>InterCT</title>
    <link rel="stylesheet" href="/assets/app.css">
    <script src="/assets/app.js" defer></script>
</head>
<body>
<header class="topbar">
    <div class="container topbar-inner">
        <a class="brand" href="/">Inter<span>CT</span></a>
        <nav aria-label="Navegação principal">
            <a href="/"<?= $active('/') ?>>Painel</a>
            <a href="/treinos"<?= $active('/treinos') ?>>Treinos</a>
            <a href="/uniformes"<?= $active('/uniformes') ?>>Uniformes</a>
            <?php if ($auth->check()): ?>
                <form method="post" action="/sair" class="inline">
                    <?= Csrf::field() ?>
                    <button type="submit" class="link">Sair</button>
                </form>
            <?php else: ?>
                <a href="/entrar"<?= $active('/entrar') ?>>Entrar</a>
            <?php endif; ?>
        </nav>
    </div>
</header>
<main class="container">
    <?php foreach (Flash::pull() as $flash): ?>
        <div class="alert alert-<?= e($flash['type']) ?>" role="status"><?= e($flash['message']) ?></div>
    <?php endforeach; ?>
    <?= $content ?>
</main>
<footer class="container footer">
    Projeto Integrador IV-B (UCPel). Os nomes de jogadores e profissionais são ilustrativos.
</footer>
</body>
</html>
