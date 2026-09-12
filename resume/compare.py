#!/usr/bin/env python3
"""Compare two resume PDFs line by line — the fidelity check for resume/build.mjs.

The PDFs in public/ are the reference. After changing resume.css or either HTML
fragment, print to a scratch file and compare it against the shipped PDF: every
line whose text did not change must land on the same baseline and the same left
edge, or the reconstruction has drifted.

    pip install pdfplumber
    node resume/build.mjs en --out /tmp/check.pdf
    python3 resume/compare.py public/rain-zhang-resume.pdf /tmp/check.pdf

Baselines come from each glyph's text matrix, in pt from the top of the page.
Rules are read as filled rects so the six hairlines are checked too.
"""
import collections
import sys

import pdfplumber

TOL = 0.5  # pt; half a point is a third of a printed pixel


def rows(path):
    page = pdfplumber.open(path).pages[0]
    grouped = collections.defaultdict(list)
    for ch in page.chars:
        grouped[round(page.height - ch["matrix"][5], 2)].append(ch)
    out = []
    for base in sorted(grouped):
        chs = sorted(grouped[base], key=lambda c: c["x0"])
        out.append(
            {
                "base": base,
                "x0": round(chs[0]["x0"], 2),
                "x1": round(chs[-1]["x1"], 2),
                "size": round(chs[0]["size"], 3),
                "text": "".join(c["text"] for c in chs),
            }
        )
    rects = sorted(
        (round(r["x0"], 2), round(r["top"], 2), round(r["x1"], 2), round(r["bottom"], 2))
        for r in page.rects
        if (r["x1"] - r["x0"]) < page.width - 1  # skip the page background
    )
    return out, rects, len(page.curves), len(pdfplumber.open(path).pages)


def main(ref_path, new_path):
    ref, ref_rects, ref_curves, ref_pages = rows(ref_path)
    new, new_rects, new_curves, new_pages = rows(new_path)

    print(f"pages   ref={ref_pages} new={new_pages}")
    print(f"lines   ref={len(ref)} new={len(new)}")
    print(f"discs   ref={ref_curves} new={new_curves}")

    print("\nrules")
    for r in ref_rects:
        mark = "ok " if r in new_rects else "!! "
        print(f"  {mark}{r}")
    for r in new_rects:
        if r not in ref_rects:
            print(f"  ++ {r}  (new only)")

    by_text = collections.defaultdict(list)
    for row in new:
        by_text[row["text"]].append(row)

    print("\nlines that moved (matched on identical text)")
    moved = unmatched = 0
    for row in ref:
        cand = by_text.get(row["text"])
        if not cand:
            unmatched += 1
            print(f"  -- base={row['base']:8.2f} x0={row['x0']:7.2f}  {row['text'][:58]}")
            continue
        got = cand.pop(0)
        db, dx, dw = (
            got["base"] - row["base"],
            got["x0"] - row["x0"],
            (got["x1"] - got["x0"]) - (row["x1"] - row["x0"]),
        )
        if abs(db) > TOL or abs(dx) > TOL or abs(dw) > TOL:
            moved += 1
            print(
                f"  !! dy={db:+6.2f} dx={dx:+6.2f} dw={dw:+6.2f}  "
                f"base={row['base']:8.2f}  {row['text'][:48]}"
            )
    extra = [r for rs in by_text.values() for r in rs]
    for row in extra:
        print(f"  ++ base={row['base']:8.2f} x0={row['x0']:7.2f}  {row['text'][:58]}  (new only)")

    print(
        f"\n{len(ref) - unmatched - moved}/{len(ref)} reference lines land within {TOL}pt; "
        f"{moved} moved, {unmatched} missing, {len(extra)} added"
    )
    return 1 if (moved or unmatched or extra or ref_pages != new_pages) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
