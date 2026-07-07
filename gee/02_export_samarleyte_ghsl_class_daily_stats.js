// ============================================================
// Samar–Leyte Daily VNP46A2 DNB-BRDF Statistics by GHSL Class
// ============================================================
//
// Output:
// SamarLeyte_DNBBRDF_AllClasses_DailyStats_2012_2024.csv
//
// Used by:
// Notebook 02 — Settlement Observability Diagnostics
//
// Notes:
// - This exports individual GHSL classes, not cumulative groups.
// - Valid NTL pixels are DNB-BRDF pixels with Mandatory_Quality_Flag == 0.
// - Rows with zero valid pixels are dropped before export.
// ============================================================


// ------------------------------
// 1. Configuration
// ------------------------------

var START_DATE = '2012-01-19';
var END_DATE   = '2025-01-01';  // exclusive end date, includes 2024-12-31

var SCALE = 500;
var EXPORT_FOLDER = 'EarthEngineExports';

var EXPORT_NAME = 'SamarLeyte_DNBBRDF_AllClasses_DailyStats_2012_2024';

var GHSL_CLASSES = ee.List([
  10, 11, 12, 13, 21, 22, 23, 30
]);


// ------------------------------
// 2. Region: Eastern Visayas / Samar–Leyte study region
// ------------------------------

var gaul = ee.FeatureCollection('FAO/GAUL/2015/level1');

var samarLeyte = gaul.filter(
  ee.Filter.eq('ADM1_CODE', 2364)
);

var regionGeom = samarLeyte.geometry();

Map.centerObject(regionGeom, 8);
Map.addLayer(samarLeyte, {color: 'black'}, 'Samar–Leyte / Eastern Visayas');


// ------------------------------
// 3. GHSL-SMOD settlement classes
// ------------------------------

var smod = ee.Image('JRC/GHSL/P2023A/GHS_SMOD_V2-0/2030')
  .clip(regionGeom);

Map.addLayer(smod, {}, 'GHSL-SMOD 2030');


// ------------------------------
// 4. VNP46A2 daily collection
// ------------------------------

var viirs = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(START_DATE, END_DATE)
  .select([
    'DNB_BRDF_Corrected_NTL',
    'Mandatory_Quality_Flag'
  ]);

print('Number of VNP46A2 daily images:', viirs.size());


// ------------------------------
// 5. Helper function: daily stats for one class
// ------------------------------

function computeDailyStatsForClass(classCode) {
  classCode = ee.Number(classCode);

  var classMask = smod
    .eq(classCode)
    .selfMask();

  var classPixelCount = classMask.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: regionGeom,
    scale: SCALE,
    maxPixels: 1e10
  });

  print('GHSL class pixel count:', classCode, classPixelCount);

  var perClassDaily = viirs.map(function(img) {
    var dateStr = img.date().format('YYYY-MM-dd');

    var hq = img
      .select('Mandatory_Quality_Flag')
      .eq(0);

    var dnb = img
      .select('DNB_BRDF_Corrected_NTL')
      .updateMask(hq)
      .updateMask(classMask);

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

    var d = ee.Dictionary(stats);

    var count = ee.Number(
      d.get('DNB_BRDF_Corrected_NTL_count', 0)
    );

    var sum = ee.Number(
      d.get('DNB_BRDF_Corrected_NTL_sum', 0)
    );

    var meanBySum = ee.Algorithms.If(
      count.gt(0),
      sum.divide(count),
      null
    );

    return ee.Feature(null, {
      date: dateStr,
      ClassCode: classCode,

      NTL_min: d.get('DNB_BRDF_Corrected_NTL_min', null),
      NTL_p05: d.get('DNB_BRDF_Corrected_NTL_p5', null),
      NTL_p25: d.get('DNB_BRDF_Corrected_NTL_p25', null),
      NTL_median: d.get('DNB_BRDF_Corrected_NTL_median', null),
      NTL_p75: d.get('DNB_BRDF_Corrected_NTL_p75', null),
      NTL_p95: d.get('DNB_BRDF_Corrected_NTL_p95', null),
      NTL_max: d.get('DNB_BRDF_Corrected_NTL_max', null),
      NTL_mean: d.get('DNB_BRDF_Corrected_NTL_mean', null),
      NTL_std: d.get('DNB_BRDF_Corrected_NTL_stdDev', null),
      Valid_px: count,
      NTL_sum: sum,
      Mean_by_sum: meanBySum
    });
  });

  return perClassDaily;
}


// ------------------------------
// 6. Build one combined FeatureCollection
// ------------------------------

var allDaily = ee.FeatureCollection(
  GHSL_CLASSES.map(function(classCode) {
    return computeDailyStatsForClass(classCode);
  })
).flatten();

var allDailyNonEmpty = allDaily.filter(
  ee.Filter.gt('Valid_px', 0)
);

print('Preview: all classes, non-empty rows', allDailyNonEmpty.limit(10));


// ------------------------------
// 7. Export one CSV
// ------------------------------

Export.table.toDrive({
  collection: allDailyNonEmpty,
  description: EXPORT_NAME,
  folder: EXPORT_FOLDER,
  fileFormat: 'CSV'
});