# Handoff Tecnico - FastAPI + SQLite

## 1. Visao geral

Este backend foi estruturado para ser simples de manter e rapido para evoluir.

Pontos principais:
- API REST com FastAPI.
- Persistencia SQLite via SQLAlchemy.
- Separacao clara entre camada web (FastAPI) e camada de dados (DB).
- Backend organizado em controller, service, model e repository.

## 2. Arquitetura

Camadas:
- `app/main.py`: inicializacao da aplicacao e rotas globais.
- `app/fastapi/controllers`: camada controller (entrada HTTP e codigos de resposta).
- `app/services`: camada service (regras de negocio e orquestracao).
- `app/db/models`: camada model (entidades/tabelas SQLAlchemy).
- `app/db/repositories`: camada repository (acesso ao banco).
- `app/fastapi/schemas`: contratos de request/response (Pydantic).
- `app/db/session.py`: engine, sessao e ciclo de vida do banco.
- `app/core/config.py`: configuracoes por ambiente.

Fluxo de requisicao:
1. Requisicao chega no controller FastAPI.
2. Controller valida payload com schema.
3. Controller chama o service.
4. Service chama o repository.
5. Repository acessa banco com SQLAlchemy model.
6. Resposta retorna no controller com schema de saida.

## 3. Executar projeto

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 4. Variaveis de ambiente

Arquivo base: `.env.example`

Variaveis:
- `API_TITLE`: titulo da API.
- `API_VERSION`: versao da API.
- `DATABASE_URL`: URL SQLAlchemy do banco.

Exemplo SQLite local:

```env
DATABASE_URL=sqlite:///./app.db
```

## 5. Endpoints implementados

Health:
- `GET /health`

Items:
- `POST /api/v1/items/`
- `GET /api/v1/items/`
- `GET /api/v1/items/{item_id}`
- `PUT /api/v1/items/{item_id}`
- `DELETE /api/v1/items/{item_id}`

## 6. Decisoes tecnicas

- FastAPI escolhido por produtividade e documentacao automatica.
- SQLite escolhido por simplicidade operacional para ambientes pequenos e dev rapido.
- SQLAlchemy adotado para facilitar futura migracao para PostgreSQL/MySQL.

## 7. Como evoluir sem quebrar

- Novos modulos devem seguir o padrao (`controller`, `service`, `repository`, `model`, `schema`).
- Manter versionamento de rotas em `/api/v1`.
- Validar contratos de entrada/saida sempre com Pydantic.
- Criar testes para cada endpoint novo antes de deploy.

## 8. Riscos e observacoes

- SQLite nao e ideal para alta concorrencia e workloads pesados.
- Criacao automatica de tabelas no startup e util para fase inicial, mas recomenda-se migracoes versionadas depois.

## 9. Proximos passos recomendados

1. Incluir testes automatizados com `pytest` e `httpx`.
2. Adicionar migracoes com Alembic.
3. Implementar autenticacao (JWT/OAuth2).
4. Configurar pipeline CI para lint, testes e build.# Handoff Tecnico - FastAPI + SQLite

## 1. Visao geral

Este backend foi estruturado para ser simples de manter e rapido para evoluir.

Pontos principais:
- API REST com FastAPI.
- Persistencia SQLite via SQLAlchemy.
- Separacao clara entre camada web (FastAPI) e camada de dados (DB).
- Backend organizado em controller, service, model e repository.

## 2. Arquitetura

Camadas:
- `app/main.py`: inicializacao da aplicacao e rotas globais.
- `app/fastapi/controllers`: camada controller (entrada HTTP e codigos de resposta).
- `app/services`: camada service (regras de negocio e orquestracao).
- `app/db/models`: camada model (entidades/tabelas SQLAlchemy).
- `app/db/repositories`: camada repository (acesso ao banco).
- `app/fastapi/schemas`: contratos de request/response (Pydantic).
- `app/db/session.py`: engine, sessao e ciclo de vida do banco.
- `app/core/config.py`: configuracoes por ambiente.

Fluxo de requisicao:
1. Requisicao chega no controller FastAPI.
2. Controller valida payload com schema.
3. Controller chama o service.
4. Service chama o repository.
5. Repository acessa banco com SQLAlchemy model.
6. Resposta retorna no controller com schema de saida.

## 3. Executar projeto

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 4. Variaveis de ambiente

Arquivo base: `.env.example`

Variaveis:
- `API_TITLE`: titulo da API.
- `API_VERSION`: versao da API.
- `DATABASE_URL`: URL SQLAlchemy do banco.

Exemplo SQLite local:

```env
DATABASE_URL=sqlite:///./app.db
```

## 5. Endpoints implementados

Health:
- `GET /health`

Items:
- `POST /api/v1/items/`
- `GET /api/v1/items/`
- `GET /api/v1/items/{item_id}`
- `PUT /api/v1/items/{item_id}`
- `DELETE /api/v1/items/{item_id}`

## 6. Decisoes tecnicas

- FastAPI escolhido por produtividade e documentacao automatica.
- SQLite escolhido por simplicidade operacional para ambientes pequenos e dev rapido.
- SQLAlchemy adotado para facilitar futura migracao para PostgreSQL/MySQL.

## 7. Como evoluir sem quebrar

- Novos modulos devem seguir o padrao (`controller`, `service`, `repository`, `model`, `schema`).
- Manter versionamento de rotas em `/api/v1`.
- Validar contratos de entrada/saida sempre com Pydantic.
- Criar testes para cada endpoint novo antes de deploy.

## 8. Riscos e observacoes

- SQLite nao e ideal para alta concorrencia e workloads pesados.
- Criacao automatica de tabelas no startup e util para fase inicial, mas recomenda-se migracoes versionadas depois.

## 9. Proximos passos recomendados

1. Incluir testes automatizados com `pytest` e `httpx`.
2. Adicionar migracoes com Alembic.
3. Implementar autenticacao (JWT/OAuth2).
4. Configurar pipeline CI para lint, testes e build.
