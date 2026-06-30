# Dataset Manifest

This repository does not redistribute raw provider datasets. The workflow uses public or provider-managed datasets and exports derived analysis tables used in the manuscript.

| Dataset | Source | Use | Redistribution status |
|---|---|---|---|
| NASA Black Marble VNP46A2 | Google Earth Engine asset `NASA/VIIRS/002/VNP46A2` | Daily DNB-BRDF radiance, gap-filled comparison, quality flags, spatial completeness | Not redistributed; accessed through GEE |
| GHSL SMOD R2023A | European Commission Joint Research Centre | Settlement stratification and cumulative GHSL thematic masks | Not redistributed; derived masks/statistics only |
| NGCP hourly demand | National Grid Corporation of the Philippines Operations portal | Independent sub-grid electricity load reference | Original files not redistributed; derived alignment tables and metadata provided |
| POI metadata | Author-generated | Pixel- and kernel-scale observability diagnostics | Included |
| Derived output tables | Author-generated | Manuscript and supplementary figures/tables | Included in `outputs/tables/` |

## Required local paths

Place local input files in:

datasets/raw/ngcp/
datasets/raw/boundaries/
datasets/intermediate/
datasets/processed/

Raw data folders are ignored by Git. Processed manuscript-supporting outputs are provided in `outputs/tables/`.
