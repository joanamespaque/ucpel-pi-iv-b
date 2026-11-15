<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $player */
/** @var int|null $id */
/** @var list<array<string, mixed>> $teams */
/** @var array<string, string> $errors */
$title = $id ? 'Editar atleta' : 'Cadastrar atleta';
$teamOptions = array_column($teams, 'name', 'id');
?>
<p class="breadcrumb"><a href="/">Painel</a> / <?= e($title) ?></p>
<h1><?= e($title) ?></h1>
<?php if (!empty($formError)): ?><div class="alert alert-error" role="alert"><?= e($formError) ?></div><?php endif; ?>
<form method="post" action="<?= $id ? '/jogadores/' . (int) $id : '/jogadores' ?>" class="card form" novalidate>
    <?= Csrf::field() ?>
    <label>Nome completo
        <input name="name" value="<?= e($player['name'] ?? '') ?>" required minlength="3" maxlength="120">
        <?= field_error($errors, 'name') ?>
    </label>
    <div class="row">
        <label>Nome na camisa
            <input name="shirtName" value="<?= e($player['shirtName'] ?? '') ?>" required minlength="2" maxlength="40">
            <?= field_error($errors, 'shirtName') ?>
        </label>
        <label>Número
            <input name="number" type="number" min="1" max="99" value="<?= e($player['number'] ?? '') ?>" required>
            <?= field_error($errors, 'number') ?>
        </label>
    </div>
    <div class="row">
        <label>Posição
            <select name="position" required><?= options(Labels::POSITIONS, $player['position'] ?? null, 'Selecione') ?></select>
            <?= field_error($errors, 'position') ?>
        </label>
        <label>Pé preferido
            <select name="preferredFoot" required><?= options(Labels::FEET, $player['preferredFoot'] ?? null, 'Selecione') ?></select>
            <?= field_error($errors, 'preferredFoot') ?>
        </label>
    </div>
    <div class="row">
        <label>Data de nascimento
            <input name="birthDate" type="date" value="<?= e($player['birthDate'] ?? '') ?>" required>
            <?= field_error($errors, 'birthDate') ?>
        </label>
        <label>Situação
            <select name="status"><?= options(Labels::STATUSES, $player['status'] ?? 'DISPONIVEL') ?></select>
            <?= field_error($errors, 'status') ?>
        </label>
    </div>
    <label>Time
        <select name="teamId" required><?= options($teamOptions, $player['teamId'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'teamId') ?>
    </label>
    <div class="actions">
        <button type="submit" class="button">Salvar</button>
        <a class="button secondary" href="<?= $id ? '/jogadores/' . (int) $id : '/' ?>">Cancelar</a>
    </div>
</form>
