<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $member */
/** @var int|null $id */
/** @var list<array<string, mixed>> $coaches */
/** @var array<string, string> $errors */
$title = $id ? 'Editar membro da comissão' : 'Incluir na comissão técnica';
$coachOptions = [];
foreach ($coaches as $coach) {
    $coachOptions[$coach['id']] = $coach['name'] . ($coach['team'] ? ' (' . $coach['team']['name'] . ')' : '');
}
$back = !empty($member['coachId']) ? '/tecnicos/' . (int) $member['coachId'] : '/';
?>
<p class="breadcrumb"><a href="/">Painel</a> / <?= e($title) ?></p>
<h1><?= e($title) ?></h1>
<?php if (!empty($formError)): ?><div class="alert alert-error" role="alert"><?= e($formError) ?></div><?php endif; ?>
<form method="post" action="<?= $id ? '/comissao/' . (int) $id : '/comissao' ?>" class="card form" novalidate>
    <?= Csrf::field() ?>
    <label>Nome
        <input name="name" value="<?= e($member['name'] ?? '') ?>" required minlength="3" maxlength="120">
        <?= field_error($errors, 'name') ?>
    </label>
    <label>Cargo
        <select name="role" required><?= options(Labels::ROLES, $member['role'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'role') ?>
    </label>
    <label>Técnico(a) responsável
        <select name="coachId" required><?= options($coachOptions, $member['coachId'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'coachId') ?>
    </label>
    <div class="actions">
        <button type="submit" class="button">Salvar</button>
        <a class="button secondary" href="<?= e($back) ?>">Cancelar</a>
    </div>
</form>
