// ____   ____                                   .____          ___.
// \   \ /   /____  ______   ____  __ _________  |    |   _____ \_ |__
//  \   Y   /\__  \ \____ \ /  _ \|  |  \_  __ \ |    |   \__  \ | __ \
//   \     /  / __ \|  |_> >  <_> )  |  /|  | \/ |    |___ / __ \| \_\ \
//    \___/  (____  /   __/ \____/|____/ |__|    |_______ (____  /___  /
//                \/|__|                                 \/    \/    \/


class Room {
  constructor(squareFeet, ceilingHeight, occupants=1) {
    this.ft2 = squareFeet;
    this.ft3 = squareFeet * ceilingHeight;
    this.height = ceilingHeight;
    this.occupants = occupants;
    this.filters = [];
  } getACH() {
    // We calculate the number of Air Changes Per Hour for N room filters.
    // The CADR determines the number of equivalent air changes per hour (ACH) achievable in a room of a given size.

    // Get the sum of all filters CADR (per minute).
    let cadr = 0;
    this.filters.forEach((filter) => {
      cadr += filter.cadr * filter.units;
    });
    // Multiply total CADR (per minute) by 60 to find CADR (per hour).
    cadr = cadr * 60;
    // Divide the sum total of CADR by the volume of the room to find the ACH.
    this.ach =  cadr / this.ft3;
    this.ach = this.ach.toFixed(2); // Just two decimals .
    return this.ach;
  } getUnitNumber(desiredACH) {
    // Let us calculate the inverse function of getACH().
    // Desired ACH -> Filter Units.
    let tCADR;
    this.filters.forEach((filter) => {
      let dCADR = desiredACH * this.ft3;
      dCADR = dCADR / 60;
      filter.units = dCADR / filter.cadr;
      filter.units = filter.units.toFixed(2);
      tCADR = tCADR + filter.cadr;
    });
    return this.filters[0].units;
  }
}

class AirFilter {
  constructor(CADR, range) {
    this.settings = [CADR, range];
    this.setPower(10); // Start your filters on low-power!
    this.units = 1;
  } setPower(power) {
    // Power input levels 0-100
    this.powerLevel = power / 100;
    let p = this.settings[1] * this.powerLevel;
    this.cadr = this.settings[0] + p; // CADR based on power input.
  }
}

export {Room, AirFilter};
