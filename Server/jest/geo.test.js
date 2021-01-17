import { computeGeoDistance } from '../src/services/helpers/geo';

test('Compute geo distance', () => {
    let paris = {lat: 48.864716, lon: 2.349014};
    let sydney = {lat: -33.865143, lon: 151.209900};
    console.log(computeGeoDistance(paris.lat, paris.lon, sydney.lat, sydney.lon))
    expect(computeGeoDistance(paris.lat, paris.lon, sydney.lat, sydney.lon)).toBe(16960.150734043713);
});