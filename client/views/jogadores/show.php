<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $player */
/** @var \InterCT\Client\Security\Auth $auth */
$title = $player['shirtName'];
?>
<p class="breadcrumb"><a href="/">Painel</a> / <a href="/times/<?= (int) $player['team']['id'] ?>"><?= e($player['team']['name']) ?></a> / Atleta</p>
<div class="page-head">
    <div>
        <h1><span class="shirt"><?= (int) $player['number'] ?></span> <?= e($player['shirtName']) ?></h1>
        <p class="lead"><?= e($player['name']) ?></p>
    </div>
    <?php if ($auth->check()): ?>
        <div class="actions">
            <a class="button secondary" href="/jogadores/<?= (int) $player['id'] ?>/editar">Editar</a>
            <form method="post" action="/jogadores/<?= (int) $player['id'] ?>/excluir" class="inline confirm" data-confirm="Remover <?= e($player['shirtName']) ?> do elenco?">
                <?= Csrf::field() ?>
                <button type="submit" class="button danger">Remover</button>
            </form>
        </div>
    <?php endif; ?>
</div>
<section class="card">
    <dl class="facts facts-grid">
        <div><dt>Posição</dt><dd><?= e(Labels::of(Labels::POSITIONS, $player['position'])) ?></dd></div>
        <div><dt>Pé preferido</dt><dd><?= e(Labels::of(Labels::FEET, $player['preferredFoot'])) ?></dd></div>
        <div><dt>Nascimento</dt><dd><?= e(Format::date($player['birthDate'])) ?> (<?= e(Format::age($player['birthDate'])) ?> anos)</dd></div>
        <div><dt>Situação</dt><dd><?= e(Labels::of(Labels::STATUSES, $player['status'])) ?></dd></div>
        <div><dt>Time</dt><dd><a href="/times/<?= (int) $player['team']['id'] ?>"><?= e($player['team']['name']) ?></a></dd></div>
    </dl>
</section>
