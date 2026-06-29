# ============================================================
# Extract 5x5 VNP46A2 Patches for POI Observability Diagnostics
# ============================================================
#
# Output:
# datasets/vnp46a2/poi_patches_5x5/<POI>/<YYYY-MM-DD>.npz
#
# Used by:
# Notebook 01 — POI Observability Diagnostics
# ============================================================


# ------------------------------
# 1. Imports and Earth Engine setup
# ------------------------------

import os
from datetime import date, timedelta
from pathlib import Path

import ee
import numpy as np
from tqdm import tqdm


try:
    ee.Initialize()
except Exception:
    ee.Authenticate()
    ee.Initialize()


# ------------------------------
# 2. Paths
# ------------------------------

PROJECT_ROOT = Path.cwd()

OUTPUT_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "vnp46a2"
    / "poi_patches_5x5"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ------------------------------
# 3. POI definitions
# ------------------------------

POI_DATA = [
    {"name": "Tacloban_City",        "coord": [125.0015, 11.2434], "group": "City Centers"},
    {"name": "Ormoc_City",           "coord": [124.6068, 11.0088], "group": "City Centers"},
    {"name": "Baybay_City",          "coord": [124.7989, 10.6766], "group": "City Centers"},
    {"name": "Palo",                 "coord": [124.9904, 11.1577], "group": "Municipal Centers"},
    {"name": "Alang_Alang",          "coord": [124.8465, 11.2071], "group": "Municipal Centers"},
    {"name": "Guiuan",               "coord": [125.7232, 11.0312], "group": "Municipal Centers"},
    {"name": "Samar_Forest_Reserve", "coord": [125.1870, 11.7740], "group": "Non-settlement Areas"},
    {"name": "Mt_Nacolod_Upland",    "coord": [125.3100, 11.4960], "group": "Non-settlement Areas"},
    {"name": "Central_Leyte_Forest", "coord": [124.8710, 10.8180], "group": "Non-settlement Areas"},
    {"name": "Southern_Leyte_Gulf",  "coord": [125.3222, 10.8153], "group": "Non-settlement Areas"},
]


# ------------------------------
# 4. VNP46A2 bands and kernel
# ------------------------------

BANDS = [
    "DNB_BRDF_Corrected_NTL",
    "DNB_Lunar_Irradiance",
    "Gap_Filled_DNB_BRDF_Corrected_NTL",
    "Latest_High_Quality_Retrieval",
    "Mandatory_Quality_Flag",
    "QF_Cloud_Mask",
    "Snow_Flag",
]

KERNEL = ee.Kernel.square(2, "pixels")


# ------------------------------
# 5. Date range
# ------------------------------

START_DATE = date(2017, 6, 1)
END_DATE = date(2024, 12, 31)
ONE_DAY = timedelta(days=1)


# ------------------------------
# 6. Helper functions
# ------------------------------

def extract_patch(img, point, band):
    arr = img.select(band).neighborhoodToArray(KERNEL)
    sample = arr.sample(region=point, scale=500, numPixels=1).first()
    return ee.Algorithms.If(sample, sample.getArray(band), None)


def get_daily_image(dt):
    return (
        ee.ImageCollection("NASA/VIIRS/002/VNP46A2")
        .filterDate(dt.isoformat(), (dt + ONE_DAY).isoformat())
        .first()
    )


def save_patch(dt, poi, img):
    dt_str = dt.isoformat()
    poi_name = poi["name"]
    point = ee.Geometry.Point(poi["coord"])

    patch_dict = {}

    for band in BANDS:
        try:
            array = extract_patch(img, point, band).getInfo()
            if array is not None:
                patch_dict[band] = np.array(array).astype(np.float32)
            else:
                patch_dict[band] = None
        except Exception:
            patch_dict[band] = None

    poi_dir = OUTPUT_DIR / poi_name
    poi_dir.mkdir(parents=True, exist_ok=True)

    output_file = poi_dir / f"{dt_str}.npz"
    np.savez_compressed(output_file, **patch_dict)

    return output_file


# ------------------------------
# 7. Main extraction loop
# ------------------------------

d = START_DATE

while d <= END_DATE:
    dt_str = d.isoformat()

    try:
        img = get_daily_image(d)
        img_info = img.getInfo()
    except Exception:
        print(f"Skipped {dt_str}: no image available")
        d += ONE_DAY
        continue

    for poi in tqdm(POI_DATA, desc=dt_str):
        try:
            output_file = save_patch(d, poi, img)
            print(f"Saved: {output_file}")
        except Exception as exc:
            print(f"Failed: {poi['name']} - {dt_str}: {exc}")

    d += ONE_DAY