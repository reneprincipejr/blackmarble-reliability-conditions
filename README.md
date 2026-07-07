# Reliability-Qualified Nighttime Lights for Disaster Recovery Monitoring

**A reproducible workflow for testing when daily NASA Black Marble nighttime lights can be trusted as evidence of disaster disruption and electricity recovery in cloud-impacted tropical regions.**

[![GitHub Pages](https://img.shields.io/badge/Interactive%20Showcase-GitHub%20Pages-blue)](https://reneprincipejr.github.io/blackmarble-reliability-conditions/)
[![NASA Black Marble](https://img.shields.io/badge/Data-NASA%20Black%20Marble-black)](https://blackmarble.gsfc.nasa.gov/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why this repository exists

Satellite images of Earth at night can reveal how disasters disrupt communities. When power systems fail, cities and towns may dim; when electricity returns, lights may recover. This makes nighttime lights a powerful independent signal for disaster impact and recovery monitoring.

But there is a catch.

In tropical regions, clouds, storms, moonlight, atmospheric effects, and missing valid pixels can make daily nighttime light records difficult to interpret. A smooth satellite time series is not automatically reliable. A visible drop in light is not automatically a power outage. A gap-filled value is not always fresh evidence.

This repository asks a practical question:

> **When can daily nighttime lights be trusted as evidence of post-disaster electricity disruption and recovery?**

The workflow answers this by treating **observability as a prerequisite**, not an afterthought. Before nighttime lights are aligned with electricity-load data, each signal is screened using spatial completeness, temporal completeness, dropout duration, pixel-scale variability, settlement structure, and cross-subgrid transferability.

---

## Interactive stakeholder showcase

A general-audience, visual guide to the main figures is available here:

**https://reneprincipejr.github.io/blackmarble-reliability-conditions/**

The showcase is designed for disaster agencies, electricity-sector stakeholders, resilience researchers, and non-specialist audiences. It explains the key figures, how to read them, and why reliability screening matters before using nighttime lights for disaster recovery monitoring.

---

## Research workflow at a glance

![Research schematic showing data inputs, observability gate, and load-alignment gate](docs/assets/figure_2_schematic.png)

The workflow has three gates:

1. **Data inputs** — NASA Black Marble VNP46A2 daily nighttime lights, GHSL settlement classes, and NGCP electricity-load data.
2. **Observability gate** — pixel-scale and settlement-scale diagnostics that test whether enough valid nighttime light observations exist.
3. **Load-alignment gate** — reliability-qualified NTL signals are compared with electricity-load dynamics across thresholds, settlement masks, and subgrids.

![RQ1 workflow summary](docs/assets/rq1_workflow.jpeg)

---

## Key contribution

Most nighttime-light disaster studies ask whether light changed after a disaster. This workflow asks a prior question:

> **Was the satellite observation reliable enough to interpret in the first place?**

The repository demonstrates that daily nighttime lights can support post-disaster electricity recovery analysis, but only under reliability-qualified conditions. In particular:

- direct DNB-BRDF observations should be separated from gap-filled continuity;
- valid-pixel availability must be quantified before interpreting daily signals;
- urban-focused settlement masks generally provide stronger NTL–load alignment;
- stricter spatial-completeness thresholds can improve reliability but reduce temporal coverage;
- optimal thresholds vary by subgrid, so reliability settings should be transferable but not fixed universally.

---

## Study focus

The core study region is **Samar–Leyte / Eastern Visayas, Philippines**, with cross-subgrid transferability tested across:

- Samar–Leyte,
- Cebu,
- Bohol,
- Negros,
- Panay.

The disaster context includes major tropical cyclone events, especially **Typhoon Haiyan / Yolanda**, which made landfall on **8 November 2013**.

---

## Repository structure

```text
.
├── docs/
│   ├── index.html
│   ├── assets/
│   │   ├── figure_2_schematic.png
│   │   └── rq1_workflow.jpeg
│   └── figures/
│       └── interactive HTML figures for GitHub Pages
│
├── gee/
│   ├── 00_export_region8_daily_dnb_stats.js
│   ├── 00_export_vnp46a2_region8_allbands_nov2013.js
│   ├── 02_export_samarleyte_ghsl_class_daily_stats.js
│   ├── 03_export_eastern_visayas_ghsl_masked_daily_stats.js
│   └── 04_export_visayas_ghsl_masked_daily_stats.js
│
├── colab/
│   ├── 01_extract_poi_5x5_npz.py
│   └── 01_compile_poi_patches_to_csv.py
│
├── notebooks/
│   ├── 00_vnp46a2_visual_diagnostics.ipynb
│   ├── 01_poi_observability_diagnostics.ipynb
│   ├── 02_settlement_observability_diagnostics.ipynb
│   ├── 03_reliability_qualified_ntl_load_alignment.ipynb
│   └── 04_cross_subgrid_transferability.ipynb
│
├── outputs/
│   ├── figures/
│   │   ├── main/
│   │   └── supplementary/
│   └── tables/
│       ├── main/
│       └── supplementary/
│
├── datasets/
│   └── README.md
│
├── src/
├── environment.yml
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Notebook guide

| Notebook | Purpose | Main contribution |
|---|---|---|
| `00_vnp46a2_visual_diagnostics.ipynb` | Inspects daily VNP46A2 observations, quality flags, gap-filled layers, and spatial completeness | Shows why direct observations and gap-filled values must be interpreted separately |
| `01_poi_observability_diagnostics.ipynb` | Tests 1×1, 3×3, and 5×5 pixel supports across urban, municipal, and non-settlement POIs | Quantifies pixel-scale stability, dropout, and spatial-support effects |
| `02_settlement_observability_diagnostics.ipynb` | Aggregates DNB-BRDF observations by GHSL-SMOD settlement classes | Shows how observability varies across settlement hierarchy |
| `03_reliability_qualified_ntl_load_alignment.ipynb` | Aligns reliability-qualified NTL with Samar–Leyte NGCP 1 AM electricity load | Identifies threshold and settlement-mask conditions for strongest NTL–load coupling |
| `04_cross_subgrid_transferability.ipynb` | Tests whether reliability conditions transfer across Visayas subgrids | Shows that urban masks transfer well, while optimal spatial-completeness thresholds vary |

Run notebooks in numerical order.

---

## Data inputs

Raw and intermediate datasets are **not committed** to this repository. The analysis expects local data under `datasets/`.

| Dataset | Use | Repository status |
|---|---|---|
| NASA Black Marble VNP46A2 | Daily DNB-BRDF radiance, gap-filled radiance, retrieval age, and quality flags | Not redistributed |
| GHSL-SMOD | Settlement masks and thematic aggregation groups | Not redistributed |
| NGCP electricity load | Independent subgrid electricity-load reference | Not redistributed |
| Derived tables and figures | Manuscript-ready outputs | Stored under `outputs/` and selected `docs/figures/` |

Expected local dataset folders include:

```text
datasets/
├── vnp46a2/
│   ├── region8_allbands_nov2013/
│   ├── region8_daily_stats/
│   ├── poi_patches_5x5/
│   ├── poi_patch_tables/
│   ├── settlement_daily_stats/
│   ├── ev_ghsl_masked_groups/
│   └── visayas_ghsl_masked_groups/
└── ngcp/
```

See `datasets/README.md` for expected local data placement.

---

## Outputs

Main manuscript outputs are exported to:

```text
outputs/figures/main/
outputs/tables/main/
```

Supplementary and diagnostic outputs are exported to:

```text
outputs/figures/supplementary/
outputs/tables/supplementary/
```

Interactive stakeholder-facing HTML outputs are copied to:

```text
docs/figures/
```

The file naming convention is:

| Prefix | Meaning |
|---|---|
| `fig_03_*`, `fig_04_*` | Main manuscript figures |
| `table_02_*`, `table_04_*` | Main manuscript tables |
| `fig_s1_*`, `fig_s3_*` | Supplementary figures |
| `table_s2_*`, `table_s10_*` | Supplementary tables |
| `fig_sx_*`, `table_sx_*` | Additional exploratory or diagnostic outputs |

---

## Reproducibility

### Option 1 — Conda

```bash
conda env create -f environment.yml
conda activate blackmarble-reliability
python -m ipykernel install --user --name blackmarble-reliability --display-name "Python (blackmarble-reliability)"
```

### Option 2 — Python virtual environment

If the repository is inside OneDrive, use `--copies` to avoid symlink problems:

```bash
python3 -m venv --copies .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m ipykernel install --user --name blackmarble-reliability --display-name "Python (blackmarble-reliability)"
```

Then launch:

```bash
jupyter lab
```

---

## Google Earth Engine and Colab scripts

The `gee/` and `colab/` folders contain the scripts used to generate the local input datasets.

| Folder | Purpose |
|---|---|
| `gee/` | JavaScript scripts for Google Earth Engine exports |
| `colab/` | Python scripts for Earth Engine patch extraction and POI table compilation |

GEE exports should be downloaded from Google Drive and placed under the relevant `datasets/vnp46a2/` folder. Large raw datasets, CSV exports, TIFFs, and NPZ files should remain local and should not be committed.

---

## GitHub Pages showcase

The public-facing showcase is stored in:

```text
docs/
```

It includes:

- `docs/index.html` — landing page,
- `docs/assets/` — schematic and workflow images,
- `docs/figures/` — selected interactive HTML figures and thumbnails.

To preview locally:

```bash
python -m http.server 8000 --directory docs
```

Then open:

```text
http://localhost:8000
```

---

## How to cite or describe this repository

This repository supports a research workflow on reliability-qualified nighttime lights for post-disaster electricity recovery monitoring. It is designed as a reproducible companion to the manuscript and as a public-facing demonstration of how satellite observations can be screened before disaster interpretation.

Suggested short description:

> This repository provides a reliability-qualified workflow for interpreting daily NASA Black Marble nighttime lights as a proxy for post-disaster electricity disruption and recovery in tropical, cloud-impacted regions.

---

## Limitations

This workflow does not treat nighttime lights as a standalone measure of recovery. Nighttime light signals can be affected by clouds, lighting technology, land use, population movement, sensor quality, and non-electricity sources of illumination.

The outputs should therefore be interpreted alongside electricity-load data, outage reports, damage assessments, field information, and local knowledge.

---

## License

Code in this repository is released under the MIT License unless otherwise stated.

Data remain subject to the terms and conditions of their original providers.

---

## Contact

**Rene L. Principe Jr.**  
PhD Candidate, Geospatial Sciences  
RMIT University

