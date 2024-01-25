import AsyncStorage from '@react-native-async-storage/async-storage';
import simpleLogger from './Logger';

const getData = async (dataType) => {
  simpleLogger('HELPER', `Getting ${dataType}`);
  switch (dataType) {
    case 'yourZone':
    case 'yourSettings':
      try {
        const value = await AsyncStorage.getItem(dataType);
        // simpleLogger(`Value of ${dataType}:`, value);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        // Error retrieving data
        simpleLogger('HELPER', error);
      }
      break;
    case 'yourTimes':
    case 'bgTimesData':
    case 'yourData':
      try {
        const jsonData = await AsyncStorage.getItem(dataType);
        return jsonData !== null ? JSON.parse(jsonData) : null;
      } catch (error) {
        // Error retrieving data
        simpleLogger('HELPER', error);
      }
      break;
    default:
      simpleLogger('HELPER', 'No data type found');
      break;
  }
};

const storeData = async (dataType, value) => {
  simpleLogger('HELPER', `Storedata function: ${dataType}`);
  switch (dataType) {
    case 'yourZone':
    case 'yourSettings':
      try {
        await AsyncStorage.setItem(dataType, value);
      } catch (error) {
        // Error saving data
        simpleLogger('HELPER', error);
      }
      break;
    case 'yourTimes':
    case 'bgTimesData':
    case 'yourData':
      try {
        // const currentData = await getData('yourData');
        const jsonData = JSON.stringify(value);
        await AsyncStorage.setItem(dataType, jsonData);
      } catch (error) {
        // Error saving data
        simpleLogger('HELPER', error);
      }
      break;
    default:
      simpleLogger('HELPER', 'No data type found');
      break;
  }
};

const hardReset = async () => {
  try {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('yourSettings', 'off');
    simpleLogger('HELPER', 'Done clearing storage');
  } catch (error) {
    // clear error
    simpleLogger('HELPER', error);
  }
};

const getDateFromHours = (timeString) => {
  const time = timeString.split(':');
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
};

const getDateFromHoursAndAdd1Day = (timeString) => {
  const time = timeString.split(':');
  const tomorrow = new Date(Date.now() + 3600 * 1000 * 24);
  return new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    ...time
  );
};

const getTimeDifference = async (times) => {
  const timeNow = new Date();
  const fajrTime = await getDateFromHours(times.data[0].fajr);
  const sunriseTime = await getDateFromHours(times.data[0].syuruk);
  const dhuhrTime = await getDateFromHours(times.data[0].dhuhr);
  const asrTime = await getDateFromHours(times.data[0].asr);
  const maghribTime = await getDateFromHours(times.data[0].maghrib);
  const ishaTime = await getDateFromHours(times.data[0].isha);
  const tomorrowsFajrTime = await getDateFromHoursAndAdd1Day(
    times.data[0].fajr
  );
  let timeDifference = {};
  if (timeNow >= fajrTime) {
    timeDifference.status = 'fajr has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Subuh: fajrTime - timeNow,
    };
    timeDifference.status = 'time for tahajjud';
  }
  if (timeNow >= sunriseTime) {
    timeDifference.status = 'sunrise has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Syuruk: sunriseTime - timeNow,
    };
  }
  if (timeNow >= dhuhrTime) {
    timeDifference.status = 'dhuhr has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Zuhur: dhuhrTime - timeNow,
    };
  }
  if (timeNow >= asrTime) {
    timeDifference.status = 'asr has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Asar: asrTime - timeNow,
    };
  }
  if (timeNow >= maghribTime) {
    timeDifference.status = 'maghrib has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Maghrib: maghribTime - timeNow,
    };
  }
  if (timeNow >= ishaTime) {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      tomorrowsSubuh: tomorrowsFajrTime - timeNow,
    };
    timeDifference.status = 'isha has started';
  } else {
    timeDifference.solatETA = {
      ...timeDifference.solatETA,
      Isha: ishaTime - timeNow,
    };
  }
  timeDifference = {
    ...timeDifference,
  };

  return timeDifference;
};

