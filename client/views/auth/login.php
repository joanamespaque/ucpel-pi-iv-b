<?php

use InterCT\Client\Security\Csrf;

/** @var bool $enabled */
/** @var bool $locked */
$title = 'Entrar';
?>
<section class="card form narrow">
    <h1>Área de administração</h1>
    <?php if (!$enabled): ?>
        <p>Os cadastros estão desativados neste ambiente. As consultas continuam disponíveis.</p>
    <?php else: ?>
        <p class="muted">Informe a senha para cadastrar, alterar ou remover dados.</p>
        <form method="post" action="/entrar">
            <?= Csrf::field() ?>
            <label>Senha
                <input name="password" type="password" autocomplete="current-password" required <?= $locked ? 'disabled' : '' ?>>
            </label>
            <div class="actions"><button type="submit" class="button" <?= $locked ? 'disabled' : '' ?>>Entrar</button></div>
        </form>
    <?php endif; ?>
</section>
