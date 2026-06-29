# Watching Disaster Recovery from Space

## A public guide to reliability-qualified nighttime lights

This page presents interactive figures from a research workflow that uses satellite observations of Earth at night to study disaster disruption and electricity recovery.

The basic idea is simple: when electricity supply is disrupted after a major storm, nighttime lights may dim. As power is restored, lights may return. However, satellite observations are not always clear, especially in tropical regions where clouds, storms, and atmospheric conditions often block or distort what the sensor can observe.

This project asks a practical question:

**When can nighttime lights be trusted as evidence of disaster impact and recovery?**

The answer is not “always.” The key contribution of this work is a reliability-qualified framework. Instead of treating every satellite image as equally useful, the workflow first checks whether enough valid pixels were actually observed.

---

## How to read these figures

### Direct nighttime light signal

The main satellite signal used here is **DNB-BRDF nighttime radiance** from NASA Black Marble. This is the directly observed nightlight signal after correction for viewing and illumination effects.

In the figures, lower radiance generally means less observed light. After disasters, a sharp drop can indicate power interruption, damage, evacuation, or reduced activity.

### Gap-filled signal

Some Black Marble products include a **Gap-Filled** layer. This can be useful for continuity, but it may carry forward information from previous clear observations. That means it can look smooth even when the satellite did not actually observe the ground clearly.

For disaster monitoring, this matters. A smooth line is not always a reliable line.

### Spatial completeness

**Spatial completeness** means the percentage of pixels in a region that were validly observed on a given day.

A high value means the satellite had good usable coverage.  
A low value means much of the region was obscured or unusable.

This is central to the project: nighttime lights should only be interpreted after checking whether the observation was reliable enough.

### Settlement classes

The analysis separates places by settlement type using GHSL-SMOD classes, from urban cores to rural and non-settlement areas. This matters because electricity use, lighting density, and satellite observability differ across settlement types.

Urban cores often provide more stable signals. Rural or low-light areas are more vulnerable to noise, cloud contamination, and weak signal strength.

---

## Key message

**Nighttime lights can support disaster recovery monitoring, but only when observability is treated as a prerequisite.**

The figures below show why this matters.

---

## Interactive Figures

### 1. Regional nighttime lights and spatial completeness

[Open interactive figure](figures/fig_s1_regional_dnb_gapfilled_completeness_2013.html)

This figure compares directly observed nighttime lights with the gap-filled signal around Typhoon Haiyan.

**How to interpret it:**

Look for three things:

1. Whether the directly observed DNB-BRDF signal drops during the disaster period.
2. Whether the gap-filled signal stays smoother than the direct observation.
3. Whether spatial completeness is low during key periods.

A drop in light is more meaningful when spatial completeness is adequate. If spatial completeness is low, the apparent signal may reflect missing observations rather than actual electricity conditions.

---

### 2. Long-term spatial completeness, 2012–2024

[Open interactive figure](figures/fig_s3_spatial_completeness_2012_2024.html)

This figure shows how often the satellite had usable observations across the study period.

**How to interpret it:**

Periods with low spatial completeness indicate days when the satellite record is less reliable for disaster interpretation. Persistent low-observability periods show why daily nighttime lights in tropical regions need reliability screening before being used for monitoring.

This figure helps answer:

**How often can we actually see the ground well enough to interpret nighttime lights?**

---

### 3. Local POI reliability across 1×1, 3×3, and 5×5 pixel supports

[Open interactive figure](figures/fig_04_poi_cv_by_kernel_and_settlement_2013.html)

This figure compares signal variability across points of interest and spatial supports.

**How to interpret it:**

A 1×1 pixel view is highly local but can be noisy. A 3×3 or 5×5 window may be more stable because it averages across nearby pixels. However, larger windows may also mix different land uses.

The figure helps identify whether local nighttime light signals are stable enough for interpretation, especially in urban, municipal, and non-settlement areas.

---

### 4. Nighttime lights versus electricity load

[Open interactive figure](figures/fig_07_ntl_ngcp_zscore_alignment.html)

This figure compares normalized nighttime lights with electricity load.

**How to interpret it:**

When the nighttime light line moves with the electricity-load line, this suggests the satellite signal is capturing real power-system dynamics. Stronger alignment means nighttime lights may be more useful as a proxy for electricity recovery.

The important point is not just whether the lines look similar. The analysis also checks how much valid observation coverage was available before trusting the comparison.

---

### 5. POI dashboard around Typhoon Haiyan

[Open interactive dashboard](figures/fig_sx_interactive_poi_dashboard_2013.html)

This dashboard lets you inspect selected locations around the Haiyan period.

**How to interpret it:**

Compare urban centers, municipal centers, and non-settlement areas. Urban areas may show clearer disaster-related changes, while low-light areas can be harder to interpret because small radiance changes may be dominated by observation noise.

---

## What stakeholders can take from this

For disaster agencies, infrastructure planners, energy analysts, and resilience researchers, this work provides a caution and an opportunity.

The caution is that satellite nighttime lights are not automatically reliable every day. Cloud cover and data gaps can create misleading signals.

The opportunity is that, with reliability screening, nighttime lights can become a practical independent layer of evidence for understanding where disaster impacts and recovery patterns may be visible from space.

---

## Suggested use

Use these figures as a screening and interpretation tool, not as a standalone source of truth.

Nighttime lights are most useful when combined with:

- electricity-load data,
- outage reports,
- field reports,
- damage assessments,
- settlement maps,
- and local knowledge.

The goal is not to replace ground information. The goal is to provide an independent, spatially consistent signal that helps identify where recovery monitoring may need closer attention.

---

## Project repository

This page is part of the reproducible research repository for reliability-qualified nighttime lights analysis.
