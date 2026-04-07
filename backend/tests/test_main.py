"""Tests for the FastAPI app endpoints."""

from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.services import EducationDataClient


@pytest.fixture
def fake_client():
    c = EducationDataClient()
    c.list_districts = AsyncMock(  # type: ignore[method-assign]
        return_value=[
            {
                "leaid": "0600001",
                "name": "Alpha USD",
                "state": "CA",
                "city": "Alphaville",
                "year": 2022,
                "enrollment": 5000,
                "teachers_total_fte": 400,
                "free_or_reduced_price_lunch_pct": 30,
                "lowest_grade_offered": "KG",
                "highest_grade_offered": "12",
                "number_of_schools": 8,
                "urban_centric_locale": 21,
            },
            {
                "leaid": "0600002",
                "name": "Beta USD",
                "state": "CA",
                "city": "Betaville",
                "year": 2022,
                "enrollment": 800,
                "teachers_total_fte": 100,
                "free_or_reduced_price_lunch_pct": 80,
                "lowest_grade_offered": "KG",
                "highest_grade_offered": "08",
                "number_of_schools": 2,
                "urban_centric_locale": 41,
            },
        ]
    )
    c.get_district = AsyncMock(  # type: ignore[method-assign]
        side_effect=lambda leaid, year: (
            {
                "leaid": leaid,
                "name": "Alpha USD",
                "state": "CA",
                "city": "Alphaville",
                "year": year,
                "enrollment": 5000,
                "teachers_total_fte": 400,
                "free_or_reduced_price_lunch_pct": 30,
            }
            if leaid == "0600001"
            else None
        )
    )
    return c


@pytest.fixture
def client(fake_client):
    app = create_app(client=fake_client)
    return TestClient(app)


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_get_states(client):
    r = client.get("/api/states")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 51
    assert any(s["code"] == "CA" for s in data)


def test_list_districts_unknown_state(client):
    r = client.get("/api/districts", params={"state": "ZZ"})
    assert r.status_code == 404


def test_list_districts_ok(client):
    r = client.get("/api/districts", params={"state": "CA"})
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == 2
    # Sorted descending by overall score
    assert body["results"][0]["score"]["overall"] >= body["results"][1]["score"]["overall"]
    assert "score" in body["results"][0]


def test_list_districts_search_filter(client):
    r = client.get("/api/districts", params={"state": "CA", "q": "alpha"})
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == 1
    assert body["results"][0]["name"] == "Alpha USD"


def test_get_district_found(client):
    r = client.get("/api/districts/0600001")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Alpha USD"
    assert "score" in body


def test_get_district_not_found(client):
    r = client.get("/api/districts/9999999")
    assert r.status_code == 404


def test_create_app_default_client():
    """Smoke test the default code path that constructs its own client."""
    app = create_app()
    assert app.state.client is not None
