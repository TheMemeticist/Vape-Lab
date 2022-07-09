/*
$$\    $$\                                    $$\                $$\
$$ |   $$ |                                   $$ |               $$ |
$$ |   $$ |$$$$$$\   $$$$$$\   $$$$$$\        $$ |      $$$$$$\  $$$$$$$\
\$$\  $$  |\____$$\ $$  __$$\ $$  __$$\       $$ |      \____$$\ $$  __$$\
 \$$\$$  / $$$$$$$ |$$ /  $$ |$$$$$$$$ |      $$ |      $$$$$$$ |$$ |  $$ |
  \$$$  / $$  __$$ |$$ |  $$ |$$   ____|      $$ |     $$  __$$ |$$ |  $$ |
   \$  /  \$$$$$$$ |$$$$$$$  |\$$$$$$$\       $$$$$$$$\\$$$$$$$ |$$$$$$$  |
    \_/    \_______|$$  ____/  \_______|      \________|\_______|\_______/
                    $$ |
                    $$ |
                    \__|
*/

class Room {
  constructor(area, height, ach=1, minDistance=6) {
    this.area = area;
    this.height = height;
    this.volume = parseFloat((area * height).toFixed(2));
    // Turn filters on for a third of a day.
    this.dailyUsage = 0.33;
    this.kWh = 0.12; // $$$

    // We need to find the max occupancy for the room.
    // 6^2 to the notion that there is a minimum physical distancing of 6 feet.
    this.distancing = minDistance;
    this.maxOccupants = Math.floor(this.area / this.distancing**2);

    // Define the minimum distance between filters.
    this.filterDistance = this.area / this.distancing**2;
    this.occupants = parseFloat(this.maxOccupants.toFixed(1));
    // See this for more specifications: https://www.engineeringtoolbox.com/number-persons-buildings-d_118.html

    // Amount of Fresh Air needed per occupant.
    this.personCFM = 60; // Cubic Feet per Minute

    // Set baseline ACH value for a room before air filters.
    this.baseACH = ach;
    this.selectedFilter = 0; // Index of filter selected.
    this.filters = [];
  } getACH() {
    // We calculate the number of Air Changes Per Hour for N room filters.
    // The CADR determines the number of equivalent air changes per hour (ACH) achievable in a room of a given size.

    // Get the sum of all filters CADR (per minute).
    let filter = this.filters[this.selectedFilter];
    let cadr = filter.cadr * filter.units;

    // Multiply total CADR (per minute) by 60 to find CADR (per hour).
    cadr = cadr * 60;
    // Divide the sum total of CADR by the volume of the room to find the ACH.
    this.ach =  (cadr / this.volume) + this.baseACH;
    this.ach = this.ach.toFixed(2); // Just two decimals .
    return this.ach;
  } getUnits(desiredACH=6, perOccupant=false, unitMax=false) {
    // Let us calculate the inverse function of getACH().
    // Desired ACH(eACH) -> Filter Units.
    let cadrNeed;
    let filter = this.filters[this.selectedFilter];
    // Since we are estimating units, we can subtract the baseline ACH.
    // The baseline ACH could be provided by filters or a central HVAC systems.
    let eACH = desiredACH - this.baseACH;
    if (perOccupant) {
      cadrNeed = this.occupants * this.personCFM;
      cadrNeed = cadrNeed;
      cadrNeed = cadrNeed - ((this.baseACH * this.volume) / 60);
      filter.units = cadrNeed / filter.cadr;
    } else {
      let dCADR = eACH * this.volume;
      // Convert to per minute.
      dCADR = dCADR / 60;
      filter.units = dCADR / filter.cadr;
    };
    if (unitMax) {
      filter.units = this.maxUnits(filter);
    }
    filter.units = parseFloat(filter.units.toFixed(1));
    return filter.units;
  } maxUnits(f) {
    // Find the max number of units possible for the room space.
    let m;
    if (f.stackable) {
      // Give at least 1 foot of space above stacked fan.
      m = (this.height - 1) / f.size;
      m = m * this.filterDistance;
    } else {
      m = this.filterDistance;
    }
    return m;
  } costEstimate() {

    function yearly(f, use, kWh) {
      // Estimate the annual total cost in USD.
      let hourly = filter.power * (24 * use);
      let totalWattHours = (hourly * 365) * f.units;

      // Find the number of units per year and their total cost.
      let unitCosts = (f.units * f.price[0]) * (1 / f.life);
      let energyCosts = (totalWattHours/1000) * kWh;
      return {
        'cost':(energyCosts + unitCosts).toFixed(2),
        'description':'Yearly  Cost [Unit + Energy]',
        'statement':'Annual cost of filtering your space.',
      };
    }
    function lifetimeComparison(cost) {
      // Compare the cost of filtering the air vs COVID-19 infection.
      let annualInfectionCost = 124000; // USD
      let compare = (cost / annualInfectionCost) * 100;
      let save = 'Just % the lifetime cost of a single COVID-19 infection.';
      save = save.replace('%', compare.toFixed(2).toString() + '%');
      let link = 'https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/conditionsanddiseases/bulletins/prevalenceofongoingsymptomsfollowingcoronaviruscovid19infectionintheuk/3february2022';
      return {
        'statement':save,
        'src':link
      };
    }

    let filter = this.filters[this.selectedFilter];
    let estimate = {
      'year':yearly(filter, this.dailyUsage, this.kWh)
    };
    estimate['lifetime'] = lifetimeComparison(estimate['year']['cost']);

    return estimate;
  }
}

class AirFilter {
  constructor(cleanAirDeliveryRates, powerDraw, unitPrices) {
    this.cadrValues = cleanAirDeliveryRates;
    this.watts = powerDraw;
    // Start your filters on med-power!
    this.setPower(50);
    this.units = 1;

    // Lifetime in years, replace every 6 months in default case.
    this.life = 0.5;

    // Square feet of space needed per unit. Assume box shape.
    this.size = 1.6;

     // Units can be stacked.
    this.stackable = false;
    this.price = unitPrices;
    this.name = 'Generic Air Filter';
  } setPower(power) {
    // Power input levels 0-100
    this.powerLevel = power / 100;
    let p = this.cadrValues[1] * this.powerLevel;

    // CADR based on power input.
    this.cadr = this.cadrValues[0] + p;
    this.power = this.watts[0] + (this.watts[1] * this.powerLevel);
    return this.cadr;
  }
}

export {Room, AirFilter};
