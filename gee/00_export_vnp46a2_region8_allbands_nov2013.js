// ============================================================
// Export Daily VNP46A2 Multi-Band GeoTIFFs for Eastern Visayas
// November 2013
// ============================================================
//
// Output pattern:
// VNP46A2_Region8_YYYYMMDD.tif
//
// Used by:
// Notebook 00 — VNP46A2 Visual Diagnostics
//
// Required bands:
// DNB_BRDF_Corrected_NTL
// DNB_Lunar_Irradiance
// Gap_Filled_DNB_BRDF_Corrected_NTL
// Latest_High_Quality_Retrieval
// Mandatory_Quality_Flag
// QF_Cloud_Mask
// Snow_Flag
// ============================================================


// ------------------------------
// 1. Configuration
// ------------------------------

var START_DATE = '2013-11-01';
var END_DATE   = '2013-12-01';  // exclusive end date

var SCALE = 500;
var EXPORT_FOLDER = 'EarthEngineExports';

var BANDS = [
  'DNB_BRDF_Corrected_NTL',
  'DNB_Lunar_Irradiance',
  'Gap_Filled_DNB_BRDF_Corrected_NTL',
  'Latest_High_Quality_Retrieval',
  'Mandatory_Quality_Flag',
  'QF_Cloud_Mask',
  'Snow_Flag'
];


// ------------------------------
// 2. Region: Eastern Visayas
// ------------------------------

var gaul = ee.FeatureCollection('FAO/GAUL/2015/level1');

var region8 = gaul.filter(
  ee.Filter.eq('ADM1_CODE', 2364)
);

var regionGeom = region8.geometry();

Map.centerObject(regionGeom, 8);
Map.addLayer(region8, {color: 'black'}, 'Eastern Visayas');


// ------------------------------
// 3. VNP46A2 collection
// ------------------------------

var col = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(START_DATE, END_DATE)
  .select(BANDS);

print('Number of daily images:', col.size());
print('First image:', col.first());


// ------------------------------
// 4. Preview one sample day
// ------------------------------

var sampleDate = '2013-11-10';

var sample = ee.ImageCollection('NASA/VIIRS/002/VNP46A2')
  .filterDate(sampleDate, ee.Date(sampleDate).advance(1, 'day'))
  .select(BANDS)
  .first();

Map.addLayer(
  sample.select('DNB_BRDF_Corrected_NTL').clip(regionGeom),
  {min: 0, max: 10},
  'DNB-BRDF sample ' + sampleDate
);

Map.addLayer(
  sample.select('Gap_Filled_DNB_BRDF_Corrected_NTL').clip(regionGeom),
  {min: 0, max: 10},
  'Gap-Filled sample ' + sampleDate,
  false
);

Map.addLayer(
  sample.select('Mandatory_Quality_Flag').clip(regionGeom),
  {min: 0, max: 2, palette: ['green', 'orange', 'red']},
  'MQF sample ' + sampleDate,
  false
);


// ------------------------------
// 5. Export each day as GeoTIFF
// ------------------------------

var nDays = ee.Date(END_DATE).difference(ee.Date(START_DATE), 'day');

var dateList = ee.List.sequence(0, nDays.subtract(1)).map(function(dayOffset) {
  return ee.Date(START_DATE).advance(dayOffset, 'day');
});

dateList.evaluate(function(dates) {
  dates.forEach(function(dateValue) {
    var date = ee.Date(dateValue);
    var dateString = date.format('YYYYMMdd').getInfo();

    var img = col
      .filterDate(date, date.advance(1, 'day'))
      .first()
      .select(BANDS)
      .clip(regionGeom);

    Export.image.toDrive({
      image: img,
      description: 'VNP46A2_Region8_' + dateString,
      folder: EXPORT_FOLDER,
      fileNamePrefix: 'VNP46A2_Region8_' + dateString,
      region: regionGeom,
      scale: SCALE,
      maxPixels: 1e13,
      fileFormat: 'GeoTIFF'
    });
  });
});