# ============================================================
# Compile 5x5 POI Patch Files into Long-Format CSV
# ============================================================
#
# Input:
# datasets/vnp46a2/poi_patches_5x5/<POI>/<YYYY-MM-DD>.npz
#
# Output:
# datasets/vnp46a2/poi_patch_tables/poi_patch_daily_metrics_long.csv
#
# Used by:
# Notebook 01 — POI Observability Diagnostics
# ============================================================


# ------------------------------
# 1. Imports and paths
# ------------------------------

from pathlib import Path
from collections import Counter

import numpy as np
import pandas as pd
from tqdm import tqdm


PROJECT_ROOT = Path.cwd()

PATCH_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "vnp46a2"
    / "poi_patches_5x5"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "vnp46a2"
    / "poi_patch_tables"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "poi_patch_daily_metrics_long.csv"


# ------------------------------
# 2. Helper functions
# ------------------------------

def extract_zone(arr, size):
    if arr is None:
        return []

    arr = np.array(arr)

    if arr.ndim != 2 or arr.shape != (5, 5):
        return []

    if size == 1:
        return [arr[2, 2]]

    if size == 3:
        return arr[1:4, 1:4].flatten().tolist()

    if size == 5:
        return arr.flatten().tolist()

    return []


def clean_hist(arr):
    return dict(
        Counter([
            int(v)
            for v in arr
            if v is not None and not pd.isna(v)
        ])
    )


def summarize_patch(values):
    arr = np.array([
        v for v in values
        if v is not None and not pd.isna(v)
    ], dtype=float)

    valid = arr[arr > 0]

    return {
        "mean": valid.mean() if valid.size else np.nan,
        "std": valid.std() if valid.size else np.nan,
        "valid": int(valid.size),
        "total": int(arr.size),
        "pct": float(valid.size / arr.size * 100) if arr.size else np.nan,
    }


# ------------------------------
# 3. Compile patch files
# ------------------------------

rows = []

if not PATCH_DIR.exists():
    raise FileNotFoundError(f"Patch directory not found: {PATCH_DIR}")

for poi_path in tqdm(sorted(PATCH_DIR.iterdir()), desc="POIs"):
    if not poi_path.is_dir():
        continue

    poi = poi_path.name

    for file_path in sorted(poi_path.glob("*.npz")):
        date_str = file_path.stem

        try:
            data = np.load(file_path, allow_pickle=True)
        except Exception:
            continue

        for size, extent in zip([1, 3, 5], ["1x1", "3x3", "5x5"]):
            row = {
                "date": date_str,
                "location": poi,
                "extent": extent,
                "DNB_mean": np.nan,
                "DNB_stdDev": np.nan,
                "Gap_mean": np.nan,
                "Gap_stdDev": np.nan,
                "DNB_valid_px": 0,
                "Total_px": np.nan,
                "Valid_pct": np.nan,
                "HQ_hist": None,
                "QF_hist": None,
            }

            dnb = extract_zone(data.get("DNB_BRDF_Corrected_NTL"), size)
            if dnb:
                stats = summarize_patch(dnb)
                row.update({
                    "DNB_mean": stats["mean"],
                    "DNB_stdDev": stats["std"],
                    "DNB_valid_px": stats["valid"],
                    "Total_px": stats["total"],
                    "Valid_pct": stats["pct"],
                })

            gap = extract_zone(data.get("Gap_Filled_DNB_BRDF_Corrected_NTL"), size)
            if gap:
                stats = summarize_patch(gap)
                row.update({
                    "Gap_mean": stats["mean"],
                    "Gap_stdDev": stats["std"],
                })

            hq = extract_zone(data.get("Latest_High_Quality_Retrieval"), size)
            if hq:
                row["HQ_hist"] = clean_hist(hq)

            qf = extract_zone(data.get("QF_Cloud_Mask"), size)
            if qf:
                row["QF_hist"] = clean_hist(qf)

            rows.append(row)


# ------------------------------
# 4. Export
# ------------------------------

df = pd.DataFrame(rows)

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values(["location", "extent", "date"]).reset_index(drop=True)

df.to_csv(OUTPUT_FILE, index=False)

print(f"Rows: {len(df):,}")
print(f"Exported: {OUTPUT_FILE}")

df.head()