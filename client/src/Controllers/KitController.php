<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use InterCT\Client\Http\ApiException;
use InterCT\Client\Support\Flash;

/**
 * Uniformes por time e temporada.
 */
final class KitController extends Controller
{
    public function index(): string
    {
        $filters = ['timeId' => $this->query('timeId'), 'temporada' => $this->query('temporada')];
        return $this->render('uniformes/index', [
            'filters' => $filters,
            'teams' => $this->list('/times'),
            'kits' => $this->listAll('/uniformes', $filters),
        ]);
    }

    public function create(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $teamId = (int) $this->query('timeId');
        return $this->render('uniformes/form', $this->formData([
            'teamId' => $teamId > 0 ? $teamId : null,
            'season' => (int) date('Y'),
        ]));
    }

    public function store(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $this->api->post('/uniformes', $payload);
        } catch (ApiException $error) {
            return $this->formError($error, 'uniformes/form', $this->formData($payload));
        }
        Flash::add('success', 'Uniforme cadastrado.');
        return $this->redirect('/uniformes?timeId=' . (int) $payload['teamId']);
    }

    public function edit(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        return $this->render('uniformes/form', $this->formData($this->api->get("/uniformes/{$id}")->data, $id));
    }

    public function update(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $this->api->put("/uniformes/{$id}", $payload);
        } catch (ApiException $error) {
            return $this->formError($error, 'uniformes/form', $this->formData($payload, $id));
        }
        Flash::add('success', 'Uniforme atualizado.');
        return $this->redirect('/uniformes?timeId=' . (int) $payload['teamId']);
    }

    public function destroy(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $kit = $this->api->get("/uniformes/{$id}")->data;
        $this->api->delete("/uniformes/{$id}");
        Flash::add('success', 'Uniforme removido. Os treinos que o usavam ficaram sem uniforme definido.');
        return $this->redirect('/uniformes?timeId=' . (int) $kit['teamId']);
    }

    /**
     * @param array<string, mixed> $kit
     * @return array<string, mixed>
     */
    private function formData(array $kit, ?int $id = null): array
    {
        return ['kit' => $kit, 'id' => $id, 'teams' => $this->list('/times'), 'errors' => []];
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'type' => $this->text('type'),
            'season' => $this->number('season'),
            'colors' => $this->text('colors'),
            'supplier' => $this->text('supplier'),
            'teamId' => $this->number('teamId'),
        ];
    }
}
