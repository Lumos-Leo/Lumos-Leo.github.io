import json
import os
from pathlib import Path

from scholarly import scholarly


SCHOLAR_ID = os.getenv("GOOGLE_SCHOLAR_ID", "rMnQ-u0AAAAJ")
OUTPUT = Path("google-scholar-stats/gs_data.json")


def main():
    author = scholarly.search_author_id(SCHOLAR_ID)
    author = scholarly.fill(author, sections=["basics", "indices", "counts", "publications"])

    publications = {}
    for index, publication in enumerate(author.get("publications", [])):
        filled = scholarly.fill(publication)
        publications[str(index)] = {
            "bib": {
                "title": filled.get("bib", {}).get("title", ""),
                "pub_year": filled.get("bib", {}).get("pub_year", ""),
                "venue": filled.get("bib", {}).get("venue", ""),
            },
            "num_citations": filled.get("num_citations", 0),
        }

    data = {
        "name": author.get("name", "Ao Li"),
        "citedby": author.get("citedby", 0),
        "hindex": author.get("hindex", 0),
        "i10index": author.get("i10index", 0),
        "publications": publications,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
