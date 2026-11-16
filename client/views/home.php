<?php

use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;

/** @var list<array<string, mixed>> $trainingCenters */
/** @var list<array<string, mixed>> $teams */
/** @var list<array<string, mixed>> $sessions */
?>
<h1>Painel do CT</h1>
<p class="lead">Centros de treinamento, times principais e agenda do Sport Club Internacional.</p>

<h2>Times</h2>
<div class="grid">
    <?php foreach ($teams as $team): ?>
        <a class="card card-link" href="/times/<?= (int) $team['id'] ?>">
            <span class="tag"><?= e(Labels::of(Labels::CATEGORIES, $team['category'])) ?></span>
            <h3><?= e($team['name']) ?></h3>
            <?php if ($team['nickname']): ?><p class="muted"><?= e($team['nickname']) ?></p><?php endif; ?>
            <dl class="facts">
                <div><dt>Técnico(a)</dt><dd><?= e($team['coach']['name'] ?? 'Não definido') ?></dd></div>
                <div><dt>Elenco</dt><dd><?= (int) $team['playersCount'] ?> atletas</dd></div>
                <div><dt>CT</dt><dd><?= e($team['trainingCenter']['name']) ?></dd></div>
            </dl>
        </a>
    <?php endforeach; ?>
</div>

<h2>Próximos treinos</h2>
<?php if (!$sessions): ?>
    <p class="muted">Nenhum treino agendado para os próximos 7 dias.</p>
<?php else: ?>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Data</th><th>Horário</th><th>Time</th><th>Tipo</th><th>Espaço</th></tr></thead>
            <tbody>
            <?php foreach ($sessions as $session): ?>
                <tr>
                    <td><?= e(Format::date($session['date'])) ?></td>
                    <td><?= e($session['startTime']) ?> às <?= e($session['endTime']) ?></td>
                    <td><?= e($session['team']['name']) ?></td>
                    <td><?= e(Labels::of(Labels::SESSIONS, $session['type'])) ?></td>
                    <td><?= e($session['facility']['name']) ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <p><a href="/treinos">Ver a agenda completa</a></p>
<?php endif; ?>

<h2>Centros de treinamento</h2>
<div class="grid">
    <?php foreach ($trainingCenters as $center): ?>
        <a class="card card-link" href="/cts/<?= (int) $center['id'] ?>">
            <h3><?= e($center['name']) ?></h3>
            <p class="muted"><?= e($center['city']) ?></p>
            <dl class="facts">
                <div><dt>Espaços</dt><dd><?= (int) $center['facilitiesCount'] ?></dd></div>
                <div><dt>Times</dt><dd><?= (int) $center['teamsCount'] ?></dd></div>
                <?php if ($center['openedYear']): ?><div><dt>Inauguração</dt><dd><?= (int) $center['openedYear'] ?></dd></div><?php endif; ?>
            </dl>
        </a>
    <?php endforeach; ?>
</div>
