const getDateFromHours = async (time) => {
  time = time.split(':');
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
};
const getDateFromHoursAndAdd1Day = async (time) => {
  time = time.split(':');
  let tomorrow = new Date(Date.now() + 3600 * 1000 * 24);
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
    times.data[1].fajr
  );
  const timeDifference = {};
  timeDifference.timeNow = timeNow.toLocaleTimeString();
  if (timeNow >= fajrTime) {
    timeDifference.status = 'fajr has started';
  } else {
    timeDifference.fajr = fajrTime - timeNow;
  }
  if (timeNow >= sunriseTime) {
    timeDifference.status = 'sunrise has started';
  } else {
    timeDifference.sunrise = sunriseTime - timeNow;
  }
  if (timeNow >= dhuhrTime) {
    timeDifference.status = 'dhuhr has started';
  } else {
    timeDifference.dhuhr = dhuhrTime - timeNow;
  }
  if (timeNow >= asrTime) {
    timeDifference.status = 'asr has started';
  } else {
    timeDifference.asr = asrTime - timeNow;
  }
  if (timeNow >= maghribTime) {
    timeDifference.status = 'maghrib has started';
  } else {
    timeDifference.maghrib = maghribTime - timeNow;
  }
  if (timeNow >= ishaTime) {
    timeDifference.status = 'isha has started';
    timeDifference.tomorrowsFajrTime = tomorrowsFajrTime - timeNow;
  } else {
    timeDifference.isha = ishaTime - timeNow;
  }
  return timeDifference;
};
const timeReminder = async (times) => {
  const timeDifference = await getTimeDifference(times);
  const timeReminder = {};
  switch (timeDifference.status) {
    case 'fajr has started':
      timeReminder.nextSolah = await convertMstoHours(timeDifference.sunrise);
      break;
    case 'sunrise has started':
      timeReminder.nextSolah = await convertMstoHours(timeDifference.dhuhr);
      break;
    case 'dhuhr has started':
      timeReminder.nextSolah = await convertMstoHours(timeDifference.asr);
      break;
    case 'asr has started':
      timeReminder.nextSolah = await convertMstoHours(timeDifference.maghrib);
      break;
    case 'maghrib has started':
      timeReminder.nextSolah = await convertMstoHours(timeDifference.isha);
      break;
    case 'isha has started':
      timeReminder.nextSolah = await convertMstoHours(
        timeDifference.tomorrowsFajrTime
      );
      break;
    default:
      timeReminder.status = 'time is not started';
      break;
  }
  return timeReminder;
};
const convertMstoHours = async (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
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

module.exports = {
  timeReminder,
  intepretHijriDate,
  intepretChristDate,
  intepretDay,
};
