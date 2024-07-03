import 'dotenv/config'
import { createClient } from 'pexels'

const client = createClient(process.env.PEXELS_API_KEY)

const weatherApp = {
  weatherApiKey: process.env.WEATHER_API_KEY,
  async fetchCoords(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.weatherApiKey}`
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
        `https://api.openweathermap.org/data/2.5/weather?lat=${data[0]}&lon=${data[1]}&appid=${this.weatherApiKey}&units=metric`
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
  async getBgImg(query) {
    let imgData = await client.photos.search({ query, per_page: 1 })
    if (imgData.photos.length === 0) {
      imgData = await client.photos.search({
        query: 'nature',
        per_page: 1,
      })
    }

    document
      .querySelector('.attribution--link')
      .setAttribute('href', imgData.photos[0].url)
    document
      .querySelector('.attribution--user')
      .setAttribute('href', imgData.photos[0].photographer_url)
    document.querySelector('.attribution--user').innerText =
      imgData.photos[0].photographer

    document.querySelector('.attribution').classList.remove('hidden')
    return imgData.photos[0].src.original
  },
  async displayWeather(data, bgImg) {
    const { name } = data
    const { temp, humidity } = data.main
    const { description, icon } = data.weather[0]
    const { speed } = data.wind

    document.querySelector('.city').innerText = `Weather in ${name}`
    document.querySelector('.temp').innerText = `${Math.round(temp)}°C`
    document
      .querySelector('.icon')
      .setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`)
    document.querySelector('.description').innerText = `${description}`
    document.querySelector('.humidity').innerText = `Humidity: ${humidity}%`
    document.querySelector('.wind').innerText = `Wind Speed: ${speed}km/h`
    document.body.style.backgroundImage = `url(${bgImg})`
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
  const bgImg = await weatherApp.getBgImg(data.name)

  weatherApp.displayWeather(data, bgImg)
}

btn.addEventListener('click', btnHandler)

searchBar.addEventListener('keyup', function (event) {
  if (event.key == 'Enter') btnHandler()
})

const currentCoords = async function (pos) {
  const { latitude, longitude } = pos.coords
  const coords = [latitude, longitude]
  const data = await weatherApp.fetchData(coords)
  const bgImg = await weatherApp.getBgImg(data.name)
  weatherApp.displayWeather(data, bgImg)
}

const getCurrentPos = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(currentCoords, function () {
      alert('Could not get your location')
    })
}

getCurrentPos()
