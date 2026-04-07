"""Tests for states module."""

from app.states import CODE_TO_FIPS, STATES


def test_states_count():
    # 50 states + DC
    assert len(STATES) == 51


def test_all_states_have_required_fields():
    for s in STATES:
        assert "fips" in s and len(s["fips"]) == 2
        assert "code" in s and len(s["code"]) == 2
        assert "name" in s and s["name"]


def test_code_to_fips_lookup():
    assert CODE_TO_FIPS["CA"] == "06"
    assert CODE_TO_FIPS["NY"] == "36"
    assert CODE_TO_FIPS["DC"] == "11"
