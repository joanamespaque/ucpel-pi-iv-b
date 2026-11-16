<?php

use InterCT\Client\Security\Csrf;
use InterCT\Client\Support\Labels;

/** @var array<string, mixed> $session */
/** @var int|null $id */
/** @var list<array<string, mixed>> $teams */
/** @var list<array<string, mixed>> $facilities */
/** @var list<array<string, mixed>> $kits */
/** @var array<string, string> $errors */
$title = $id ? 'Editar treino' : 'Agendar treino';
$facilityOptions = [];
foreach ($facilities as $facility) {
    $facilityOptions[$facility['id']] = $facility['trainingCenter']['name'] . ': ' . $facility['name'];
}
$kitOptions = [];
foreach ($kits as $kit) {
    $kitOptions[$kit['id']] = $kit['team']['name'] . ': ' . Labels::of(Labels::KITS, $kit['type']) . ' ' . $kit['season'];
}
?>
<p class="breadcrumb"><a href="/treinos">Treinos</a> / <?= e($title) ?></p>
<h1><?= e($title) ?></h1>
<?php if (!empty($formError)): ?><div class="alert alert-error" role="alert"><?= e($formError) ?></div><?php endif; ?>
<form method="post" action="<?= $id ? '/treinos/' . (int) $id : '/treinos' ?>" class="card form" novalidate>
    <?= Csrf::field() ?>
    <label>Time
        <select name="teamId" required><?= options(array_column($teams, 'name', 'id'), $session['teamId'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'teamId') ?>
    </label>
    <div class="row">
        <label>Data
            <input name="date" type="date" value="<?= e($session['date'] ?? '') ?>" required>
            <?= field_error($errors, 'date') ?>
        </label>
        <label>Início
            <input name="startTime" type="time" value="<?= e($session['startTime'] ?? '') ?>" required>
            <?= field_error($errors, 'startTime') ?>
        </label>
        <label>Término
            <input name="endTime" type="time" value="<?= e($session['endTime'] ?? '') ?>" required>
            <?= field_error($errors, 'endTime') ?>
        </label>
    </div>
    <label>Tipo de treino
        <select name="type" required><?= options(Labels::SESSIONS, $session['type'] ?? null, 'Selecione') ?></select>
        <?= field_error($errors, 'type') ?>
    </label>
    <label>Espaço
        <select name="facilityId" required><?= options($facilityOptions, $session['facilityId'] ?? null, 'Selecione') ?></select>
        <span class="hint">O espaço deve ficar no CT do time.</span>
        <?= field_error($errors, 'facilityId') ?>
    </label>
    <label>Uniforme (opcional)
        <select name="kitId"><?= options($kitOptions, $session['kitId'] ?? null, 'Sem uniforme definido') ?></select>
        <?= field_error($errors, 'kitId') ?>
    </label>
    <label>Observações
        <textarea name="notes" maxlength="500" rows="3"><?= e($session['notes'] ?? '') ?></textarea>
        <?= field_error($errors, 'notes') ?>
    </label>
    <div class="actions">
        <button type="submit" class="button">Salvar</button>
        <a class="button secondary" href="/treinos">Cancelar</a>
    </div>
</form>
