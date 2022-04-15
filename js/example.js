
import {Room, AirFilter} from './vapourLab.js';

function test(ft2, height, boxes) {

  // AHAM recommends that the CADR of an air filter is about two-thirds of the room floor area, corresponding to a CADR of 666 ft3 min−1 for a 1000 ft2 classroom.
  console.log('');
  console.log('-------------');
  let classroom = new Room(ft2, height);
  let vol = 'Room volume = ft Cubic Feet';
  console.log(vol.replace('ft', classroom.ft3.toString()));

  // At the lowest speed the clean air delivery rate for our Corsi-Rosenthal Box is >600 ft3 min−1 (1,019 m3 h−1) for a median particle diameter of 1.2 microns, demonstrating exceptional performance relative to most commercially available filter-based air cleaners.
  let crBox = new AirFilter(600, 250);
  crBox.units = boxes;
  classroom.filters.push(crBox);

  let r = 'Number of CR-Boxes: Nn';
  console.log(r.replace('Nn', classroom.filters[0].units.toString()));

  r = 'CR-Box Power pw';
  let p = classroom.filters[0].powerLevel * 100;
  console.log(r.replace('pw', p.toString() + '%'));

  let ach = classroom.getACH();
  r = 'ach Air Changes Per Hour';
  console.log(r.replace('ach', ach.toString()));

  ach = 9;
  let n = classroom.getUnitNumber(ach);
  r = 'Nn CR-Boxes to achieve Ach ACH.'.replace('Nn', n.toString());
  r = r.replace('Ach', ach.toString());
  console.log(r);

  // The CR Box is cost efficient, with a cost-normalized CADR of <$0.072/(ft3 min−1).
  console.log('-------------');
  console.log('Test Complete');
}

test(1000, 9, 1);
test(5000, 8, 5);
test(8000, 12, 7);
test(8000, 12, 23);
