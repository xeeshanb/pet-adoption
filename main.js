const template = document.querySelector("#pet-card-template")
const wrapper = document.createDocumentFragment()

async function start() {
  const weatherPromise = await fetch("https://api.weather.gov/gridpoints/MFL/110,50/forecast")
  const weatherData = await weatherPromise.json()
  const ourTemperature = weatherData.properties.periods[0].temperature
  document.querySelector("#temperature-output").textContent = ourTemperature
}

start()

async function petsArea() {
  const petsPromise = await fetch("https://rococo-cascaron-6460b5.netlify.app/.netlify/functions/pets")
  const petsData = await petsPromise.json()
  console.log(petsData)
  petsData.forEach(pet => {
    const clone = template.content.cloneNode(true)


    clone.querySelector(".pet-card").dataset.species = pet.species

    clone.querySelector("h3").textContent = pet.name
    clone.querySelector(".pet-description").textContent = pet.description
    clone.querySelector(".pet-age").textContent = createAgeText(pet.birthYear)

    if (!pet.photo) pet.photo = "image contain/fallback.jpg"
    clone.querySelector(".pet-card-photo img").src = pet.photo
    clone.querySelector(".pet-card-photo img").alt = `A ${pet.species} named ${pet.name}`

    wrapper.appendChild(clone)
  })
  document.querySelector(".list-of-pets").appendChild(wrapper)
}

petsArea()

function createAgeText(birthYear) {
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear

  if (age == 1) return "1 year old"
  if (age == 0) return "less than a year old"

  return `${age} years old`
}

// pet filter button code

const allButtons = document.querySelectorAll(".pet-filter button")

allButtons.forEach(el => {
  el.addEventListener("click", handleButtonClick)
})

function handleButtonClick(e) {
  // remove active class from any and all buttons
  allButtons.forEach(el => el.classList.remove("active"))

  // add active class to the specific button that just got clicked
  e.target.classList.add("active")

  // actually filter the pets down below
  const currentfilter = e.target.dataset.filter
  document.querySelectorAll(".pet-card").forEach(el => {
    if (currentfilter == el.dataset.species || currentfilter == "all") {
      el.style.display = "grid"
    }
    else {
      el.style.display = "none"
    }
  })
}