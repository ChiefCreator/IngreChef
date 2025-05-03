export function getTimeAgo(date: Date, now: Date = new Date(), action: string = "Создан"): string {
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const getMinutesWord = (minutes: number) => {
    if (minutes % 10 === 1 && minutes % 100 !== 11) {
      return 'минуту';
    } else if ((minutes % 10 >= 2 && minutes % 10 <= 4) && (minutes % 100 < 10 || minutes % 100 >= 20)) {
      return 'минуты';
    } else {
      return 'минут';
    }
  }
  const getHoursWord = (hours: number) => {
    if (hours % 10 === 1 && hours % 100 !== 11) {
      return 'час';
    } else if ((hours % 10 >= 2 && hours % 10 <= 4) && (hours % 100 < 10 || hours % 100 >= 20)) {
      return 'часа';
    } else {
      return 'часов';
    }
  }
  const getDaysWord = (days: number) => {
    if (days % 10 === 1 && days % 100 !== 11) {
      return 'день';
    } else if ((days % 10 >= 2 && days % 10 <= 4) && (days % 100 < 10 || days % 100 >= 20)) {
      return 'дня';
    } else {
      return 'дней';
    }
  }

  if (diffInSeconds < 60) {
    return `${action} меньше минуты назад`;
  } else if (diffInMinutes < 60) {
    return `${action} ${diffInMinutes} ${getMinutesWord(diffInMinutes)} назад`;
  } else if (diffInHours < 24) {
    return `${action} ${diffInHours} ${getHoursWord(diffInHours)} назад`;
  } else {
    return `${action} ${diffInDays} ${getDaysWord(diffInDays)} назад`;
  }
}