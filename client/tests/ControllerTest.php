<?php

declare(strict_types=1);

namespace InterCT\Client\Tests;

use InterCT\Client\Controllers\Controller;
use InterCT\Client\Http\ApiClient;
use InterCT\Client\Security\Auth;
use InterCT\Client\View;
use PHPUnit\Framework\TestCase;

final class ControllerTest extends TestCase
{
    /** @var list<string> */
    private array $urls = [];

    /**
     * Cria um controlador cujo cliente HTTP simula uma listagem paginada com o total informado.
     */
    private function controller(int $total): Controller
    {
        $api = new ApiClient('http://api.local', null, function (string $method, string $url) use ($total) {
            $this->urls[] = $url;
            parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
            $page = (int) $query['pagina'];
            $limit = (int) $query['limite'];
            $count = max(0, min($limit, $total - ($page - 1) * $limit));
            $items = array_map(fn (int $i) => ['id' => ($page - 1) * $limit + $i + 1], range(0, $count - 1));
            return [200, json_encode($count > 0 ? $items : []), ['x-total-count' => (string) $total]];
        });

        return new class ($api, new View(__DIR__), new Auth(null)) extends Controller {
            /** @return list<array<string, mixed>> */
            public function all(string $path): array
            {
                return $this->listAll($path);
            }
        };
    }

    public function testListAllPercorreTodasAsPaginas(): void
    {
        $items = $this->controller(250)->all('/treinos');

        self::assertCount(250, $items);
        self::assertSame(250, $items[249]['id']);
        self::assertCount(3, $this->urls);
        self::assertStringContainsString('pagina=3&limite=100', $this->urls[2]);
    }

    public function testListAllFazUmaRequisicaoQuandoCabeEmUmaPagina(): void
    {
        self::assertCount(12, $this->controller(12)->all('/uniformes'));
        self::assertCount(1, $this->urls);
    }
}
