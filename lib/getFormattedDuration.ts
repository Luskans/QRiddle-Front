import moment from "moment";


export const getFormattedDuration = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);

  const difference = end.diff(start);
  const formattedDuration = moment.utc(difference).format("HH:mm:ss");

  return formattedDuration;
};