<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $kit */
/** @var int|null $id */
/** @var list<array<string, mixed>> $teams */
/** @var array<string, string> $errors */
$title = $id ? 'Editar uniforme' : 'Cadastrar uniforme';
?>
<p class="breadcrumb"><a href="/uniformes">Uniformes</a> / <?= e($title) ?></p>
<h1><?= e($title) ?></h1>
<?php if (!empty($formError)): ?><div class="alert alert-error" role="alert"><?= e($formError) ?></div><?php endif; ?>
<form method="post" action="<?= $id ? '/uniformes/' . (int) $id : '/uniformes' ?>" class="card form" novalidate>
    <?= Csrf::field() ?>
    <div class="row">
        <label>Time
            <select name="teamId" required><?= options(array_column($teams, 'name', 'id'), $kit['teamId'] ?? null, 'Selecione') ?></select>
            <?= field_error($errors, 'teamId') ?>
        </label>
        <label>Temporada
            <input name="season" type="number" min="1909" max="2100" value="<?= e($kit['season'] ?? '') ?>" required>
            <?= field_error($errors, 'season') ?>
        </label>
    </div>
    <label>Tipo
        <select name="type" required><?= options(Labels::KITS, $kit['type'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'type') ?>
    </label>
    <label>Cores
        <input name="colors" value="<?= e($kit['colors'] ?? '') ?>" required minlength="3" maxlength="120">
        <?= field_error($errors, 'colors') ?>
    </label>
    <label>Fornecedor
        <input name="supplier" value="<?= e($kit['supplier'] ?? '') ?>" required minlength="2" maxlength="60">
        <?= field_error($errors, 'supplier') ?>
    </label>
    <div class="actions">
        <button type="submit" class="button">Salvar</button>
        <a class="button secondary" href="/uniformes">Cancelar</a>
    </div>
</form>
