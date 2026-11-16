<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use DateTimeImmutable;

/**
 * Página do time: elenco, técnico, uniformes e próximos treinos.
 */
final class TeamController extends Controller
{
    public function show(int $id): string
    {
        $team = $this->api->get("/times/{$id}")->data;
        $filters = ['posicao' => $this->query('posicao'), 'situacao' => $this->query('situacao')];
        $today = new DateTimeImmutable('today');

        return $this->render('times/show', [
            'team' => $team,
            'filters' => $filters,
            'players' => $this->list("/times/{$id}/jogadores", $filters + ['limite' => 100]),
            'kits' => $this->list("/times/{$id}/uniformes", ['limite' => 100]),
            'sessions' => $this->list("/times/{$id}/treinos", ['de' => $today->format('Y-m-d'), 'limite' => 5]),
        ]);
    }
}
