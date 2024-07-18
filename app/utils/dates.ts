export const convert12To24 = (time12h) => {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (hours === 12) {
    hours = period === "AM" ? 0 : 12;
  } else {
    hours += period === "PM" ? 12 : 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
export const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
};
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${year}-${month}-${day}`;
};
export const formatDateTime = (date, time) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-IN", options);
  return `${formattedDate}, ${time}`;
};
