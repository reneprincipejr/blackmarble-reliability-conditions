// ============================================================
// Export Visayas GHSL-Masked Daily VNP46A2 DNB-BRDF Statistics
// ============================================================
//
// Output pattern:
// <Region>_DNBBRDF_class<group>_stats.csv
//
// Used by:
// Notebook 04 — Cross-Subgrid Transferability
//
// Expected columns:
// date, NTL_min, NTL_p05, NTL_p25, NTL_median, NTL_p75,
// NTL_p95, NTL_max, NTL_mean, NTL_std, Valid_px,
// NTL_sum, Mean_by_sum
// ============================================================


// ------------------------------
// 1. Configuration
// ------------------------------

var START_DATE = '2012-01-19';
var END_DATE   = '2025-07-22';

var SCALE = 500;
var EXPORT_FOLDER = 'EarthEngineExports';

var gaul = ee.FeatureCollection('FAO/GAUL/2015/level2');
var smod = ee.Image('JRC/GHSL/P2023A/GHS_SMOD_V2-0/2030');

var viirs = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(START_DATE, END_DATE)
  .select([
    'DNB_BRDF_Corrected_NTL',
    'Mandatory_Quality_Flag'
  ]);


// ------------------------------
// 2. Region definitions
// ------------------------------

var regions = [
  {
    name: 'BoholProvince',
    label: 'Bohol Province',
    adm2_codes: [24252],
    zoom: 9
  },
  {
    name: 'CebuProvince',
    label: 'Cebu Province',
    adm2_codes: [24253],
    zoom: 9
  },
  {
    name: 'NegrosIsland',
    label: 'Negros Island',
    adm2_codes: [24251, 24254],
    zoom: 8
  },
  {
    name: 'PanayIsland',
    label: 'Panay Island',
    adm2_codes: [24246, 24247, 24248, 24250],
    zoom: 8
  },
  {
    name: 'SamarLeyte',
    label: 'Samar-Leyte',
    adm2_codes: [
      // Add ADM2 codes here if you are using ADM2 boundaries for Samar-Leyte.
      // If using ADM1 Eastern Visayas instead, keep Samar-Leyte export in the separate ADM1 script.
    ],
    zoom: 8
  }
];


// ------------------------------
// 3. GHSL cumulative mask groups
// ------------------------------

var classCombos = [
  {label: '10-30',   classes: ee.List.sequence(10, 30)},
  {label: '11-30',   classes: ee.List.sequence(11, 30)},
  {label: '12-30',   classes: ee.List.sequence(12, 30)},
  {label: '13-30',   classes: ee.List.sequence(13, 30)},
  {label: '21-30',   classes: ee.List.sequence(21, 30)},
  {label: '22-30',   classes: ee.List.sequence(22, 30)},
  {label: '23-30',   classes: ee.List.sequence(23, 30)},
  {label: '30-only', classes: ee.List([30])}
];


// ------------------------------
// 4. Helper functions
// ------------------------------

function getRegionGeometry(regionSpec) {
  var fc = gaul.filter(ee.Filter.inList('ADM2_CODE', regionSpec.adm2_codes));
  return fc.geometry();
}


function makeGhslMask(classList) {
  return smod
    .remap(classList, ee.List.repeat(1, classList.length()))
    .selfMask();
}


function computeDailyStats(img, regionGeom, mask) {
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
// 5. Export loop
// ------------------------------

regions.forEach(function(regionSpec) {
  if (regionSpec.adm2_codes.length === 0) {
    print('Skipped region with no ADM2 codes:', regionSpec.name);
    return;
  }

  var regionGeom = getRegionGeometry(regionSpec);

  Map.centerObject(regionGeom, regionSpec.zoom);
  Map.addLayer(regionGeom, {color: 'black'}, regionSpec.label);

  classCombos.forEach(function(combo) {
    var classLabel = combo.label;
    var classList = combo.classes;
    var mask = makeGhslMask(classList);

    var pxCount = mask.reduceRegion({
      reducer: ee.Reducer.count(),
      geometry: regionGeom,
      scale: SCALE,
      maxPixels: 1e10
    });

    print(regionSpec.name + ' [' + classLabel + '] GHSL pixel count:', pxCount);

    var dailyStats = viirs.map(function(img) {
      return computeDailyStats(img, regionGeom, mask);
    });

    Export.table.toDrive({
      collection: dailyStats,
      description: regionSpec.name + '_DNBBRDF_class' + classLabel + '_stats',
      folder: EXPORT_FOLDER,
      fileFormat: 'CSV'
    });
  });
});