"""FastAPI app for the School District Evaluator."""

import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .scoring import score_district
from .services import EducationDataClient
from .states import CODE_TO_FIPS, STATES

DEFAULT_YEAR = int(os.environ.get("DEFAULT_YEAR", "2022"))


def create_app(client: Optional[EducationDataClient] = None) -> FastAPI:
    app = FastAPI(title="School District Evaluator")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.client = client or EducationDataClient()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/states")
    def get_states():
        return STATES

    @app.get("/api/districts")
    async def list_districts(
        state: str = Query(..., min_length=2, max_length=2),
        year: int = DEFAULT_YEAR,
        q: Optional[str] = None,
    ):
        fips = CODE_TO_FIPS.get(state.upper())
        if not fips:
            raise HTTPException(status_code=404, detail="Unknown state code")
        districts = await app.state.client.list_districts(fips, year)
        if q:
            ql = q.lower()
            districts = [d for d in districts if ql in (d.get("name") or "").lower()]
        for d in districts:
            d["score"] = score_district(d)
        districts.sort(key=lambda d: d["score"]["overall"], reverse=True)
        return {"count": len(districts), "results": districts}

    @app.get("/api/districts/{leaid}")
    async def get_district(leaid: str, year: int = DEFAULT_YEAR):
        district = await app.state.client.get_district(leaid, year)
        if not district:
            raise HTTPException(status_code=404, detail="District not found")
        district["score"] = score_district(district)
        return district

    # Optional static frontend mount (built SPA copied to backend/static)
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    if os.path.isdir(static_dir):  # pragma: no cover - exercised only after frontend build
        app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

        @app.get("/")
        def index():
            return FileResponse(os.path.join(static_dir, "index.html"))

        @app.get("/{path:path}")
        def spa(path: str):
            file_path = os.path.join(static_dir, path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
            return FileResponse(os.path.join(static_dir, "index.html"))

    return app


app = create_app()
