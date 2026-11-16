<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;

/** @var array<string, string> $filters */
/** @var list<array<string, mixed>> $teams */
/** @var array<string, list<array<string, mixed>>> $days */
/** @var \InterCT\Client\Security\Auth $auth */
$title = 'Agenda de treinos';
?>
<div class="page-head">
    <div>
        <h1>Agenda de treinos</h1>
        <p class="lead">De <?= e(Format::date($filters['de'])) ?> a <?= e(Format::date($filters['ate'])) ?>.</p>
    </div>
    <?php if ($auth->check()): ?>
        <a class="button" href="/treinos/novo<?= $filters['timeId'] !== '' ? '?timeId=' . (int) $filters['timeId'] : '' ?>">Agendar treino</a>
    <?php endif; ?>
</div>
<form method="get" class="filters">
    <label>Time <select name="timeId"><?= options(array_column($teams, 'name', 'id'), $filters['timeId'], 'Todos') ?></select></label>
    <label>De <input name="de" type="date" value="<?= e($filters['de']) ?>"></label>
    <label>Até <input name="ate" type="date" value="<?= e($filters['ate']) ?>"></label>
    <button type="submit" class="button secondary">Filtrar</button>
</form>
<?php if (!$days): ?>
    <p class="muted">Nenhum treino no período.</p>
<?php endif; ?>
<?php foreach ($days as $date => $sessions): ?>
    <section class="day">
        <h2><?= e(ucfirst(Format::weekday($date))) ?></h2>
        <?php foreach ($sessions as $session): ?>
            <article class="session">
                <div class="session-time"><?= e($session['startTime']) ?><span><?= e($session['endTime']) ?></span></div>
                <div class="session-body">
                    <p><strong><?= e(Labels::of(Labels::SESSIONS, $session['type'])) ?></strong> · <?= e($session['team']['name']) ?></p>
                    <p class="muted">
                        <?= e($session['facility']['name']) ?>
                        <?php if ($session['kit']): ?> · Uniforme: <?= e(Labels::of(Labels::KITS, $session['kit']['type'])) ?> (<?= e($session['kit']['colors']) ?>)<?php endif; ?>
                    </p>
                    <?php if ($session['notes']): ?><p><?= e($session['notes']) ?></p><?php endif; ?>
                </div>
                <?php if ($auth->check()): ?>
                    <div class="session-actions">
                        <a href="/treinos/<?= (int) $session['id'] ?>/editar">Editar</a>
                        <form method="post" action="/treinos/<?= (int) $session['id'] ?>/excluir" class="inline confirm" data-confirm="Cancelar este treino?">
                            <?= Csrf::field() ?>
                            <button type="submit" class="link danger">Cancelar</button>
                        </form>
                    </div>
                <?php endif; ?>
            </article>
        <?php endforeach; ?>
    </section>
<?php endforeach; ?>
