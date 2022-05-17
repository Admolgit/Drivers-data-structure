const { getTrips, getDriver, getVehicle } = require('api');
const drivers = require('api/data/drivers');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
\ * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  result = [
    {
      fullName: "Driver name",
      id: "driver-id",
      phone: "driver phone",
      noOfTrips: 0,
      noOfVehicles: 0,
      vehicles: [
        {
          plate: "vehicle plate no",
          manufacturer: "vehicle manufacturer"
        }
      ],
      noOfCashTrips: 0,
      noOfNonCashTrips: 0,
      totalAmountEarned: 0,
      totalCashAmount: 0,
      totalNonCashAmount: 0,
      trips: [
        {
          user: "User name",
          created: "Date Created",
          pickup: "Pickup address",
          destination: "Destination address",
          billed: 0,
          isCash: true
        }
        // ,... {}, {}
      ]
    }
    // ,...{}, {}
  ]


  const tripsData = await getTrips();

  driversIDs = Object.keys(drivers);
  // Put the trip data into an array of object
  let trips = [...tripsData];

  //Loop through the drivers id
  for(const driver of driversIDs) {
    let driversInfo = await getDriver(driver);
    // Get drivers vehicle info
    let vehicleIDMap = driversInfo.vehicleID.map(vehicle => getVehicle(vehicle));
    // Get trips by each driver
    let tripsByDriver = tripsData.filter(trip => trip.driverID ===  driver);
    let cashTrips = tripsData.filter(trip => trip.isCash === true && trip.driverID === driver);
    let cashTotal = cashTrips.map(trip => parseFloat(`${trip.billedAmount || ''}`.replace(',', ''))).reduce((a, b) => a + b, 0);
    let nonCashTrip = tripsData.filter(trip => trip.isCash === false && trip.driverID === driver);
    let nonCashTotal = nonCashTrip.map(trip => parseFloat(`${trip.billedAmount || ''}`.replace(',', ''))).reduce((a, b) => a + b, 0);
    // Get vehicle info value
    let noOfVehicleValues = vehicleIDMap.map(vehicle => ({
      "plate": vehicle.plate,
      "manufacturer": vehicle.manufacturer
    }));
    // Get the resolved data
    let noOfVehicleValuesResolved = await Promise.all(noOfVehicleValues)
    // console.log(result[0].fullName = driversInfo.name)
    // Populate the information
    result[0].fullName = driversInfo.name;
    result[0].id = driver;
    result[0].phone = driversInfo.phone;
    result[0].noOfTrips = tripsByDriver.length;
    result[0].noOfVehicles = noOfVehicleValues.length;
    result[0].vehicles[0] = noOfVehicleValuesResolved;
    result[0].noOfCashTrips = cashTrips.length;
    result[0].noOfNonCashTrips = nonCashTrip.length;
    result[0].totalAmountEarned = (cashTotal + nonCashTotal).toFixed(2);
    result[0].totalCashAmount = (cashTotal).toFixed(2);
    result[0].totalNonCashAmount = (nonCashTotal).toFixed(2);
    result[0].trips[0].user = tripsByDriver.map(trip => trip.user.name)
    result[0].trips[0].created = tripsByDriver.map(trip => trip.user.created)
    result[0].trips[0].pickup = tripsByDriver.map(trip => trip.pickup.address)
    result[0].trips[0].destination = tripsByDriver.map(trip => trip.destination.address)
    result[0].trips[0].billed = tripsByDriver.map(trip => user = trip.billedAmount)
    result[0].trips[0].isCash = tripsByDriver.map(trip => trip.isCash)
   
  };

  return result;
}
driverReport();
// module.exports = driverReport;