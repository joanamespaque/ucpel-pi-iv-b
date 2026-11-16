# InterCT

API REST e cliente web para organizar o centro de treinamento (CT) do Sport Club Internacional. O projeto foi desenvolvido no Projeto Integrador IV-B da Universidade Católica de Pelotas (UCPel).

O sistema reúne:

- os centros de treinamento e seus espaços;
- os times principais masculino e feminino, com os elencos;
- os técnicos e suas comissões técnicas;
- os uniformes de cada temporada;
- a agenda de treinos.

> **Dados ilustrativos:** a estrutura dos CTs (endereços, espaços, cargos, competições e uniformes) segue informações públicas do clube. Os nomes de jogadores e profissionais são fictícios.

## Links

| Recurso | Endereço |
| --- | --- |
| Documentação da API (GitHub Pages) | https://joanamespaque.github.io/ucpel-pi-iv-b/ |
| API publicada (Render) | https://interct-api.onrender.com |
| Swagger UI servido pela API | https://interct-api.onrender.com/docs |

A API usa o plano gratuito do Render, que suspende o serviço depois de um período sem acesso. Depois disso, a primeira requisição pode levar cerca de 1 minuto.

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| API | Node.js 22, Express 5, Prisma ORM, Zod, Helmet, express-rate-limit |
| Banco de dados | PostgreSQL 16 |
| Cliente web | PHP 8.3 (MVC sem framework), cURL, HTML e CSS |
| Documentação | OpenAPI 3.1 e Swagger UI |
| Testes | Vitest e Supertest (API), PHPUnit (cliente) |
| Integração contínua | GitHub Actions |

## Arquitetura

```
Navegador -> Cliente PHP (controllers e views) -> cURL + JSON -> API REST -> Prisma -> PostgreSQL
```

A API é organizada em camadas. Cada camada tem uma responsabilidade:

```
Requisição HTTP
  -> routes       (rotas e validação da entrada)
  -> controller   (tradução entre HTTP e serviço)
  -> service      (regras de negócio)
  -> repository   (acesso a dados via Prisma)
  -> PostgreSQL
```

```
api/
  openapi/openapi.yaml   especificação OpenAPI
  prisma/                esquema, migrações e carga inicial
  src/
    app.js               montagem da aplicação Express
    routes.js            rotas da versão 1 (/api/v1)
    lib/                 erros HTTP, serialização e esquemas comuns
    middlewares/         validação, autenticação, limite de requisições e erros
    modules/             um diretório por recurso (routes, controller, service, repository)
  tests/                 testes automatizados
client/
  public/                ponto de entrada (index.php) e arquivos estáticos
  src/                   cliente HTTP, roteador, controllers e segurança
  views/                 templates PHP
  tests/                 testes PHPUnit
docs/                    página da documentação publicada no GitHub Pages
```

## Endpoints

Todos os recursos ficam em `/api/v1`. Cada recurso aceita GET (lista e detalhe), POST, PUT e DELETE.

| Recurso | Rotas | Filtros da listagem |
| --- | --- | --- |
| Centros de treinamento | `/cts`, `/cts/{id}`, `/cts/{id}/espacos` | `tipo` (espaços do CT) |
| Espaços | `/espacos`, `/espacos/{id}` | `ctId`, `tipo` |
| Times | `/times`, `/times/{id}`, `/times/{id}/jogadores`, `/times/{id}/uniformes`, `/times/{id}/treinos` | conforme a sub-rota |
| Jogadores | `/jogadores`, `/jogadores/{id}` | `timeId`, `posicao`, `situacao` |
| Técnicos | `/tecnicos`, `/tecnicos/{id}`, `/tecnicos/{id}/comissao` | `cargo` (comissão do técnico) |
| Comissão técnica | `/comissao`, `/comissao/{id}` | `tecnicoId`, `cargo` |
| Uniformes | `/uniformes`, `/uniformes/{id}` | `timeId`, `tipo`, `temporada` |
| Treinos | `/treinos`, `/treinos/{id}` | `timeId`, `espacoId`, `data`, `de`, `ate` |
| Estado da API | `/health` (fora de `/api/v1`) | |

