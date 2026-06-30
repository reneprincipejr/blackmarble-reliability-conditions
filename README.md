# Reliability-Qualified Nighttime Lights for Disaster Impact and Recovery Analysis
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21051901.svg)](https://doi.org/10.5281/zenodo.21051901)

This repository contains the reproducible analysis workflow for a journal paper evaluating when daily NASA Black Marble nighttime lights can be reliably interpreted as a proxy for post-disaster electricity disruption and recovery in cloud-impacted tropical regions.

The analysis focuses on Samar–Leyte, Philippines, and combines daily VIIRS Black Marble VNP46A2 nighttime lights, GHSL settlement classes, and NGCP electricity load data.

## Repository Scope

This repository supports the RQ1 workflow of the study. It provides code, notebooks, configuration files, and manuscript-ready outputs for:

1. Visual diagnostics of daily VIIRS Black Marble VNP46A2.
2. POI-scale observability diagnostics across 1×1, 3×3, and 5×5 pixel supports.
3. Settlement-scale observability diagnostics using GHSL-SMOD classes.
4. Reliability-qualified NTL–NGCP load alignment across GHSL masks and spatial completeness thresholds.

The repository is intended as a reproducible code companion for the manuscript, not as a redistribution point for raw satellite or electricity-load datasets.

## Workflow

The notebooks follow the manuscript logic:

| Notebook                                            | Description                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `00_vnp46a2_visual_diagnostics.ipynb`               | Introduces DNB-BRDF, Gap-Filled radiance, quality flags, retrieval age, and spatial completeness. |
| `01_poi_observability_diagnostics.ipynb`            | Evaluates local observability and variability across POIs and spatial supports.                   |
| `02_settlement_observability_diagnostics.ipynb`     | Evaluates observability and variability across GHSL settlement classes.                           |
| `03_reliability_qualified_ntl_load_alignment.ipynb` | Tests NTL–NGCP load alignment across GHSL masks and spatial completeness thresholds.              |

## Key Concepts

| Term                      | Meaning                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- |
| DNB-BRDF                  | Directly observed VIIRS Black Marble nighttime radiance.                          |
| Gap-Filled radiance       | Temporally propagated companion product used as a comparator.                     |
| Spatial completeness, SC  | Percentage of valid observed pixels on a given day.                               |
| Temporal completeness, TC | Percentage of days retained after applying an SC threshold.                       |
| Reliability qualification | Screening NTL observations using observability diagnostics before interpretation. |
| GHSL mask                 | Settlement-based aggregation support derived from GHSL-SMOD classes.              |

## Repository Structure

```text
.
├── notebooks/
│   ├── 00_vnp46a2_visual_diagnostics.ipynb
│   ├── 01_poi_observability_diagnostics.ipynb
│   ├── 02_settlement_observability_diagnostics.ipynb
│   └── 03_reliability_qualified_ntl_load_alignment.ipynb
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
├── requirements.txt
├── environment.yml
├── .gitignore
└── README.md
```

## Data Availability

Raw datasets are not committed to this repository.

The workflow uses the following data sources:

| Dataset                      | Use                                                          | Repository status      |
| ---------------------------- | ------------------------------------------------------------ | ---------------------- |
| NASA Black Marble VNP46A2    | Daily DNB-BRDF, Gap-Filled radiance, and quality diagnostics | Not redistributed      |
| GHSL-SMOD                    | Settlement class masks and aggregation supports              | Not redistributed      |
| NGCP hourly electricity load | Independent electricity-load reference                       | Not redistributed      |
| Derived outputs              | Manuscript figures, tables, and processed diagnostics        | Exported in `outputs/` |

Users reproducing the workflow should place local input files inside `datasets/` following the paths referenced in the notebooks. The `datasets/` folder is ignored by Git to avoid redistributing large or restricted data.

## Reproducibility

Create the environment using either Conda or pip.

### Option 1: Conda

```bash
conda env create -f environment.yml
conda activate blackmarble-reliability
```

### Option 2: pip / venv

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Launch Jupyter:

```bash
jupyter lab
```

Run notebooks in numerical order.

## Outputs

Main manuscript outputs are exported to:

```text
outputs/figures/main/
outputs/tables/main/
```

Supplementary outputs are exported to:

```text
outputs/figures/supplementary/
outputs/tables/supplementary/
```

Figure and table names follow the manuscript numbering where applicable, for example:

```text
fig_03_*
fig_04_*
table_02_*
fig_s1_*
fig_s3_*
table_s2_*
```

Additional diagnostic outputs use:

```text
fig_sx_*
table_sx_*
```

## Notes on Interpretation

Daily VNP46A2 product availability does not guarantee daily surface observability. In cloud-impacted tropical regions, direct DNB-BRDF observations can be intermittent, and Gap-Filled radiance can create apparent continuity without adding new observations.

The workflow therefore treats observability as a prerequisite for interpretation. NTL signals are evaluated through spatial completeness, temporal completeness, dropout duration, settlement structure, and alignment with independent electricity-load data.

## License

Code in this repository is released under the MIT License unless otherwise stated.

Data remain subject to the terms and conditions of their original providers.

## Citation

If you use this repository, please cite:

> Principe, R. L. Jr., Reinke, K., & Jones, S. (2026). *Black Marble Reliability Conditions: Reproducible Workflow for Reliability-Qualified Daily Nighttime Lights*. Zenodo. https://doi.org/10.5281/zenodo.21051901

