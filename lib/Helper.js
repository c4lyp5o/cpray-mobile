import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async (dataType) => {
  console.log('HELPER: Getting', dataType);
  switch (dataType) {
    case 'yourZone':
      try {
        const value = await AsyncStorage.getItem(dataType);
        // console.log(`Value of ${dataType}:`, value);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
      break;
    case 'yourSettings':
      try {
        const value = await AsyncStorage.getItem(dataType);
        // console.log(`Value of ${dataType}:`, value);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
      break;
    case 'yourTimes':
      try {
        const jsonData = await AsyncStorage.getItem(dataType);
        return jsonData !== null ? JSON.parse(jsonData) : null;
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
      break;
    case 'bgTimesData':
      try {
        const jsonData = await AsyncStorage.getItem(dataType);
        return jsonData !== null ? JSON.parse(jsonData) : null;
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
      break;
    case 'yourData':
      try {
        const jsonData = await AsyncStorage.getItem(dataType);
        return jsonData !== null ? JSON.parse(jsonData) : null;
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
      break;
    default:
      console.log('No data type found');
      break;
  }
};

const storeData = async (dataType, value) => {
  console.log('HELPER: Storedata function:', dataType);
  switch (dataType) {
    case 'yourZone':
      try {
        await AsyncStorage.setItem(dataType, value);
      } catch (error) {
        // Error saving data
        console.log(error);
      }
      break;
    case 'yourSettings':
      try {
        await AsyncStorage.setItem(dataType, value);
      } catch (error) {
        // Error saving data
        console.log(error);
      }
      break;
    case 'yourTimes':
      // console.log(value);
      try {
        const jsonData = JSON.stringify(value);
        await AsyncStorage.setItem(dataType, jsonData);
      } catch (error) {
        // Error saving data
        console.log(error);
      }
      break;
    case 'bgTimesData':
      // console.log(value);
      try {
        const jsonData = JSON.stringify(value);
        await AsyncStorage.setItem(dataType, jsonData);
      } catch (error) {
        // Error saving data
        console.log(error);
      }
      break;
    case 'yourData':
      try {
        // const currentData = await getData('yourData');
        const jsonData = JSON.stringify(value);
        await AsyncStorage.setItem(dataType, jsonData);
      } catch (error) {
        // Error saving data
        console.log(error);
      }
      break;
    default:
      console.log('No data type found');
      break;
  }
};

const hardReset = async () => {
  try {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('yourSettings', 'off');
    console.log('HELPER: Done clearing storage');
  } catch (e) {
    // clear error
    console.log(e);
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
  const prayerTimes = {
    Subuh: getDateFromHours(times.data[0].fajr),
    Syuruk: getDateFromHours(times.data[0].syuruk),
    Zuhur: getDateFromHours(times.data[0].dhuhr),
    Asar: getDateFromHours(times.data[0].asr),
    Maghrib: getDateFromHours(times.data[0].maghrib),
    Isha: getDateFromHours(times.data[0].isha),
    tomorrowsSubuh: getDateFromHoursAndAdd1Day(times.data[0].fajr),
  };

  let timeDifference = { solatETA: {}, status: '' };

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    if (timeNow >= time) {
      timeDifference.status = `${prayer} has started`;
    } else {
      timeDifference.solatETA[prayer] = time - timeNow;
    }
  }

  return timeDifference;
};

const timeReminder = async (times) => {
  const timeDifference = await getTimeDifference(times);
  let timeReminder = {};

  const setNextSolat = async (solatETA, name) => {
    const nextSolat = await convertMstoHours(solatETA);
    timeReminder.nextSolat = { ...nextSolat, name };
  };

  switch (timeDifference.status) {
    case 'fajr has started':
      await setNextSolat(timeDifference.solatETA.Syuruk, 'isyraq');
      break;
    case 'sunrise has started':
      await setNextSolat(
        timeDifference.solatETA.Zuhur,
        new Date().getDay() === 5 ? 'jumaat' : 'dhuhr'
      );
      break;
    case 'dhuhr has started':
      await setNextSolat(timeDifference.solatETA.Asar, 'asr');
      break;
    case 'asr has started':
      await setNextSolat(timeDifference.solatETA.Maghrib, 'maghrib');
      break;
    case 'maghrib has started':
      await setNextSolat(timeDifference.solatETA.Isha, 'isha');
      break;
    case 'isha has started':
      await setNextSolat(timeDifference.solatETA.tomorrowsSubuh, 'fajr');
      break;
    case 'time for tahajjud':
      await setNextSolat(timeDifference.solatETA.Subuh, 'fajr');
      break;
    default:
      timeReminder.status = 'Unknown status';
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
  var day = date.substring(8, 10);
  var month = date.substring(5, 7);
  var year = date.substring(0, 4);
  var hijriMonth = intepretHijriMonth(month);
  if (day.includes('0', 0) && !day.includes('0', 1)) {
    day = day.slice(1, 2);
  }
  return `${day} ${hijriMonth} ${year}`;
};

const intepretChristDate = (date) => {
  var day = date.substring(0, 2);
  var month = date.substring(3, 6);
  var year = date.substring(7, 11);
  var christMonth = intepretChristMonth(month);
  if (day.includes('0', 0) && !day.includes('0', 1)) {
    day = day.slice(1, 2);
  }
  return `${day} ${christMonth} ${year}`;
};

const log = (app, message) => {
  console.log(`${app}: ${message || 'No message provided'}`);
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
  log,
};