A documentação completa, com corpos, exemplos e respostas de erro, está no [Swagger UI](https://joanamespaque.github.io/ucpel-pi-iv-b/).

### Regras de negócio

- Um time só pode ser removido sem jogadores, e um CT só pode ser removido sem times.
- O número da camisa é único em cada time.
- Cada time tem no máximo um técnico.
- Cada time tem um uniforme de cada tipo por temporada.
- Um treino precisa usar um espaço do CT do time e, quando houver, um uniforme do próprio time.
- Dois treinos não podem ocupar o mesmo espaço em horários sobrepostos.

### Paginação, autenticação e limites

- As listagens de jogadores, espaços, comissão técnica, uniformes e treinos aceitam `pagina` (padrão 1) e `limite` (padrão 50, máximo 100). O total de registros vem no cabeçalho `X-Total-Count`.
- As consultas (GET) são públicas.
- As operações que alteram dados (POST, PUT e DELETE) exigem uma chave no cabeçalho `X-API-Key`. A chave é configurada na variável de ambiente `API_KEY`.
- Cada IP pode fazer até 300 requisições a cada 15 minutos. Dessas, até 30 podem ser de escrita. Requisições com chave válida, como as do cliente web, não entram na contagem.

```bash
curl https://interct-api.onrender.com/api/v1/times/2/treinos?de=2026-11-16
curl -X DELETE https://interct-api.onrender.com/api/v1/jogadores/51 -H "X-API-Key: <chave>"
```

Erros seguem o formato Problem Details (RFC 9457):

```json
{
  "type": "about:blank",
  "title": "Conflito com o estado atual do recurso",
  "status": 409,
  "detail": "O número 10 já é usado por Carol Vieira neste time.",
  "instance": "/api/v1/jogadores"
}
```

## Cliente web

O cliente em PHP consome a API pelo servidor com cURL. Ele tem as seguintes telas:

- painel com os times, os próximos treinos e os CTs;
- página do CT, com os espaços;
- página do time, com o elenco filtrável, o técnico, os uniformes e os próximos treinos;
- perfil do atleta;
- comissão técnica;
- uniformes;
- agenda semanal de treinos.

As telas de consulta são abertas. Os cadastros, as alterações e as remoções exigem login com a senha de administração.

A chave da API fica só no servidor do cliente e nunca é enviada ao navegador. O cliente também usa:

- limite de tentativas de login por sessão e por IP, com espera de meio segundo a cada senha errada;

- token CSRF em todos os formulários;
- cookies de sessão HttpOnly e SameSite;
- Content Security Policy e HSTS;
- escape de toda saída com `htmlspecialchars`.

| Variável | Descrição |
| --- | --- |
| `API_BASE_URL` | Endereço da API, sem `/api/v1` |
| `API_KEY` | A mesma chave configurada na API |
| `ADMIN_PASSWORD` ou `ADMIN_PASSWORD_HASH` | Senha de administração, em texto ou como hash de `password_hash`. Em produção, a senha em texto precisa ter ao menos 16 caracteres. Sem ela, os cadastros ficam desativados. |
| `APP_ENV` | `production` (padrão) ou `development` |

## Execução local

### Com Docker

```bash
docker compose up --build
```

| Serviço | Endereço |
| --- | --- |
| Cliente web | http://localhost:8080 (senha local: `admin-local`) |
| API | http://localhost:3000 |
| Documentação | http://localhost:3000/docs |

### Sem Docker

Requisitos: Node.js 22, PostgreSQL 16, PHP 8.3 com cURL e Composer.

```bash
cd api
cp .env.example .env        # ajuste DATABASE_URL e API_KEY
npm install
npx prisma migrate deploy   # cria as tabelas
npm run db:seed             # carrega os dados iniciais
npm run dev
```

```bash
cd client
cp .env.example .env        # ajuste API_BASE_URL, API_KEY e a senha
composer install
composer serve              # http://localhost:8080
```

### Testes

Os testes da API usam o banco definido em `api/.env.test` e recriam os dados iniciais antes da execução. A recriação só é aceita em bancos cujo nome termina em `_test`.

```bash
cd api && npm test
cd client && composer test
```

O GitHub Actions executa as seguintes verificações a cada push e pull request:

- lint e formatação da API;
- testes da API, com um PostgreSQL temporário;
- validação da especificação OpenAPI;
- testes do cliente;
- build das duas imagens Docker.

## Publicação

**Banco de dados:** PostgreSQL gerenciado no Neon.

**API:** Web Service Node no Render, com esta configuração:

- diretório raiz: `api`;
- comando de build: `npm run render:build`;
- comando de início: `npm start`;
- variáveis: `DATABASE_URL`, `API_KEY`, `CORS_ORIGINS` e `NODE_ENV=production`.

**Cliente web (opcional):** Web Service Docker no Render, com diretório raiz `client` e as variáveis da seção [Cliente web](#cliente-web).

**Documentação:** GitHub Pages a partir da pasta `docs/` da branch `main`. O comando `npm run docs:build` copia a especificação para essa pasta.

## Versionamento

O histórico segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). O desenvolvimento acontece na branch `develop`, e cada versão publicada entra na `main` por pull request.

| Versão | Conteúdo |
| --- | --- |
| v0.1.0 | API com CTs, times e jogadores, documentação publicada |
| v1.0.0 | Espaços, técnicos, comissão técnica, uniformes, treinos, paginação, cliente web em PHP e integração contínua |

## Licença

[MIT](LICENSE)
