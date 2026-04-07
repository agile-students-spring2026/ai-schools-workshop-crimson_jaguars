"""Tests for scoring module."""

from app import scoring


def test_safe_none():
    assert scoring._safe(None) is None
    assert scoring._safe(None, default=0) == 0


def test_safe_invalid():
    assert scoring._safe("abc") is None
    assert scoring._safe(object()) is None


def test_safe_negative():
    assert scoring._safe(-1) is None


def test_safe_valid():
    assert scoring._safe(5) == 5.0
    assert scoring._safe("3.5") == 3.5
    assert scoring._safe(0) == 0.0


def test_student_teacher_ratio_normal():
    assert scoring.student_teacher_ratio(150, 10) == 15.0


def test_student_teacher_ratio_missing():
    assert scoring.student_teacher_ratio(None, 10) is None
    assert scoring.student_teacher_ratio(150, None) is None
    assert scoring.student_teacher_ratio(150, 0) is None


def test_score_ratio_bounds():
    assert scoring.score_ratio(None) == 50.0
    assert scoring.score_ratio(10) == 100.0
    assert scoring.score_ratio(12) == 100.0
    assert scoring.score_ratio(30) == 0.0
    assert scoring.score_ratio(40) == 0.0


def test_score_ratio_linear():
    val = scoring.score_ratio(21)
    assert 49.5 <= val <= 50.5


def test_score_size_zero_and_none():
    assert scoring.score_size(None) == 0.0
    assert scoring.score_size(0) == 0.0


def test_score_size_small():
    assert scoring.score_size(500) == 50.0


def test_score_size_mid():
    assert scoring.score_size(1000) == 100.0
    assert scoring.score_size(5000) == 100.0
    assert scoring.score_size(10000) == 100.0


def test_score_size_large():
    val = scoring.score_size(50000)
    assert 0 < val < 100
    assert scoring.score_size(100000) == 40.0
    assert scoring.score_size(500000) == 40.0


def test_score_lunch():
    assert scoring.score_lunch(None) == 50.0
    assert scoring.score_lunch(0) == 100.0
    assert scoring.score_lunch(100) == 0.0
    assert scoring.score_lunch(150) == 0.0
    assert scoring.score_lunch(40) == 60.0


def test_score_district_full():
    d = {
        "enrollment": 5000,
        "teachers_total_fte": 400,
        "free_or_reduced_price_lunch_pct": 30,
    }
    result = scoring.score_district(d)
    assert result["overall"] > 0
    assert result["student_teacher_ratio"] == 12.5
    assert "factors" in result
    assert set(result["factors"].keys()) == {
        "student_teacher_ratio_score",
        "size_score",
        "funding_context_score",
    }


def test_score_district_empty():
    result = scoring.score_district({})
    assert result["student_teacher_ratio"] is None
    assert result["overall"] >= 0
