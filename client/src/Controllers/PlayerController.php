<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use InterCT\Client\Http\ApiException;
use InterCT\Client\Support\Flash;

/**
 * Perfil e cadastro de jogadores.
 */
final class PlayerController extends Controller
{
    public function show(int $id): string
    {
        return $this->render('jogadores/show', ['player' => $this->api->get("/jogadores/{$id}")->data]);
    }

    public function create(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $teamId = (int) $this->query('timeId');
        return $this->form(['teamId' => $teamId > 0 ? $teamId : null, 'status' => 'DISPONIVEL']);
    }

    public function store(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $player = $this->api->post('/jogadores', $payload)->data;
        } catch (ApiException $error) {
            return $this->formError($error, 'jogadores/form', $this->formData($payload));
        }
        Flash::add('success', "{$player['shirtName']} foi cadastrado(a) no elenco.");
        return $this->redirect("/jogadores/{$player['id']}");
    }

    public function edit(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        return $this->form($this->api->get("/jogadores/{$id}")->data, $id);
    }

    public function update(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $this->api->put("/jogadores/{$id}", $payload);
        } catch (ApiException $error) {
            return $this->formError($error, 'jogadores/form', $this->formData($payload, $id));
        }
        Flash::add('success', 'Dados do jogador atualizados.');
        return $this->redirect("/jogadores/{$id}");
    }

    public function destroy(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $player = $this->api->get("/jogadores/{$id}")->data;
        $this->api->delete("/jogadores/{$id}");
        Flash::add('success', "{$player['shirtName']} foi removido(a) do elenco.");
        return $this->redirect("/times/{$player['teamId']}");
    }

    /** @param array<string, mixed> $player */
    private function form(array $player, ?int $id = null): string
    {
        return $this->render('jogadores/form', $this->formData($player, $id));
    }

    /**
     * @param array<string, mixed> $player
     * @return array<string, mixed>
     */
    private function formData(array $player, ?int $id = null): array
    {
        return ['player' => $player, 'id' => $id, 'teams' => $this->list('/times'), 'errors' => []];
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'name' => $this->text('name'),
            'shirtName' => $this->text('shirtName'),
            'number' => $this->number('number'),
            'position' => $this->text('position'),
            'preferredFoot' => $this->text('preferredFoot'),
            'birthDate' => $this->text('birthDate'),
            'status' => $this->text('status') ?: 'DISPONIVEL',
            'teamId' => $this->number('teamId'),
        ];
    }
}
