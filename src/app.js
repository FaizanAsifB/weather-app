'use strict'
const weatherApp = {
  apiKey: '2668d0c093b57ad7d9e5b7fd8cd74d3a',
  async fetchCoords(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.apiKey}`
      )
      const data = await response.json()
      const { lat, lon } = data[0]
      return [lat, lon]
    } catch (error) {
      throw new Error('Invalid city name')
    }
  },
  async fetchData(data) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${data[0]}&lon=${data[1]}&appid=${this.apiKey}&units=metric`
      )
      return await response.json()
    } catch (error) {
      throw new Error('Invalid city name')
    }
  },
  getCityName() {
    const name = searchBar.value
    searchBar.value = ''
    return name
  },
  async displayWeather(data) {
    const { name } = data
    const { temp, humidity } = data.main
    const { description, icon } = data.weather[0]
    const { speed } = data.wind

    document.querySelector('.city').innerText = `Weather in ${name}`
    document.querySelector('.temp').innerText = `${temp}°C`
    document
      .querySelector('.icon')
      .setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`)
    document.querySelector('.description').innerText = `${description}`
    document.querySelector('.humidity').innerText = `Humidity: ${humidity}%`
    document.querySelector('.wind').innerText = `Wind Speed: ${speed}km/h`
    document.body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${name})`
    document.querySelector('.weather--container').classList.remove('loading')
  },
}

const btn = document.querySelector('.btn')
const searchBar = document.querySelector('.search--bar')

const btnHandler = async function () {
  const city = weatherApp.getCityName()
  if (!city) return
  const coords = await weatherApp.fetchCoords(city)
  const data = await weatherApp.fetchData(coords)

  weatherApp.displayWeather(data)
}

btn.addEventListener('click', btnHandler)

searchBar.addEventListener('keyup', function (event) {
  if (event.key == 'Enter') btnHandler()
})

const currentCoords = async function (pos) {
  const { latitude, longitude } = pos.coords
  const coords = [latitude, longitude]
  const data = await weatherApp.fetchData(coords)
  weatherApp.displayWeather(data)
}

// const getCurrentPos = navigator.geolocation.getCurrentPosition(currentCoords)
// console.log(getCurrentPos)

const getCurrentPos = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(currentCoords, function () {
      alert('Could not get your location')
    })
}

getCurrentPos()
