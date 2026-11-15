<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use DateTimeImmutable;

/**
 * Painel inicial com os CTs, os times e os próximos treinos.
 */
final class HomeController extends Controller
{
    public function index(): string
    {
        $today = new DateTimeImmutable('today');

        return $this->render('home', [
            'trainingCenters' => $this->list('/cts'),
            'teams' => $this->list('/times'),
            'sessions' => $this->list('/treinos', [
                'de' => $today->format('Y-m-d'),
                'ate' => $today->modify('+7 days')->format('Y-m-d'),
                'limite' => 8,
            ]),
        ]);
    }

    public function showTrainingCenter(int $id): string
    {
        return $this->render('cts/show', [
            'center' => $this->api->get("/cts/{$id}")->data,
        ]);
    }
}
