<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Format;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $coach */
/** @var list<array<string, mixed>> $staff */
/** @var \InterCT\Client\Security\Auth $auth */
$title = $coach['name'];
?>
<p class="breadcrumb"><a href="/">Painel</a><?php if ($coach['team']): ?> / <a href="/times/<?= (int) $coach['team']['id'] ?>"><?= e($coach['team']['name']) ?></a><?php endif; ?> / Técnico</p>
<div class="page-head">
    <div>
        <h1><?= e($coach['name']) ?></h1>
        <p class="lead">Técnico(a) <?= $coach['team'] ? 'do ' . e($coach['team']['name']) : 'sem time vinculado' ?></p>
    </div>
    <?php if ($auth->check()): ?>
        <a class="button" href="/comissao/novo?tecnicoId=<?= (int) $coach['id'] ?>">Incluir na comissão</a>
    <?php endif; ?>
</div>
<section class="card">
    <dl class="facts facts-grid">
        <div><dt>Nacionalidade</dt><dd><?= e($coach['nationality']) ?></dd></div>
        <div><dt>Licença</dt><dd><?= e($coach['license'] ?? 'Não informada') ?></dd></div>
        <div><dt>Início do contrato</dt><dd><?= e(Format::date($coach['contractStart'])) ?></dd></div>
        <div><dt>Comissão técnica</dt><dd><?= (int) $coach['staffCount'] ?> profissionais</dd></div>
    </dl>
</section>

<h2>Comissão técnica</h2>
<div class="table-wrap">
    <table>
        <thead><tr><th>Nome</th><th>Cargo</th><?php if ($auth->check()): ?><th class="actions-col">Ações</th><?php endif; ?></tr></thead>
        <tbody>
        <?php foreach ($staff as $member): ?>
            <tr>
                <td><?= e($member['name']) ?></td>
                <td><?= e(Labels::of(Labels::ROLES, $member['role'])) ?></td>
                <?php if ($auth->check()): ?>
                    <td class="actions-col">
                        <a href="/comissao/<?= (int) $member['id'] ?>/editar">Editar</a>
                        <form method="post" action="/comissao/<?= (int) $member['id'] ?>/excluir" class="inline confirm" data-confirm="Remover <?= e($member['name']) ?> da comissão?">
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
