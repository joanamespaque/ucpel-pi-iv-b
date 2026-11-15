<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Labels;

/** @var array<string, string> $filters */
/** @var list<array<string, mixed>> $teams */
/** @var list<array<string, mixed>> $kits */
/** @var \InterCT\Client\Security\Auth $auth */
$title = 'Uniformes';
?>
<div class="page-head">
    <div>
        <h1>Uniformes</h1>
        <p class="lead">Uniformes de jogo, treino e viagem de cada time por temporada.</p>
    </div>
    <?php if ($auth->check()): ?>
        <a class="button" href="/uniformes/novo<?= $filters['timeId'] !== '' ? '?timeId=' . (int) $filters['timeId'] : '' ?>">Cadastrar uniforme</a>
    <?php endif; ?>
</div>
<form method="get" class="filters">
    <label>Time <select name="timeId"><?= options(array_column($teams, 'name', 'id'), $filters['timeId'], 'Todos') ?></select></label>
    <label>Temporada <input name="temporada" type="number" min="1909" max="2100" value="<?= e($filters['temporada']) ?>"></label>
    <button type="submit" class="button secondary">Filtrar</button>
</form>
<?php if (!$kits): ?>
    <p class="muted">Nenhum uniforme encontrado.</p>
<?php else: ?>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Time</th><th>Temporada</th><th>Tipo</th><th>Cores</th><th>Fornecedor</th><?php if ($auth->check()): ?><th class="actions-col">Ações</th><?php endif; ?></tr></thead>
            <tbody>
            <?php foreach ($kits as $kit): ?>
                <tr>
                    <td><?= e($kit['team']['name']) ?></td>
                    <td><?= (int) $kit['season'] ?></td>
                    <td><?= e(Labels::of(Labels::KITS, $kit['type'])) ?></td>
                    <td><?= e($kit['colors']) ?></td>
                    <td><?= e($kit['supplier']) ?></td>
                    <?php if ($auth->check()): ?>
                        <td class="actions-col">
                            <a href="/uniformes/<?= (int) $kit['id'] ?>/editar">Editar</a>
                            <form method="post" action="/uniformes/<?= (int) $kit['id'] ?>/excluir" class="inline confirm" data-confirm="Remover este uniforme?">
                                <?= Csrf::field() ?>
                                <button type="submit" class="link danger">Remover</button>
                            </form>
                        </td>
                    <?php endif; ?>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php endif; ?>
