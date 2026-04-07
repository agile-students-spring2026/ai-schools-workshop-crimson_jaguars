"""Tests for the EducationDataClient using respx to mock HTTP."""

import httpx
import pytest
import respx

from app.services import BASE_URL, EducationDataClient, _normalize_district


def test_normalize_district_full():
    raw = {
        "leaid": 12345,
        "lea_name": "Example USD",
        "state_location": "CA",
        "city_location": "Anytown",
        "year": 2022,
        "enrollment": 1000,
        "teachers_total_fte": 80,
        "free_or_reduced_price_lunch_pct": 35,
        "lowest_grade_offered": "KG",
        "highest_grade_offered": "12",
        "number_of_schools": 10,
        "urban_centric_locale": 21,
    }
    out = _normalize_district(raw)
    assert out["leaid"] == "12345"
    assert out["name"] == "Example USD"
    assert out["state"] == "CA"
    assert out["city"] == "Anytown"
    assert out["enrollment"] == 1000


def test_normalize_district_fallbacks():
    out = _normalize_district({"name": "Foo", "state_mailing": "TX", "city_mailing": "Houston"})
    assert out["name"] == "Foo"
    assert out["state"] == "TX"
    assert out["city"] == "Houston"
    assert out["leaid"] == ""


@pytest.mark.asyncio
async def test_list_districts_single_page():
    client = EducationDataClient()
    payload = {
        "next": None,
        "results": [
            {"leaid": 1, "lea_name": "A", "enrollment": 100, "teachers_total_fte": 10},
            {"leaid": 2, "lea_name": "B", "enrollment": 200, "teachers_total_fte": 20},
        ],
    }
    with respx.mock(base_url=BASE_URL) as router:
        router.get("/school-districts/ccd/directory/2022/", params={"fips": "06"}).mock(
            return_value=httpx.Response(200, json=payload)
        )
        result = await client.list_districts("06", 2022)
    assert len(result) == 2
    assert result[0]["name"] == "A"


@pytest.mark.asyncio
async def test_list_districts_paginated():
    client = EducationDataClient()
    page1 = {
        "next": f"{BASE_URL}/school-districts/ccd/directory/2022/?fips=06&page=2",
        "results": [{"leaid": 1, "lea_name": "A"}],
    }
    page2 = {
        "next": None,
        "results": [{"leaid": 2, "lea_name": "B"}],
    }
    with respx.mock(base_url=BASE_URL) as router:
        router.get("/school-districts/ccd/directory/2022/", params={"fips": "06"}).mock(
            return_value=httpx.Response(200, json=page1)
        )
        router.get(
            "/school-districts/ccd/directory/2022/", params={"fips": "06", "page": "2"}
        ).mock(return_value=httpx.Response(200, json=page2))
        result = await client.list_districts("06", 2022)
    assert [d["name"] for d in result] == ["A", "B"]


@pytest.mark.asyncio
async def test_list_districts_caches_first_page():
    client = EducationDataClient()
    payload = {"next": None, "results": [{"leaid": 1, "lea_name": "A"}]}
    with respx.mock(base_url=BASE_URL) as router:
        route = router.get(
            "/school-districts/ccd/directory/2022/", params={"fips": "06"}
        ).mock(return_value=httpx.Response(200, json=payload))
        await client.list_districts("06", 2022)
        await client.list_districts("06", 2022)
    assert route.call_count == 1


@pytest.mark.asyncio
async def test_get_district_found():
    client = EducationDataClient()
    payload = {
        "results": [{"leaid": 999, "lea_name": "Solo", "enrollment": 500, "teachers_total_fte": 50}]
    }
    with respx.mock(base_url=BASE_URL) as router:
        router.get(
            "/school-districts/ccd/directory/2022/", params={"leaid": "999"}
        ).mock(return_value=httpx.Response(200, json=payload))
        d = await client.get_district("999", 2022)
    assert d is not None
    assert d["name"] == "Solo"


@pytest.mark.asyncio
async def test_get_district_not_found():
    client = EducationDataClient()
    with respx.mock(base_url=BASE_URL) as router:
        router.get(
            "/school-districts/ccd/directory/2022/", params={"leaid": "000"}
        ).mock(return_value=httpx.Response(200, json={"results": []}))
        d = await client.get_district("000", 2022)
    assert d is None
