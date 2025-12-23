"""
Django ORM-based repository for storing CV records.
This replaces the SQLAlchemy-based SQLRepository to work with Django's database.
"""
import json
from typing import Any, Dict, Optional
from django.utils import timezone

from .models import CVRecord


class DjangoRepository:
    """
    Django ORM repository to persist parsed CVs and insights.
    Equivalent to SQLRepository but uses Django ORM instead of SQLAlchemy.
    Stores data exactly like the original RecruitmentAI project.
    """

    def store_parsed(self, file_name: str, parsed: Dict[str, Any]) -> Optional[int]:
        """Store parsed CV data and return record ID"""
        try:
            record = CVRecord.objects.create(
                file_name=file_name,
                parsed_json=json.dumps(parsed, ensure_ascii=False),
                created_at=timezone.now(),
            )
            return record.id
        except Exception:
            return None

    def store_insights(
        self,
        record_id: Optional[int],
        insights: Dict[str, Any],
        rank: Optional[int] = None,
    ) -> None:
        """Store insights and role_fit_score from SummarizationAgent"""
        if record_id is None:
            return
        try:
            CVRecord.objects.filter(id=record_id).update(
                insights_json=json.dumps(insights, ensure_ascii=False),
                role_fit_score=insights.get("role_fit_score"),
                rank=rank,
            )
        except Exception:
            pass

    def store_enrichment(self, record_id: Optional[int], enriched: Dict[str, Any]) -> None:
        """Store enrichment data from LeadResearchEnrichmentAgent"""
        if record_id is None:
            return
        try:
            CVRecord.objects.filter(id=record_id).update(
                enriched_json=json.dumps(enriched, ensure_ascii=False)
            )
        except Exception:
            pass

    def store_qualification(
        self,
        record_id: Optional[int],
        qualification: Dict[str, Any],
        rank: Optional[int] = None,
    ) -> None:
        """Store qualification data from LeadQualificationAgent"""
        if record_id is None:
            return
        try:
            update_data = {
                "qualification_json": json.dumps(qualification, ensure_ascii=False),
                "qualification_decision": qualification.get("decision"),
                "qualification_confidence": qualification.get("confidence_score"),
                "qualification_priority": qualification.get("priority"),
            }
            if rank is not None:
                update_data["rank"] = rank
            
            CVRecord.objects.filter(id=record_id).update(**update_data)
        except Exception:
            pass

    def fetch_recent(self, limit: int = 20) -> list[Dict[str, Any]]:
        """Fetch recent CV records"""
        records = CVRecord.objects.all().order_by('-created_at')[:limit]
        results = []
        for record in records:
            results.append({
                "id": record.id,
                "file_name": record.file_name,
                "parsed_json": record.parsed_json,
                "insights_json": record.insights_json,
                "role_fit_score": record.role_fit_score,
                "rank": record.rank,
                "enriched_json": record.enriched_json,
                "qualification_json": record.qualification_json,
                "qualification_decision": record.qualification_decision,
                "qualification_confidence": record.qualification_confidence,
                "qualification_priority": record.qualification_priority,
                "created_at": record.created_at.isoformat() if record.created_at else None,
            })
        return results


