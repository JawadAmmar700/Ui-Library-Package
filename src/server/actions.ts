"use Server";

export const getSunSetAndSunRise = async (lat: string, lng: string) => {
  // TODO: Implement this function
  const url = "https://api.sunrisesunset.io/json";
  const params = {
    lat,
    lng,
  };

  // set search parameters
  const searchParams = new URLSearchParams(params);
  const fetchUrl = `${url}?${searchParams.toString()}`;

  // fetch data from API
  const response = await fetch(fetchUrl);
  const data = await response.json();

  // remove seconds from time string
  const removeSeconds = (time: string) => {
    const [hour, minute] = time.split(":");
    const AmPm = time.slice(-2);
    return `${hour.padStart(2, "0")}:${minute} ${AmPm}`;
  };

  // extract sunrise and sunset times
  const sunrise = removeSeconds(data.results.sunrise) as string;
  const sunset = removeSeconds(data.results.sunset) as string;

  return {
    sunrise,
    sunset,
  };
};
