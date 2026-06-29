// ============================================================
// Export Eastern Visayas GHSL-Masked Daily VNP46A2 DNB-BRDF Stats
// ============================================================
//
// Output pattern:
// EasternVisayas_DNBBRDF_<group>_stats.csv
//
// Used by:
// Notebook 03 — Reliability-Qualified NTL–Load Alignment
//
// To use this for Notebook 04 Samar-Leyte transferability,
// change EXPORT_PREFIX from 'EasternVisayas' to 'SamarLeyte'.
// ============================================================


// ------------------------------
// 1. Configuration
// ------------------------------

var START_DATE = '2012-01-19';
var END_DATE   = '2025-07-22';

var SCALE = 500;
var EXPORT_FOLDER = 'EarthEngineExports';
var EXPORT_PREFIX = 'EasternVisayas';

var gaul = ee.FeatureCollection('FAO/GAUL/2015/level1');
var region = gaul.filter(ee.Filter.eq('ADM1_CODE', 2364));
var regionGeom = region.geometry();

var smod = ee.Image('JRC/GHSL/P2023A/GHS_SMOD_V2-0/2030');

var viirs = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(START_DATE, END_DATE)
  .select([
    'DNB_BRDF_Corrected_NTL',
    'Mandatory_Quality_Flag'
  ]);

Map.centerObject(regionGeom, 8);
Map.addLayer(region, {color: 'black'}, 'Eastern Visayas');
Map.addLayer(smod.clip(regionGeom), {}, 'GHSL-SMOD 2030');


// ------------------------------
// 2. GHSL cumulative mask groups
// ------------------------------

var classCombos = [
  {label: '10-30', classes: ee.List.sequence(10, 30)},
  {label: '11-30', classes: ee.List.sequence(11, 30)},
  {label: '12-30', classes: ee.List.sequence(12, 30)},
  {label: '13-30', classes: ee.List.sequence(13, 30)},
  {label: '21-30', classes: ee.List.sequence(21, 30)},
  {label: '22-30', classes: ee.List.sequence(22, 30)},
  {label: '23-30', classes: ee.List.sequence(23, 30)},
  {label: '30',    classes: ee.List([30])}
];


// ------------------------------
// 3. Helper functions
// ------------------------------

function makeGhslMask(classList) {
  return smod
    .remap(classList, ee.List.repeat(1, classList.length()))
    .selfMask();
}


function computeDailyStats(img, mask) {
  var date = img.date().format('YYYY-MM-dd');

  var hq = img.select('Mandatory_Quality_Flag').eq(0);

  var dnb = img
    .select('DNB_BRDF_Corrected_NTL')
    .updateMask(hq)
    .updateMask(mask);

  var stats = dnb.reduceRegion({
    reducer: ee.Reducer.min()
      .combine(ee.Reducer.max(), '', true)
      .combine(ee.Reducer.median(), '', true)
      .combine(ee.Reducer.percentile([5, 25, 75, 95]), '', true)
      .combine(ee.Reducer.mean(), '', true)
      .combine(ee.Reducer.stdDev(), '', true)
      .combine(ee.Reducer.count(), '', true)
      .combine(ee.Reducer.sum(), '', true),
    geometry: regionGeom,
    scale: SCALE,
    maxPixels: 1e13
  });

  var count = ee.Number(stats.get('DNB_BRDF_Corrected_NTL_count'));
  var sum = ee.Number(stats.get('DNB_BRDF_Corrected_NTL_sum'));

  var meanBySum = ee.Algorithms.If(
    count.gt(0),
    sum.divide(count),
    null
  );

  return ee.Feature(null, {
    date: date,
    NTL_min: stats.get('DNB_BRDF_Corrected_NTL_min'),
    NTL_p05: stats.get('DNB_BRDF_Corrected_NTL_p5'),
    NTL_p25: stats.get('DNB_BRDF_Corrected_NTL_p25'),
    NTL_median: stats.get('DNB_BRDF_Corrected_NTL_median'),
    NTL_p75: stats.get('DNB_BRDF_Corrected_NTL_p75'),
    NTL_p95: stats.get('DNB_BRDF_Corrected_NTL_p95'),
    NTL_max: stats.get('DNB_BRDF_Corrected_NTL_max'),
    NTL_mean: stats.get('DNB_BRDF_Corrected_NTL_mean'),
    NTL_std: stats.get('DNB_BRDF_Corrected_NTL_stdDev'),
    Valid_px: count,
    NTL_sum: sum,
    Mean_by_sum: meanBySum
  });
}


// ------------------------------
// 4. Export loop
// ------------------------------

classCombos.forEach(function(combo) {
  var classLabel = combo.label;
  var classList = combo.classes;
  var mask = makeGhslMask(classList);

  Map.addLayer(mask.clip(regionGeom), {}, 'GHSL mask ' + classLabel, false);

  var pxCount = mask.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: regionGeom,
    scale: SCALE,
    maxPixels: 1e10
  });

  print(EXPORT_PREFIX + ' [' + classLabel + '] GHSL pixel count:', pxCount);

  var dailyStats = viirs.map(function(img) {
    return computeDailyStats(img, mask);
  });

  Export.table.toDrive({
    collection: dailyStats,
    description: EXPORT_PREFIX + '_DNBBRDF_' + classLabel + '_stats',
    folder: EXPORT_FOLDER,
    fileFormat: 'CSV'
  });
});