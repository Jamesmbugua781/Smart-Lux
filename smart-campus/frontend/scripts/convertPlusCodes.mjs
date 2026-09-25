import openLocationCode from 'open-location-code'

const { OpenLocationCode } = openLocationCode
const decoder = new OpenLocationCode()

const references = {
  nyeri: { latitude: -0.4246, longitude: 36.9528 },
  kingongo: { latitude: -0.438, longitude: 36.97 },
}

const locations = [
  { name: 'Student Services Center', code: 'JX45+VJM', reference: references.nyeri },
  { name: 'Central Library', code: 'JX26+WF', reference: references.nyeri },
  { name: 'Admin & Academic Block', code: 'JX26+XCJ', reference: references.nyeri },
  { name: 'Engineering Faculty', code: 'JX27+F44', reference: references.kingongo },
]

for (const location of locations) {
  const fullCode = decoder.recoverNearest(location.code, location.reference.latitude, location.reference.longitude)
  const area = decoder.decode(fullCode)

  console.log(`${location.name}:`)
  console.log(`  plusCode: ${fullCode}`)
  console.log(`  latitude: ${area.latitudeCenter.toFixed(7)}`)
  console.log(`  longitude: ${area.longitudeCenter.toFixed(7)}`)
}
