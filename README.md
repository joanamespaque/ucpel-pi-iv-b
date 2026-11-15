# InterCT API

API REST para a organização do centro de treinamento (CT) do Sport Club Internacional, desenvolvida no Projeto Integrador IV-B da Universidade Católica de Pelotas (UCPel).

A API reúne os centros de treinamento, seus espaços, os times principais masculino e feminino e os respectivos elencos.

> **Dados ilustrativos:** a estrutura dos CTs (endereços, espaços, cargos e competições) segue informações públicas do clube. Os nomes de jogadores e profissionais são fictícios.

## Links

| Recurso | Endereço |
| --- | --- |
| Documentação da API (GitHub Pages) | https://joanamespaque.github.io/ucpel-pi-iv-b/ |
| API publicada (Render) | https://interct-api.onrender.com |
| Swagger UI servido pela API | https://interct-api.onrender.com/docs |

A API usa o plano gratuito do Render, que suspende o serviço após um período sem acesso. A primeira requisição depois disso pode levar cerca de 1 minuto.

## Tecnologias

- Node.js 22 e Express 5
- PostgreSQL 16 com Prisma ORM
- Zod para validação de dados
- OpenAPI 3.1 e Swagger UI para documentação
- Vitest e Supertest para testes automatizados

## Arquitetura

A API é organizada em camadas, cada uma com uma responsabilidade:

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
    server.js            inicialização do servidor HTTP
    routes.js            rotas da versão 1 (/api/v1)
    lib/                 erros HTTP, serialização e esquemas comuns
    middlewares/         validação e tratamento de erros
    modules/             um diretório por recurso (routes, controller, service, repository)
  tests/                 testes automatizados
docs/                    página da documentação publicada no GitHub Pages
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Estado da API e do banco |
| GET | `/api/v1/cts` | Lista os centros de treinamento |
| GET | `/api/v1/cts/{id}` | Detalha um CT com espaços e times |
| GET | `/api/v1/times` | Lista os times |
| POST | `/api/v1/times` | Cadastra um time |
| GET | `/api/v1/times/{id}` | Detalha um time |
| PUT | `/api/v1/times/{id}` | Atualiza um time |
| DELETE | `/api/v1/times/{id}` | Remove um time sem elenco |
| GET | `/api/v1/times/{id}/jogadores` | Elenco do time (filtros `posicao` e `situacao`) |
| GET | `/api/v1/jogadores` | Lista jogadores (filtros `timeId`, `posicao` e `situacao`) |
| POST | `/api/v1/jogadores` | Cadastra um jogador |
| GET | `/api/v1/jogadores/{id}` | Detalha um jogador |
| PUT | `/api/v1/jogadores/{id}` | Atualiza um jogador |
| DELETE | `/api/v1/jogadores/{id}` | Remove um jogador |

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

## Execução local

### Com Docker

```bash
docker compose up --build
```

A API fica disponível em http://localhost:3000 e a documentação em http://localhost:3000/docs.

### Sem Docker

Requisitos: Node.js 22 e PostgreSQL 16.

```bash
cd api
cp .env.example .env        # ajuste DATABASE_URL se necessário
npm install
npx prisma migrate deploy   # cria as tabelas
npm run db:seed             # carrega os dados iniciais
npm run dev
```

### Testes

Os testes usam o banco definido em `api/.env.test` e recriam os dados iniciais antes da execução.

```bash
cd api
npm test
```

## Publicação

- **Banco de dados:** PostgreSQL gerenciado no Neon.
- **API:** Web Service no Render com diretório raiz `api`, comando de build `npm run render:build`, comando de início `npm start` e as variáveis `DATABASE_URL` e `CORS_ORIGINS`.
- **Documentação:** GitHub Pages a partir da pasta `docs/` da branch `main`. O comando `npm run docs:build` copia a especificação para essa pasta.

## Versionamento

O histórico segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). O desenvolvimento acontece na branch `develop`, integrada à `main` por pull request a cada versão publicada.

## Licença

[MIT](LICENSE)
