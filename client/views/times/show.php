<?php

use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $team */
/** @var array<string, string> $filters */
/** @var list<array<string, mixed>> $players */
/** @var list<array<string, mixed>> $kits */
/** @var list<array<string, mixed>> $sessions */
/** @var \InterCT\Client\Security\Auth $auth */
$title = $team['name'];
$statusClass = ['DISPONIVEL' => 'ok', 'EM_TRATAMENTO' => 'warn', 'SUSPENSO' => 'danger'];
?>
<p class="breadcrumb"><a href="/">Painel</a> / Time</p>
<div class="page-head">
    <div>
        <h1><?= e($team['name']) ?></h1>
        <p class="lead"><?= e($team['nickname']) ?> · <a href="/cts/<?= (int) $team['trainingCenter']['id'] ?>"><?= e($team['trainingCenter']['name']) ?></a></p>
    </div>
    <?php if ($auth->check()): ?>
        <a class="button" href="/jogadores/novo?timeId=<?= (int) $team['id'] ?>">Cadastrar atleta</a>
    <?php endif; ?>
</div>

<div class="grid">
    <section class="card">
        <h2>Comando técnico</h2>
        <?php if ($team['coach']): ?>
            <p><a href="/tecnicos/<?= (int) $team['coach']['id'] ?>"><?= e($team['coach']['name']) ?></a></p>
            <p class="muted">Veja a comissão técnica completa na página do técnico.</p>
        <?php else: ?>
            <p class="muted">Time sem técnico definido.</p>
        <?php endif; ?>
    </section>
    <section class="card">
        <h2>Competições</h2>
        <ul class="list">
            <?php foreach ($team['competitions'] as $competition): ?><li><?= e($competition) ?></li><?php endforeach; ?>
        </ul>
    </section>
    <section class="card">
        <h2>Próximos treinos</h2>
        <?php if (!$sessions): ?>
            <p class="muted">Nenhum treino agendado.</p>
        <?php else: ?>
            <ul class="list">
                <?php foreach ($sessions as $session): ?>
                    <li><?= e(Format::date($session['date'])) ?>, <?= e($session['startTime']) ?>: <?= e(Labels::of(Labels::SESSIONS, $session['type'])) ?> (<?= e($session['facility']['name']) ?>)</li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
        <p><a href="/treinos?timeId=<?= (int) $team['id'] ?>">Agenda do time</a></p>
    </section>
</div>

<h2>Elenco</h2>
<form method="get" class="filters">
    <label>Posição <select name="posicao"><?= options(Labels::POSITIONS, $filters['posicao'], 'Todas') ?></select></label>
    <label>Situação <select name="situacao"><?= options(Labels::STATUSES, $filters['situacao'], 'Todas') ?></select></label>
    <button type="submit" class="button secondary">Filtrar</button>
</form>
<?php if (!$players): ?>
    <p class="muted">Nenhum atleta encontrado com esses filtros.</p>
<?php else: ?>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Nº</th><th>Atleta</th><th>Posição</th><th>Pé</th><th>Idade</th><th>Situação</th></tr></thead>
            <tbody>
            <?php foreach ($players as $player): ?>
                <tr>
                    <td class="number"><?= (int) $player['number'] ?></td>
                    <td><a href="/jogadores/<?= (int) $player['id'] ?>"><?= e($player['shirtName']) ?></a></td>
                    <td><?= e(Labels::of(Labels::POSITIONS, $player['position'])) ?></td>
                    <td><?= e(Labels::of(Labels::FEET, $player['preferredFoot'])) ?></td>
                    <td><?= e(Format::age($player['birthDate'])) ?></td>
                    <td><span class="badge badge-<?= e($statusClass[$player['status']] ?? 'ok') ?>"><?= e(Labels::of(Labels::STATUSES, $player['status'])) ?></span></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <p class="muted"><?= count($players) ?> atleta(s).</p>
<?php endif; ?>

<h2>Uniformes</h2>
<div class="grid">
    <?php foreach ($kits as $kit): ?>
        <div class="card">
            <span class="tag"><?= (int) $kit['season'] ?></span>
            <h3><?= e(Labels::of(Labels::KITS, $kit['type'])) ?></h3>
            <p><?= e($kit['colors']) ?></p>
            <p class="muted"><?= e($kit['supplier']) ?></p>
        </div>
    <?php endforeach; ?>
</div>
<p><a href="/uniformes?timeId=<?= (int) $team['id'] ?>">Gerenciar uniformes</a></p>
