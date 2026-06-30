# Reliability-Qualified Nighttime Lights for Disaster Recovery Monitoring

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21051901.svg)](https://doi.org/10.5281/zenodo.21051901)

This repository contains the reproducible workflow for evaluating when daily NASA Black Marble nighttime lights can be reliably interpreted as evidence of post-disaster electricity disruption and recovery in cloud-impacted tropical regions.

The study focuses on Samar–Leyte and selected Visayas subgrids in the Philippines, combining daily VIIRS Black Marble VNP46A2 nighttime lights, GHSL settlement classes, and NGCP electricity-load data.

<img width="1440" height="1525" alt="Reliability-qualified nighttime lights schematic" src="https://github.com/user-attachments/assets/a5525ebc-3304-4765-b348-cec6f26fc1e4" />

## Why this matters

Nighttime satellite images can help show how disasters affect communities. When electricity supply is disrupted after a major storm, lights may dim. As power is restored, lights may return. This makes nighttime lights a promising source of evidence for disaster impact and recovery monitoring.

But there is a major limitation: in tropical regions, the satellite does not always see the ground clearly. Clouds, storms, and atmospheric conditions can interrupt direct observations. Some products may also appear continuous because missing observations are gap-filled.

This repository addresses that problem by asking:

> **When can daily nighttime lights be trusted as evidence of disaster impact and electricity recovery?**

The answer is a **reliability-qualified workflow**. Before interpreting nighttime lights, the workflow first checks whether enough valid satellite observations exist to support interpretation.

## Main idea

This workflow treats **observability as a prerequisite**, not an afterthought.

Instead of assuming that every daily nighttime light value is meaningful, the analysis evaluates:

* how much of the region was validly observed,
* how long observation gaps persisted,
* how stable the signal is across pixels and settlement types,
* how direct DNB-BRDF observations compare with Gap-Filled radiance,
* and whether reliability-screened nighttime lights align with independent electricity-load data.

The goal is not to replace ground-based information. The goal is to provide an independent, spatially consistent layer of evidence that can support disaster recovery monitoring when field reports, outage data, or administrative information are delayed or fragmented.

## Interactive showcase

A public-facing guide to selected interactive figures is available here:

**https://reneprincipejr.github.io/blackmarble-reliability-conditions/**

The showcase is written for general stakeholders, including disaster agencies, infrastructure planners, energy analysts, and resilience researchers. It explains how to read the figures, what spatial completeness means, and why nighttime lights should be interpreted only after checking observation reliability.

## What is included

This repository includes:

* reproducible Jupyter notebooks,
* Google Earth Engine scripts for generating satellite-derived inputs,
* Python scripts for POI patch preparation,
* manuscript-ready figures and tables,
* interactive HTML figures,
* documentation for datasets, workflow, notebooks, and reproducibility.

Raw satellite, settlement, and electricity-load datasets are not redistributed. The repository documents the expected local data structure and provides scripts to regenerate derived inputs where possible.

## Notebook workflow

| Notebook                                            | Purpose                                                                                                                |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `00_vnp46a2_visual_diagnostics.ipynb`               | Inspects daily VNP46A2 DNB-BRDF radiance, Gap-Filled radiance, quality flags, retrieval age, and spatial completeness. |
| `01_poi_observability_diagnostics.ipynb`            | Evaluates local observability across selected points of interest using 1×1, 3×3, and 5×5 pixel supports.               |
| `02_settlement_observability_diagnostics.ipynb`     | Evaluates observability across GHSL-SMOD settlement classes.                                                           |
| `03_reliability_qualified_ntl_load_alignment.ipynb` | Tests whether reliability-qualified nighttime lights align with NGCP electricity load for Samar–Leyte.                 |
| `04_cross_subgrid_transferability.ipynb`            | Tests whether reliability conditions transfer across Bohol, Cebu, Negros, Panay, and Samar–Leyte.                      |


## Repository structure

```text
.
├── notebooks/          # Reproducible analysis notebooks
├── gee/                # Google Earth Engine export scripts
├── colab/              # Python/Colab data-preparation scripts
├── outputs/            # Exported figures and tables
├── docs/               # GitHub Pages showcase and documentation
├── datasets/           # Local-only data folder; raw data are not committed
├── environment.yml     # Conda environment
├── requirements.txt    # pip requirements
├── LICENSE
└── README.md
```

## Key concepts

| Term                          | Meaning                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| **DNB-BRDF**                  | Directly observed NASA Black Marble nighttime radiance corrected for viewing and illumination effects.  |
| **Gap-Filled radiance**       | Companion layer that can provide temporal continuity but may not represent a fresh observation.         |
| **Spatial completeness**      | Percentage of valid observed pixels on a given day.                                                     |
| **Temporal completeness**     | Percentage of days retained after applying a spatial completeness threshold.                            |
| **Dropout duration**          | Longest consecutive period without usable direct observations.                                          |
| **Reliability qualification** | Screening nighttime lights for observability before interpreting them as disaster or recovery evidence. |

## Data availability

Raw datasets are not committed to this repository.

The workflow uses:

| Dataset                   | Role                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| NASA Black Marble VNP46A2 | Daily nighttime radiance, Gap-Filled radiance, and quality layers. |
| GHSL-SMOD                 | Settlement classes and thematic aggregation masks.                 |
| NGCP electricity load     | Independent electricity-load reference for alignment testing.      |
| VIIRS-aligned POI patches | Local pixel-scale diagnostics.                                     |

Users reproducing the workflow should place local input files inside `datasets/` following the structure described in:

```text
datasets/README.md
```

## Reproducibility

Create the environment using Conda:

```bash
conda env create -f environment.yml
conda activate blackmarble-reliability
```

Or using pip:

```bash
python -m venv --copies .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Install the Jupyter kernel:

```bash
python -m ipykernel install --user --name blackmarble-reliability --display-name "Python (blackmarble-reliability)"
```

Launch Jupyter:

```bash
jupyter lab
```

Further details are available in:

```text
docs/reproducibility.md
```

## Outputs

Notebook outputs are written to:

```text
outputs/figures/main/
outputs/figures/supplementary/
outputs/tables/main/
outputs/tables/supplementary/
```

Selected interactive HTML figures are copied to:

```text
docs/figures/
```

for the GitHub Pages showcase.

## Main finding

Daily nighttime lights can support disaster recovery monitoring, but only under reliability-qualified conditions.

In practice:

* direct observations should be prioritized over apparent gap-filled continuity,
* valid-pixel coverage must be checked before interpretation,
* urban-focused settlement masks often provide stronger alignment with electricity-load dynamics,
* optimal spatial-completeness thresholds vary by region,
* and transferability is conditional rather than one-size-fits-all.

## Citation

If you use this repository, please cite:

> Principe, R. L. Jr., Reinke, K., & Jones, S. (2026). *Black Marble Reliability Conditions: Reproducible Workflow for Reliability-Qualified Daily Nighttime Lights*. Zenodo. https://doi.org/10.5281/zenodo.21051901

## License

Code in this repository is released under the MIT License unless otherwise stated.

Data remain subject to the terms and conditions of their original providers.

## Contact

**Rene Jr. L. Principe**

PhD Candidate, Geospatial Sciences

RMIT University

s4135723@student.rmit.edu.au
