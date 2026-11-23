<?php

declare(strict_types=1);

namespace InterCT\Client\Controllers;

use InterCT\Client\Http\ApiException;
use InterCT\Client\Support\Flash;

/**
 * Técnico e comissão técnica.
 */
final class CoachController extends Controller
{
    public function show(int $id): string
    {
        return $this->render('tecnicos/show', [
            'coach' => $this->api->get("/tecnicos/{$id}")->data,
            'staff' => $this->listAll("/tecnicos/{$id}/comissao"),
        ]);
    }

    public function createStaff(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $coachId = (int) $this->query('tecnicoId');
        return $this->render('comissao/form', $this->formData(['coachId' => $coachId > 0 ? $coachId : null]));
    }

    public function storeStaff(): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $member = $this->api->post('/comissao', $payload)->data;
        } catch (ApiException $error) {
            return $this->formError($error, 'comissao/form', $this->formData($payload));
        }
        Flash::add('success', "{$member['name']} foi incluído(a) na comissão técnica.");
        return $this->redirect("/tecnicos/{$member['coachId']}");
    }

    public function editStaff(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        return $this->render('comissao/form', $this->formData($this->api->get("/comissao/{$id}")->data, $id));
    }

    public function updateStaff(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $payload = $this->payload();
        try {
            $member = $this->api->put("/comissao/{$id}", $payload)->data;
        } catch (ApiException $error) {
            return $this->formError($error, 'comissao/form', $this->formData($payload, $id));
        }
        Flash::add('success', 'Dados do membro da comissão atualizados.');
        return $this->redirect("/tecnicos/{$member['coachId']}");
    }

    public function destroyStaff(int $id): string
    {
        if (($blocked = $this->guardWrite()) !== null) {
            return $blocked;
        }
        $member = $this->api->get("/comissao/{$id}")->data;
        $this->api->delete("/comissao/{$id}");
        Flash::add('success', "{$member['name']} foi removido(a) da comissão técnica.");
        return $this->redirect("/tecnicos/{$member['coachId']}");
    }

    /**
     * @param array<string, mixed> $member
     * @return array<string, mixed>
     */
    private function formData(array $member, ?int $id = null): array
    {
        return ['member' => $member, 'id' => $id, 'coaches' => $this->list('/tecnicos'), 'errors' => []];
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'name' => $this->text('name'),
            'role' => $this->text('role'),
            'coachId' => $this->number('coachId'),
        ];
    }
}
