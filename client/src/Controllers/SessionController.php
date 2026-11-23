<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use DateTimeImmutable;
use InterCT\Client\Http\ApiException;
use InterCT\Client\Support\Flash;

/**
 * Agenda de treinos.
 */
final class SessionController extends Controller
{
    public function index(): string
    {
        $monday = new DateTimeImmutable('monday this week');
        $filters = [
            'timeId' => $this->query('timeId'),
            'de' => $this->query('de') ?: $monday->format('Y-m-d'),
            'ate' => $this->query('ate') ?: $monday->modify('+6 days')->format('Y-m-d'),
        ];
        $sessions = $this->listAll('/treinos', $filters);

        $days = [];
        foreach ($sessions as $session) {
            $days[$session['date']][] = $session;
        }

        return $this->render('treinos/index', [
            'filters' => $filters,
            'teams' => $this->list('/times'),
            'days' => $days,
        ]);
    }

    public function create(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $teamId = (int) $this->query('timeId');
        return $this->render('treinos/form', $this->formData([
            'teamId' => $teamId > 0 ? $teamId : null,
            'date' => (new DateTimeImmutable('tomorrow'))->format('Y-m-d'),
        ]));
    }

    public function store(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $session = $this->api->post('/treinos', $payload)->data;
        } catch (ApiException $error) {
            return $this->formError($error, 'treinos/form', $this->formData($payload));
        }
        Flash::add('success', 'Treino agendado.');
        return $this->redirect($this->weekOf($session));
    }

    public function edit(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        return $this->render('treinos/form', $this->formData($this->api->get("/treinos/{$id}")->data, $id));
    }

    public function update(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $session = $this->api->put("/treinos/{$id}", $payload)->data;
        } catch (ApiException $error) {
            return $this->formError($error, 'treinos/form', $this->formData($payload, $id));
        }
        Flash::add('success', 'Treino atualizado.');
        return $this->redirect($this->weekOf($session));
    }

    public function destroy(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $session = $this->api->get("/treinos/{$id}")->data;
        $this->api->delete("/treinos/{$id}");
        Flash::add('success', 'Treino cancelado.');
        return $this->redirect($this->weekOf($session));
    }

    /**
     * Endereço da agenda na semana do treino.
     *
     * @param array<string, mixed> $session
     */
    private function weekOf(array $session): string
    {
        $date = new DateTimeImmutable($session['date']);
        $monday = $date->modify('monday this week');
        return '/treinos?' . http_build_query([
            'timeId' => $session['teamId'],
            'de' => $monday->format('Y-m-d'),
            'ate' => $monday->modify('+6 days')->format('Y-m-d'),
        ]);
    }

    /**
     * @param array<string, mixed> $session
     * @return array<string, mixed>
     */
    private function formData(array $session, ?int $id = null): array
    {
        return [
            'session' => $session,
            'id' => $id,
            'teams' => $this->list('/times'),
            'facilities' => $this->listAll('/espacos'),
            'kits' => $this->listAll('/uniformes'),
            'errors' => [],
        ];
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'date' => $this->text('date'),
            'startTime' => $this->text('startTime'),
            'endTime' => $this->text('endTime'),
            'type' => $this->text('type'),
            'notes' => $this->optionalText('notes'),
            'teamId' => $this->number('teamId'),
            'facilityId' => $this->number('facilityId'),
            'kitId' => $this->number('kitId'),
        ];
    }
}
