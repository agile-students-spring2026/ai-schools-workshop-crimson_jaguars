"""Client for the Urban Institute Education Data API.

API docs: https://educationdata.urban.org/documentation/
This client is intentionally small and easy to mock in tests.
"""

from typing import Optional
import httpx

BASE_URL = "https://educationdata.urban.org/api/v1"


class EducationDataClient:
    """Thin async client over the Urban Institute Education Data API."""

    def __init__(self, base_url: str = BASE_URL, timeout: float = 30.0):
        self.base_url = base_url
        self.timeout = timeout
        self._cache: dict = {}

    async def _get(self, path: str, params: Optional[dict] = None) -> dict:
        key = (path, tuple(sorted((params or {}).items())))
        if key in self._cache:
            return self._cache[key]
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
        self._cache[key] = data
        return data

    async def list_districts(self, fips: str, year: int) -> list:
        """Return all districts for a state/year (paginated)."""
        path = f"/school-districts/ccd/directory/{year}/"
        results: list = []
        params = {"fips": fips}
        page_url: Optional[str] = None
        while True:
            if page_url is None:
                data = await self._get(path, params)
            else:
                # follow absolute next URL
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.get(page_url)
                    resp.raise_for_status()
                    data = resp.json()
            for r in data.get("results", []):
                results.append(_normalize_district(r))
            page_url = data.get("next")
            if not page_url:
                break
        return results

    async def get_district(self, leaid: str, year: int) -> Optional[dict]:
        """Fetch a single district by NCES LEAID."""
        path = f"/school-districts/ccd/directory/{year}/"
        data = await self._get(path, {"leaid": leaid})
        results = data.get("results", [])
        if not results:
            return None
        return _normalize_district(results[0])


def _normalize_district(raw: dict) -> dict:
    """Pick the fields we care about and standardize keys."""
    return {
        "leaid": str(raw.get("leaid", "")),
        "name": raw.get("lea_name") or raw.get("name") or "",
        "state": raw.get("state_location") or raw.get("state_mailing") or "",
        "city": raw.get("city_location") or raw.get("city_mailing") or "",
        "year": raw.get("year"),
        "enrollment": raw.get("enrollment"),
        "teachers_total_fte": raw.get("teachers_total_fte"),
        "free_or_reduced_price_lunch_pct": raw.get("free_or_reduced_price_lunch_pct"),
        "lowest_grade_offered": raw.get("lowest_grade_offered"),
        "highest_grade_offered": raw.get("highest_grade_offered"),
        "number_of_schools": raw.get("number_of_schools"),
        "urban_centric_locale": raw.get("urban_centric_locale"),
    }
