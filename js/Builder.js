/*
The Warehouse is for building a simple javascript facade over your lab. Using this will make it easier to build a frontend for web.
*/

import {Room, AirFilter} from './Labs.js';
import {catalogue} from './F-Catalogue.js';

class Labratory {
  // Wrapper/Facade for the labratory.
  constructor() {
    this.room = new Room(1024, 8, 1);
    let filter = new AirFilter([200, 179], [67, 31], [70, 40]);
    this.room.filters.push(filter);
    this.room.getACH();
    this.targetACH = 8;
    this.catalogue = catalogue;
  } setSize(area, height) {
    this.room.area = area;
    this.room.height = height;
    this.room.volume = parseFloat((area * height).toFixed(2));
    return this.getRoomValues();
  } getRoomValues() {
    this.room.getUnits(this.targetACH);
    this.room.getACH();
    let filters = this.room.filters[this.room.selectedFilter].units;
    let cost = this.room.costEstimate();
    let vals = {
      'ACH Base':this.room.baseACH,
      'ACH Target':this.targetACH,
      'Area':this.room.area,
      'Height':this.room.height,
      'Volume':this.room.volume,
      'Filters':filters.toFixed(1),
      'Occupants':this.room.occupants,
      'Cost':cost, // Annual USD
    };
    return vals;
  } getFilterValues() {
    let filter = this.room.filters[this.room.selectedFilter];
    let vals = {
      'Model':filter.name,
      'Watts':filter.watts[0],
      'Life':filter.life,
      'Price':filter.price[0],
      'Size':Math.pow(filter.size, 3),
      'Fan Power':filter.powerLevel*100,
      'CADR':filter.cadr,
      'Source':filter.src,
    };
    return vals;
  } selectFilter(index) {
    let newFilter = this.catalogue[index];
    let filter = this.room.filters[this.room.selectedFilter];
    filter.name = newFilter['Model'];
    filter.watts = newFilter['Watts'];
    filter.life = newFilter['Life'];
    filter.price = newFilter['Price'];
    filter.size = newFilter['Size'];
    filter.stackable = newFilter['Stack'];
    filter.cadrValues = newFilter['CADR'];
    filter.src = newFilter['Source'];
    filter.setPower(50);
    return this.getFilterValues();
  }
}

class ControlCenter {
  // User menu wrapper for a vape lab.
  constructor() {
    this.lab = new Labratory();
    this.userInputs = ['Room Settings', 'Filter Settings'];
    console.log('Control Center has been built.');
  } roomSpecs() {
    let ach = '[bACH] Air Change';
    if (this.lab.room.baseACH != 1) {
      ach = ach + 's per Hour.'
    } else {
      ach = ach + ' per Hour.'
    }
    let s = '[cft] Cubic Feet';// + ach;
    s = s.replace('[cft]', this.lab.room.volume.toString());
    s = this.lab.room.volume.toString();
    //s = s.replace('[bACH]', this.lab.room.baseACH.toString());
    return [s];
  }
}
class FilterFactory {
  constructor() {
    this.control = new ControlCenter();
  }
}
export {Labratory, FilterFactory};