const timeReminder = async (times) => {
  const timeDifference = await getTimeDifference(times);
  const timeReminder = {};
  switch (timeDifference.status) {
    case 'fajr has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Syuruk
      );
      timeReminder.nextSolat = {
        ...timeReminder.nextSolat,
        name: 'isyraq',
      };
      break;
    case 'sunrise has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Zuhur
      );
      if (new Date().getDay() === 5) {
        timeReminder.nextSolat = {
          ...timeReminder.nextSolat,
          name: 'jumaat',
        };
      } else {
        timeReminder.nextSolat = {
          ...timeReminder.nextSolat,
          name: 'dhuhr',
        };
      }
      break;
    case 'dhuhr has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Asar
      );
      timeReminder.nextSolat = { ...timeReminder.nextSolat, name: 'asr' };
      break;
    case 'asr has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Maghrib
      );
      timeReminder.nextSolat = {
        ...timeReminder.nextSolat,
        name: 'maghrib',
      };
      break;
    case 'maghrib has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Isha
      );
      timeReminder.nextSolat = { ...timeReminder.nextSolat, name: 'isha' };
      break;
    case 'isha has started':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.tomorrowsSubuh
      );
      timeReminder.nextSolat = {
        ...timeReminder.nextSolat,
        name: 'fajr',
      };
      break;
    case 'time for tahajjud':
      timeReminder.nextSolat = await convertMstoHours(
        timeDifference.solatETA.Subuh
      );
      timeReminder.nextSolat = { ...timeReminder.nextSolat, name: 'fajr' };
      break;
    default:
      timeReminder.status = 'is it judgment day?';
      break;
  }

  return timeReminder;
};

const convertMstoHours = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

const intepretHijriMonth = (month) => {
  switch (month) {
    case '01':
      return 'Muharram';
    case '02':
      return 'Safar';
    case '03':
      return 'Rabiul Awal';
    case '04':
      return 'Rabiul Akhir';
    case '05':
      return 'Jumadil Awal';
    case '06':
      return 'Jumadil Akhir';
    case '07':
      return 'Rajab';
    case '08':
      return 'Syaban';
    case '09':
      return 'Ramadhan';
    case '10':
      return 'Syawal';
    case '11':
      return 'Zulkaedah';
    case '12':
      return 'Zulhijjah';
    default:
      return 'Error';
  }
};

const intepretChristMonth = (month) => {
  switch (month) {
    case 'Jan':
      return 'Januari';
    case 'Feb':
      return 'Februari';
    case 'Mar':
      return 'Mac';
    case 'Apr':
      return 'April';
    case 'May':
      return 'Mei';
    case 'Jun':
      return 'Jun';
    case 'Jul':
      return 'Julai';
    case 'Aug':
      return 'Ogos';
    case 'Sep':
      return 'September';
    case 'Oct':
      return 'Oktober';
    case 'Nov':
      return 'November';
    case 'Dec':
      return 'Disember';
    default:
      return 'Error';
  }
};

const intepretDay = (day) => {
  switch (day) {
    case 'Sunday':
      return 'Ahad';
    case 'Monday':
      return 'Isnin';
    case 'Tuesday':
      return 'Selasa';
    case 'Wednesday':
      return 'Rabu';
    case 'Thursday':
      return 'Khamis';
    case 'Friday':
      return 'Jumaat';
    case 'Saturday':
      return 'Sabtu';
    default:
      return 'Error';
  }
};

const intepretHijriDate = (date) => {
  const day = date.substring(8, 10);
  const month = date.substring(5, 7);
  const year = date.substring(0, 4);
  const hijriMonth = intepretHijriMonth(month);
  if (day.includes('0', 0) && !day.includes('0', 1)) {
    day = day.slice(1, 2);
  }
  return `${day} ${hijriMonth} ${year}`;
};

const intepretChristDate = (date) => {
  const day = date.substring(0, 2);
  const month = date.substring(3, 6);
  const year = date.substring(7, 11);
  const christMonth = intepretChristMonth(month);
  if (day.includes('0', 0) && !day.includes('0', 1)) {
    day = day.slice(1, 2);
  }
  return `${day} ${christMonth} ${year}`;
};

module.exports = {
  getTimeDifference,
  timeReminder,
  intepretHijriDate,
  intepretChristDate,
  intepretDay,
  hardReset,
  getData,
  storeData,
};
