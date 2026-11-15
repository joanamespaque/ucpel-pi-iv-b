<?php

use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $center */
$title = $center['name'];
?>
<p class="breadcrumb"><a href="/">Painel</a> / CT</p>
<h1><?= e($center['name']) ?></h1>
<p class="lead"><?= e($center['address']) ?></p>
<dl class="facts facts-inline">
    <div><dt>Cidade</dt><dd><?= e($center['city']) ?></dd></div>
    <?php if ($center['areaHa'] !== null): ?><div><dt>Área</dt><dd><?= e(number_format((float) $center['areaHa'], 1, ',', '.')) ?> ha</dd></div><?php endif; ?>
    <?php if ($center['openedYear'] !== null): ?><div><dt>Inauguração</dt><dd><?= (int) $center['openedYear'] ?></dd></div><?php endif; ?>
</dl>

<h2>Times sediados</h2>
<ul class="list">
    <?php foreach ($center['teams'] as $team): ?>
        <li><a href="/times/<?= (int) $team['id'] ?>"><?= e($team['name']) ?></a> <span class="muted"><?= e($team['nickname']) ?></span></li>
    <?php endforeach; ?>
</ul>

<h2>Espaços</h2>
<div class="table-wrap">
    <table>
        <thead><tr><th>Nome</th><th>Tipo</th><th>Capacidade</th></tr></thead>
        <tbody>
        <?php foreach ($center['facilities'] as $facility): ?>
            <tr>
                <td><?= e($facility['name']) ?></td>
                <td><?= e(Labels::of(Labels::FACILITIES, $facility['type'])) ?></td>
                <td><?= $facility['capacity'] !== null ? (int) $facility['capacity'] . ' pessoas' : '–' ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>
