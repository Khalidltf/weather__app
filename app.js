const uri = "sample-weather.json";
const req = new Request(uri, { method: "GET" });

let container, df;

document.addEventListener("DOMContentLoaded", init);

function init() {
  container = document.getElementById("container");
  df = new DocumentFragment();

  fetch(req)
    .then((res) => res.json())
    .then((json) => {
      const { data } = json.hourly;
      // console.log(data);
      data.forEach((hour) => {
        let div = document.createElement("div");
        div.classList.add("hour");

        let timestamp = hour.time;
        div.id = "ts_" + timestamp.toString();
        let temp = parseInt(hour.temperature);
        // console.log(temp);
        div.textContent = temp.toString().concat("\u00B0");
        div.title = hour.summary;

        let span = document.createElement("span");
        let timmy = new Date(timestamp * 1000);
        span.textContent = timmy.getHours().toString().concat(":00");

        div.appendChild(span);
        df.appendChild(div);
      });
      container.appendChild(df);

      // console.log(data);
      data
        .filter((hour) => {
          if (hour.precipProbability > 0.5) return true;
          return false;
        })
        .map((hour) => {
          let id = "ts_" + hour.time.toString();
          return id;
        })
        .forEach((timestamp) => {
          document.getElementById(timestamp).classList.add("precip");
          // console.log(timestamp);
        });

      let highObj = data.reduce(
        (accumulator, hour) => {
          if (hour.temperature > accumulator.temp) {
            return {
              temp: hour.temperature,
              time: hour.time,
            };
          } else {
            return accumulator;
          }
        },
        {
          temp: -100,
          time: 1000,
        }
      );
      let id = "ts_".concat(highObj.time);
      document.getElementById(id).classList.add("hot");

      console.log(highObj);
    })
    .catch((error) => console.log({ message: error.message }));
}
