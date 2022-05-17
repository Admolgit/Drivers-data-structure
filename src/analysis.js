const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here

  let output = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
    mostTripsByDriver: {
      name: "",
      email: "",
      phone: "",
      noOfTrips: 0,
      totalAmountEarned: 0,
    },
    highestEarningDriver: {
      name: "",
      email: "",
      phone: "",
      noOfTrips: 0,
      totalAmountEarned: 0,
    },
  };

  let driverIDPropertyMap = {}; // an object to store driverID mapped to their properties
  let tripsByDriver = {}; //object to store number of trips by each driver
  let earnedByDriver = {}; // Object to store driver earned
  let driverVehicleNumbersData = {}; //object to store driverID mapped to their number of vehicles

  const tripData = await getTrips(); 
  let allDriversID = [...new Set(tripData.map((trip) => trip.driverID))];

  let driverIDMap = allDriversID.map(async (driver) => {
    try {

      // Populating the driverID property with all the drivers
      driverIDPropertyMap[driver] = await getDriver(driver);
    } catch (error) {}
  });
  await Promise.all(driverIDMap);

  for (let trip of tripData) {

    let billedAmount = Number(
      parseFloat(String(trip.billedAmount).replace(",", "")).toFixed(2)
    );
    output.billedTotal += billedAmount;
    if (trip.isCash == true) {
      output.cashBilledTotal += billedAmount;
      output.noOfCashTrips++;
    } else {
      output.nonCashBilledTotal += billedAmount;
      output.noOfNonCashTrips++;
    }

    let currentDriverID = trip.driverID;
    if (!driverVehicleNumbersData.hasOwnProperty(currentDriverID)) {
      try {
        let driver = driverIDPropertyMap[currentDriverID];
        driverVehicleNumbersData[currentDriverID] = driver.vehicleID.length;
      } catch (error) {}
    }

    if (tripsByDriver.hasOwnProperty(currentDriverID)) {
      tripsByDriver[currentDriverID]++;
    } else {
      tripsByDriver[trip.driverID] = 1;
    }
    mostTripsDriverID = Object.keys(tripsByDriver).reduce((a, b) =>
      tripsByDriver[a] < tripsByDriver[b] ? b : a
    );
    
    mostTripsDriver = driverIDPropertyMap[mostTripsDriverID];
    
    output.mostTripsByDriver.name = mostTripsDriver.name;
    output.mostTripsByDriver.email = mostTripsDriver.email;
    output.mostTripsByDriver.phone = mostTripsDriver.phone;
    output.mostTripsByDriver.noOfTrips = tripsByDriver[mostTripsDriverID];
    output.mostTripsByDriver.totalAmountEarned = earnedByDriver[mostTripsDriverID];

    if (earnedByDriver.hasOwnProperty(currentDriverID)) {
      earnedByDriver[currentDriverID] += Number(
        parseFloat(String(trip.billedAmount).replace(",", "")).toFixed(2)
      );
    } else {
      earnedByDriver[currentDriverID] = Number(
        parseFloat(String(trip.billedAmount).replace(",", "")).toFixed(2)
      );
    }
    mostEarnedDriverID = Object.keys(earnedByDriver).reduce((a, b) =>
      earnedByDriver[a] < earnedByDriver[b] ? b : a
    );

    mostEarnedDriver = driverIDPropertyMap[mostEarnedDriverID];
    output.highestEarningDriver.name = mostEarnedDriver.name;
    output.highestEarningDriver.email = mostEarnedDriver.email;
    output.highestEarningDriver.phone = mostEarnedDriver.phone;
    output.highestEarningDriver.noOfTrips = tripsByDriver[mostEarnedDriverID];
    output.highestEarningDriver.totalAmountEarned =
      earnedByDriver[mostEarnedDriverID];
  }

  let driverVehicleArray = Object.keys(driverVehicleNumbersData);
  for (let driver of driverVehicleArray) {
    
    if (driverVehicleNumbersData[driver] > 1) {
      output.noOfDriversWithMoreThanOneVehicle++;
    }
  }

  output.billedTotal = Number(output.billedTotal.toFixed(2));
  output.cashBilledTotal = Number(output.cashBilledTotal.toFixed(2));
  output.nonCashBilledTotal = Number(output.nonCashBilledTotal.toFixed(2));
  console.log(output)
  return output;
}

analysis()

module.exports = analysis;