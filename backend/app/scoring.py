"""District quality scoring.

Combines several signals from publicly-available NCES Common Core of Data
into a single 0-100 quality score plus per-factor breakdown.
"""

from typing import Optional


def _safe(value, default=None):
    """Return value if it's a usable number, else default."""
    if value is None:
        return default
    try:
        n = float(value)
    except (TypeError, ValueError):
        return default
    if n < 0:
        return default
    return n


def student_teacher_ratio(enrollment, teachers_fte) -> Optional[float]:
    """Compute student-teacher ratio. Returns None if not computable."""
    e = _safe(enrollment)
    t = _safe(teachers_fte)
    if e is None or t is None or t == 0:
        return None
    return round(e / t, 2)


def score_ratio(ratio: Optional[float]) -> float:
    """Lower student-teacher ratio is better.
    Best <= 12, worst >= 30. Linear in between."""
    if ratio is None:
        return 50.0
    if ratio <= 12:
        return 100.0
    if ratio >= 30:
        return 0.0
    return round(100.0 * (30 - ratio) / 18, 2)


def score_size(enrollment) -> float:
    """Mid-size districts (1k-10k) score highest; very small or very large lower."""
    e = _safe(enrollment)
    if e is None or e == 0:
        return 0.0
    if 1000 <= e <= 10000:
        return 100.0
    if e < 1000:
        return round(100.0 * e / 1000, 2)
    # > 10000: gentle decay
    if e >= 100000:
        return 40.0
    return round(100.0 - 60.0 * (e - 10000) / 90000, 2)


def score_lunch(free_lunch_pct) -> float:
    """Lower free/reduced lunch % correlates with higher resourcing.
    NOT a quality judgment of students - this is a proxy for district funding context."""
    p = _safe(free_lunch_pct)
    if p is None:
        return 50.0
    if p <= 0:
        return 100.0
    if p >= 100:
        return 0.0
    return round(100.0 - p, 2)


def score_district(district: dict) -> dict:
    """Compute composite score and breakdown for a district record."""
    enrollment = district.get("enrollment")
    teachers = district.get("teachers_total_fte")
    free_lunch = district.get("free_or_reduced_price_lunch_pct")

    ratio = student_teacher_ratio(enrollment, teachers)
    s_ratio = score_ratio(ratio)
    s_size = score_size(enrollment)
    s_lunch = score_lunch(free_lunch)

    # Weights: ratio 50%, size 20%, funding context 30%
    overall = round(s_ratio * 0.5 + s_size * 0.2 + s_lunch * 0.3, 2)

    return {
        "overall": overall,
        "student_teacher_ratio": ratio,
        "factors": {
            "student_teacher_ratio_score": s_ratio,
            "size_score": s_size,
            "funding_context_score": s_lunch,
        },
    }
