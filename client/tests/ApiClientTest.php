<?php

declare(strict_types=1);

namespace InterCT\Client\Tests;

use InterCT\Client\Http\ApiClient;
use InterCT\Client\Http\ApiException;
use PHPUnit\Framework\TestCase;

final class ApiClientTest extends TestCase
{
    /** @var list<array{string, string, list<string>, ?string}> */
    private array $calls = [];

    /**
     * Cria um cliente cujo transporte devolve a resposta informada e registra as chamadas.
     *
     * @param array<string, string> $headers
     */
    private function client(int $status, mixed $body, array $headers = [], ?string $key = 'chave'): ApiClient
    {
        return new ApiClient('http://api.local', $key, function (string $method, string $url, array $sent, ?string $payload) use ($status, $body, $headers) {
            $this->calls[] = [$method, $url, $sent, $payload];
            return [$status, $body === null ? '' : json_encode($body), $headers];
        });
    }

    public function testGetMontaUrlComFiltrosEIgnoraValoresVazios(): void
    {
        $response = $this->client(200, [['id' => 1]], ['x-total-count' => '25'])
            ->get('/jogadores', ['timeId' => 2, 'posicao' => '', 'situacao' => null, 'limite' => 10]);

        self::assertSame('GET', $this->calls[0][0]);
        self::assertSame('http://api.local/api/v1/jogadores?timeId=2&limite=10', $this->calls[0][1]);
        self::assertSame(25, $response->total());
        self::assertSame([['id' => 1]], $response->data);
    }

    public function testConsultaEnviaAChaveQuandoConfigurada(): void
    {
        $this->client(200, [])->get('/cts');

        self::assertContains('X-API-Key: chave', $this->calls[0][2]);
    }

    public function testConsultaFuncionaSemChaveConfigurada(): void
    {
        $this->client(200, [], [], null)->get('/cts');

        self::assertSame(['Accept: application/json'], $this->calls[0][2]);
    }

    public function testEscritaEnviaChaveECorpoJson(): void
    {
        $this->client(201, ['id' => 9])->post('/uniformes', ['type' => 'TREINO', 'colors' => 'Vermelho e cinza']);

        [$method, , $headers, $payload] = $this->calls[0];
        self::assertSame('POST', $method);
        self::assertContains('X-API-Key: chave', $headers);
        self::assertContains('Content-Type: application/json', $headers);
        self::assertSame('{"type":"TREINO","colors":"Vermelho e cinza"}', $payload);
    }

    public function testEscritaSemChaveConfiguradaFalhaSemChamarAApi(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionCode(401);

        try {
            $this->client(204, null, [], null)->delete('/jogadores/1');
        } finally {
            self::assertSame([], $this->calls);
        }
    }

    public function testErroDeValidacaoViraExcecaoComMensagensPorCampo(): void
    {
        $problem = [
            'title' => 'Dados inválidos',
            'status' => 400,
            'detail' => 'A requisição possui 2 erro(s) de validação.',
            'errors' => [
                ['field' => 'number', 'message' => 'O número deve estar entre 1 e 99.'],
                ['field' => 'name', 'message' => 'Campo obrigatório.'],
            ],
        ];

        try {
            $this->client(400, $problem)->post('/jogadores', []);
            self::fail('Exceção esperada.');
        } catch (ApiException $error) {
            self::assertSame(400, $error->status);
            self::assertSame('Dados inválidos', $error->title);
            self::assertSame(['number' => 'O número deve estar entre 1 e 99.', 'name' => 'Campo obrigatório.'], $error->fieldErrors);
        }
    }

    public function testConflitoPreservaODetalheDaApi(): void
    {
        try {
            $this->client(409, ['title' => 'Conflito', 'detail' => 'O número 10 já é usado por Carol Vieira neste time.'])
                ->put('/jogadores/41', []);
            self::fail('Exceção esperada.');
        } catch (ApiException $error) {
            self::assertSame(409, $error->status);
            self::assertSame('O número 10 já é usado por Carol Vieira neste time.', $error->getMessage());
        }
    }

    public function testRespostaSemCorpoFicaNula(): void
    {
        $response = $this->client(204, null)->delete('/treinos/3');

        self::assertSame(204, $response->status);
        self::assertNull($response->data);
    }
}
