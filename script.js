document.addEventListener('DOMContentLoaded', function () {

	const select = document.querySelector('select');
	const results = document.querySelector('#results');
	const currentTime = document.querySelector('#currentTime');
	currentTime.textContent = (new Date()).toLocaleTimeString();
	const currentTemp = document.querySelector('.currentTemp');
	const currentWindSpeed = document.querySelector('#currentWindSpeed');
	const currentWindDirection = document.querySelector('#currentWindDirection');
	const part = document.querySelector('.part');
	const url = 'http://api.openweathermap.org/data/2.5/forecast?&APPID=1a4934c9ced684eec82fb88c6001557c&q=';

// create a function getData(query) to get weather forecast
	async function getData(query) {
		const result = await fetch(`${url}${query}`);
		if(!result.ok) {
			throw new Error(`status: ${result.status}`);
		}
		return await result.json();
	}

// add event to select-element
	select.addEventListener('change', function(e) {
		getData(select.value)
			.then(data => {
				let array = data.list.filter(item => {
					return item.dt_txt.split(' ')[1].split(':')[0] === '12';
				});
				renderWeatherForecast(array);
				currentTemp.textContent = (data.list[0].main.temp-273.15).toFixed(1);
				currentWindSpeed.textContent = data.list[0].wind.speed;
				let direction = data.list[0].wind.deg;
				currentWindDirection.textContent = direction;

				if (direction > 0 && direction < 90){
					part.textContent = 'North-East ';
				}
				else if (direction > 90 && direction < 180){
					part.textContent = 'South-East ';
				}
				else if (direction > 180 && direction < 270){
					part.textContent = 'South-West ';
				}
				else if (direction > 270 && direction < 360){
					part.textContent = 'North-West ';
				}
				else if (direction === 0 || direction === 360){
					part.textContent = 'North';
				}
				else if (direction === 90){
					part.textContent = 'East ';
				}
				else if (direction === 180){
					part.textContent = 'South ';
				}
				else if (direction === 270){
					part.textContent = 'West ';
				}
			})
			.catch(err => console.log(err));
	});

// create a function renderWeatherForecast(data) to draw information about weather forecast on the page
	function renderWeatherForecast(data) {

		if(results.children.length) {
			clear(results);
		}

		let fragment = '';
		data.forEach(item => {
			const el = template(item);
			fragment = el;
			results.insertAdjacentHTML('beforeend', fragment);
		});
	}

// create a function clear(results) to clear div-results after new request
	function clear(results) {
		let child = results.lastElementChild;
		while(child) {
			results.removeChild(child);
			child = results.lastElementChild;
		}
	}

// create a function template(object) to draw a card with one day weather forecast
	function template(object) {
		return `
		<div class="result">
			<div>
				<span class="date">${(new Date(object.dt_txt)).toDateString()}</span>
				<span class="time">${(new Date(object.dt_txt)).toLocaleTimeString()}</span>
			</div>
			<img src="./icons/${object.weather[0].icon}.png"/>
			<span class="temp">${(object.main.temp-273.15).toFixed(1)} &#8451;</span>
		</div>
		`;
	}

});





























