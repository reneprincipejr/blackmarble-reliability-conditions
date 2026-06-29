// ============================================================
// Export Eastern Visayas Region-Wide Daily VNP46A2 DNB-BRDF Stats
// ============================================================
//
// Output:
// EasternVisayas_DNBBRDF_daily_stats.csv
//
// Used by:
// Notebook 00 — VNP46A2 Visual Diagnostics
// ============================================================


// ------------------------------
// 1. Configuration
// ------------------------------

var START_DATE = '2012-01-19';
var END_DATE   = '2025-07-22';

var SCALE = 500;
var EXPORT_FOLDER = 'EarthEngineExports';

var gaul = ee.FeatureCollection('FAO/GAUL/2015/level1');
var region8 = gaul.filter(ee.Filter.eq('ADM1_CODE', 2364));
var regionGeom = region8.geometry();

var viirs = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(START_DATE, END_DATE)
  .select([
    'DNB_BRDF_Corrected_NTL',
    'Mandatory_Quality_Flag'
  ]);

Map.centerObject(regionGeom, 8);
Map.addLayer(region8, {color: 'black'}, 'Eastern Visayas');


// ------------------------------
// 2. Daily statistics
// ------------------------------

var dailyStats = viirs.map(function(img) {
  var date = img.date().format('YYYY-MM-dd');

  var hq = img.select('Mandatory_Quality_Flag').eq(0);

  var dnb = img
    .select('DNB_BRDF_Corrected_NTL')
    .updateMask(hq);

  var stats = dnb.reduceRegion({
    reducer: ee.Reducer.mean()
      .combine(ee.Reducer.stdDev(), '', true)
      .combine(ee.Reducer.count(), '', true)
      .combine(ee.Reducer.sum(), '', true)
      .combine(ee.Reducer.min(), '', true)
      .combine(ee.Reducer.max(), '', true)
      .combine(ee.Reducer.median(), '', true)
      .combine(ee.Reducer.percentile([5, 25, 75, 95]), '', true),
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
    NTL_mean: stats.get('DNB_BRDF_Corrected_NTL_mean'),
    NTL_std: stats.get('DNB_BRDF_Corrected_NTL_stdDev'),
    Valid_px: count,
    NTL_sum: sum,
    Mean_by_sum: meanBySum,
    NTL_min: stats.get('DNB_BRDF_Corrected_NTL_min'),
    NTL_max: stats.get('DNB_BRDF_Corrected_NTL_max'),
    NTL_median: stats.get('DNB_BRDF_Corrected_NTL_median'),
    NTL_p05: stats.get('DNB_BRDF_Corrected_NTL_p5'),
    NTL_p25: stats.get('DNB_BRDF_Corrected_NTL_p25'),
    NTL_p75: stats.get('DNB_BRDF_Corrected_NTL_p75'),
    NTL_p95: stats.get('DNB_BRDF_Corrected_NTL_p95')
  });
});

print('Daily DNB-BRDF stats preview:', dailyStats.limit(5));


// ------------------------------
// 3. Export
// ------------------------------

Export.table.toDrive({
  collection: dailyStats,
  description: 'EasternVisayas_DNBBRDF_daily_stats',
  folder: EXPORT_FOLDER,
  fileFormat: 'CSV'
});