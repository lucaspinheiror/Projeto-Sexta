from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)


def registrar_middleware(app: FastAPI) -> None:
    @app.middleware("http")
    async def exception_middleware(request: Request, call_next):
        try:
            return await call_next(request)

        except HTTPException as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.detail},
            )

        except RequestValidationError as exc:
            return JSONResponse(
                status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                content={"detail": exc.errors()},
            )

        except ValueError as exc:
            return JSONResponse(
                status_code=HTTP_400_BAD_REQUEST,
                content={"detail": str(exc)},
            )

        except IndexError as exc:
            return JSONResponse(
                status_code=HTTP_404_NOT_FOUND,
                content={"detail": str(exc)},
            )

        except Exception as exc:
            return JSONResponse(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": f"Erro interno: {str(exc)}"},
            )