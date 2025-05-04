const btns = document.querySelectorAll('.btn');
const body = document.querySelector('body');
const container = document.createElement('div');
container.classList = 'container';
const temperature = document.createElement('p');
const url = 'https://api.weatherapi.com/v1/forecast.json?key=c86d462c7c9349cdaf1193258252504&q=48.972778 28.102778&days=14&aqi=no&alerts=no'

async function getData() {
  let data = await fetch(url)
  .catch((error) => {
    renderError()
  })

  if(data === undefined || data.ok === false){
    renderError()
    return
  }
  let info = await data.json()
  .catch((error) => {
    renderError()
    return
  })

  renderWeatherNow(info);

  let activeTabId = 1;
    
  btns.forEach(btn => {
    btn.onclick = () => {
      document.querySelector(`button[data-id="${activeTabId}"]`).classList.toggle('active');
      btn.classList.toggle('active');
      activeTabId = btn.dataset.id;
      container.innerHTML = '';
      activeTabId == 1 ? renderWeatherNow(info) : renderWeather(info.forecast.forecastday, activeTabId == 2 ? 7 : activeTabId == 3 ? 10 : 14);
    };
  });
}

getData()

function renderError(){
  document.querySelector('.error').classList.remove('hidden')
}

function renderWeatherNow(info) {
  container.innerHTML = ``
  const block = document.createElement('div');
  block.classList = 'block';
  const condition = info.current.condition;
  const url = condition.icon

  temperature.innerText = `Температура: ${info.current.temp_c} C°`;
  block.append(
    createImg(url),
    createP('Погода зараз:'),
    temperature,
    createP(`Швидкість вітру: ${info.current.wind_kph} км/г`)
  );
  container.append(block);
  body.append(container);
}

function renderWeather(info, count_) {
  info.slice(0, count_).forEach(element => {
    const block = document.createElement('div');
    block.classList = 'block';
    const condition = element.day.condition;
    const url = condition.icon
    
    const date = formatDate(element.date)
    const title = createP(`Погода ${date} (${renderDay(element.date_epoch)})`);
    title.classList.add('more_info');
    
    block.append(
      createImg(url),
      title,
      createP(`Максимальна температура:${element.day.maxtemp_c} C°`),
      createP(`Мінімальна температура: ${element.day.mintemp_c} C°`),
      createP(`Максимальна швидкість вітру: ${element.day.maxwind_kph}км/г`),
      createP(`Ймовірність опадів: ${element.day.daily_chance_of_rain || element.day.daily_chance_of_snow}%`)
    );

    const block2 = document.createElement('div')
    block2.classList.add('block2')
    title.addEventListener('click', () => {
      container.innerHTML = '';
      block.innerHTML = '';
      block.style.width = '500px';
      
      element.hour.forEach((el, i) => {
        if (i % 3 === 0 && i <= 21 ) {
          block.append(createP(`${renderTime(el.time, date)} :${el.temp_c}C°`));
          block2.append(createP(`Ймовірність опадів:${el.chance_of_rain}%`))
        }
      });
      
      const btn = createP('Назад');
      btn.classList.add('btn_return');
      btn.onclick = () => {
        container.innerHTML = '';
        renderWeather(info, count_);
      };
      block.append(btn);
      container.append(block);
      container.append(block2)
    });
    container.append(block);
    
    body.append(container);
  });
}

function createP(text) {
  const p = document.createElement('p');
  p.innerText = text;
  return p;
}

function createImg(src) {
  const img = document.createElement('img');
  img.src = src;
  return img;
}

function formatDate(dateStr) {
  const months = {
    '01': 'січня', '02': 'лютого', '03': 'березня', '04': 'квітня',
    '05': 'травня', '06': 'червня', '07': 'липня', '08': 'серпня',
    '09': 'вересня', '10': 'жовтня', '11': 'листопада', '12': 'грудня'
  };
  
  const [year, month, day] = dateStr.split('-');
  return `${day} ${months[month]}`;
}

function renderTime(dateNow, DayMonth){
  let a = dateNow.split(' ')
  let time = `${DayMonth} ${a[1]}`
  return time
}

function renderDay(unixTime){
  const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
  const date = new Date(unixTime * 1000).getDay();
  const dayNow = daysOfWeek[date]
  return dayNow;
}


