# Reliability Conditions for Interpreting Daily NASA Black Marble Nighttime Lights in Cloud-Impacted Tropical Regions

This repository contains the reproducible analysis workflow for the paper:

**Reliability Conditions for Interpreting Daily NASA Black Marble Nighttime Lights in Cloud-Impacted Tropical Regions**  
Rene Jr. L. Principe, Karin Reinke, and Simon Jones

## Scope

This repository supports the reliability-qualified nighttime lights workflow for evaluating when daily NASA Black Marble VNP46A2 observations can be interpreted in cloud-impacted tropical regions.

The workflow reproduces:

1. Pixel-scale observability diagnostics.
2. Settlement-scale observability diagnostics using GHSL SMOD.
3. Reliability-qualified alignment between DNB-BRDF radiance and NGCP sub-grid electricity load.
4. Cross-sub-grid transferability assessment across Samar–Leyte, Bohol, Cebu, Negros, and Panay.

## Repository Structure

- `notebooks/` — ordered reproducibility notebooks.
- `src/` — reusable Python helper functions.
- `gee/` — Google Earth Engine export scripts.
- `config/` — analysis parameters and mask definitions.
- `data/metadata/` — lookup tables and source metadata.
- `data/processed/` — derived analysis-ready tables.
- `outputs/` — manuscript figures and tables.
- `docs/` — data access, workflow, and reproducibility notes.

## Data

NASA Black Marble VNP46A2 and GHSL SMOD source data are not redistributed. NGCP raw hourly load files are not redistributed. Processed analysis-ready outputs are provided subject to source-provider reuse conditions.

## Reproducibility

Create the environment:

```bash
conda env create -f environment.yml
conda activate blackmarble-reliability blackmarble-reliability-conditions
