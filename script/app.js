// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

function _calucateMinutesSunHasBeenUp(sunrise) {
	const now = new Date();
	const difference = now - new Date(sunrise * 1000);
	const minutesSunHasBeenUp = Math.floor((difference / 1000) / 60);
	return minutesSunHasBeenUp;
}

const updateSun = (procentSunLeft, currentTime) => {
	const sunHmtlElement = document.querySelector('.js-sun');
	let bottom = (100 - procentSunLeft) * 2
	if (bottom > 100) bottom = 200 - bottom;
	let left = 100 - procentSunLeft;

	sunHmtlElement.style.bottom = `${bottom}%`
	sunHmtlElement.style.left = `${left}%`
	sunHmtlElement.dataset.time = currentTime;
}

const updateMinutesLeft = (minutesSunLeft, totalSunMinutes) => {
	const timeLeftHtmlElement = document.querySelector('.js-time-left');
	if (minutesSunLeft <= totalSunMinutes) timeLeftHtmlElement.textContent = minutesSunLeft;
	if (minutesSunLeft >= totalSunMinutes) timeLeftHtmlElement.textContent = totalSunMinutes;
	if (minutesSunLeft <= 0) timeLeftHtmlElement.textContent = 0;
}

let placeSunAndStartMoving = (totalSunMinutes, sunrise) => {
	const minutesSunHasBeenUp = _calucateMinutesSunHasBeenUp(sunrise);
	const minutesSunLeft = (totalSunMinutes - minutesSunHasBeenUp);
	const procentSunLeft = minutesSunLeft / totalSunMinutes * 100;
	const currentTime = _parseMillisecondsIntoReadableTime(new Date() / 1000);

	checkThemeSwitch(totalSunMinutes, minutesSunHasBeenUp);
	updateMinutesLeft(minutesSunLeft, totalSunMinutes,);
	updateSun(procentSunLeft, currentTime);
};

const checkThemeSwitch = (totalSunMinutes, minutesSunHasBeenUp) => {
	const bodyHtmlElement = document.body;
	if (minutesSunHasBeenUp <= 0 || minutesSunHasBeenUp > totalSunMinutes) {
		bodyHtmlElement.classList.remove('is-day');
		bodyHtmlElement.classList.add('is-night');
	}
	else {
		bodyHtmlElement.classList.remove('is-night');
		bodyHtmlElement.classList.add('is-day');
	}
}

const startSunTimer = (totalSunMinutes, sunrise) => {
	return sunTimer = setInterval(() => {
		placeSunAndStartMoving(totalSunMinutes, sunrise);
	}, 60 * 100)
}

const setLocation = (location) => {
	const locationHtmlElement = document.querySelector('.js-location');
	locationHtmlElement.textContent = location;
}

const setSunHours = (sunrise, sunset) => {
	const sunsetHourHtmlElement = document.querySelector('.js-sunset');
	const sunriseHourHtmlElement = document.querySelector('.js-sunrise');

	sunsetHourHtmlElement.textContent = _parseMillisecondsIntoReadableTime(sunset);
	sunriseHourHtmlElement.textContent = _parseMillisecondsIntoReadableTime(sunrise);
}
let showResult = queryResponse => {
	const location = queryResponse.city.name
	const sunrise = queryResponse.city.sunrise;
	const sunset = queryResponse.city.sunset;
	const totalSunMinutes = Math.floor((sunset - sunrise) / 60)

	setLocation(location);
	setSunHours(sunrise, sunset);

	placeSunAndStartMoving(totalSunMinutes, sunrise);
	const sunTimer = startSunTimer(totalSunMinutes, sunrise);
};

let getAPI = (lat, lon) => {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appId}&units=metric&lang=nl&cnt=1`
	fetch(url)
		.then(response => {
			if (response.status === 200) {
				return response.json();
			} else {
				throw new Error('Error while fetching weather API');
			}
		})
		.then(data => {
			console.debug(data);
			showResult(data);
		}).catch(error => {
			console.error(error);
		});
};

document.addEventListener('DOMContentLoaded', function () {
	getAPI(50.8027841, 3.2097454);
});

const appId = 'a78049b91ad959f2bd17da2f4236b3e1';