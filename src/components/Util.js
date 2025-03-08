export function toTwoDigits(num) {
    return num.toString().padStart(2, "0");
}


export function convertToCardinal(latitude, longitude) {
    // Determine latitude direction
    const latDirection = latitude >= 0 ? "N" : "S";
    const absLat = Math.abs(latitude);
  
    // Determine longitude direction
    const lonDirection = longitude >= 0 ? "E" : "W";
    const absLon = Math.abs(longitude);
  
    // Convert to degrees, minutes, and seconds
    const decimalToDMS = (decimalValue) => {
      const degrees = Math.floor(decimalValue);
      const minutesFull = (decimalValue - degrees) * 60;
      const minutes = Math.floor(minutesFull);
      const seconds = Math.round((minutesFull - minutes) * 60);
      return { degrees, minutes, seconds };
    };
  
    const latDMS = decimalToDMS(absLat);
    const lonDMS = decimalToDMS(absLon);
  
    // Format the result
    const latitudeStr = `${toTwoDigits(latDMS.degrees)}°${toTwoDigits(latDMS.minutes)}'${toTwoDigits(latDMS.seconds)}"${latDirection}`;
    const longitudeStr = `${toTwoDigits(lonDMS.degrees)}°${toTwoDigits(lonDMS.minutes)}'${toTwoDigits(lonDMS.seconds)}"${lonDirection}`;
  
    return `${latitudeStr} ${longitudeStr}`;
  };