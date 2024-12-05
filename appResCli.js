// Función principal para obtener los datos de clima y restaurantes
async function getData() {
    // Obtener el valor ingresado por el usuario en el campo de búsqueda
    const locationInput = document.getElementById('location').value;

    // Si no se ingresó una ciudad, mostrar un mensaje de alerta
    if (!locationInput) {
        alert("Por favor, ingresa una ciudad.");
        return; // Terminar la ejecución si no hay ciudad
    }

    // Obtener las coordenadas de la ciudad usando la función getCoordinates
    const coordinates = await getCoordinates(locationInput);
    
    // Si no se encuentran coordenadas, mostrar un mensaje de error
    if (!coordinates) {
        alert("No se pudo encontrar la ubicación. Intenta con un nombre de ciudad válido.");
        return; // Terminar la ejecución si no se encuentran las coordenadas
    }

    // Obtener el clima utilizando las coordenadas obtenidas
    const weatherData = await getWeather(coordinates.lat, coordinates.lon);
    // Mostrar los datos del clima en la interfaz
    displayWeather(weatherData);

    // Obtener los restaurantes cercanos utilizando las coordenadas obtenidas
    const restaurantData = await getRestaurants(coordinates.lat, coordinates.lon);
    // Mostrar la lista de restaurantes en la interfaz
    displayRestaurants(restaurantData);
}

// Función para obtener las coordenadas de una ciudad usando OpenWeatherMap
async function getCoordinates(location) {
    const apiKey = '98a85cf9a6d43a48ec795cc535650465'; // Tu API Key de OpenWeatherMap
    // URL de la API de OpenWeatherMap para obtener las coordenadas de la ciudad
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    try {
        // Realizar la solicitud HTTP a la API
        const response = await fetch(url);
        const data = await response.json();

        // Verificar si la respuesta contiene coordenadas válidas
        if (data.cod !== 200 || !data.coord) {
            console.error("No se encontró la ubicación.");
            return null; // Si no se encuentra la ubicación, devolver null
        }

        // Retornar un objeto con latitud y longitud
        return {
            lat: data.coord.lat,
            lon: data.coord.lon
        };
    } catch (error) {
        // Si ocurre un error en la solicitud, mostrar el error y devolver null
        console.error("Error al obtener las coordenadas:", error);
        return null;
    }
}

// Función para obtener el clima usando las coordenadas obtenidas
async function getWeather(lat, lon) {
    const apiKey = '98a85cf9a6d43a48ec795cc535650465'; // Tu API Key de OpenWeatherMap
    // URL de la API para obtener el clima con coordenadas y en español
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`;

    try {
        // Realizar la solicitud HTTP para obtener los datos del clima
        const response = await fetch(url);
        const data = await response.json();

        // Verificar si la respuesta fue exitosa
        if (data.cod !== 200) {
            console.error("Error al obtener el clima:", data.message);
            return null; // Si hay un error, devolver null
        }

        // Retornar los datos del clima
        return data;
    } catch (error) {
        // Si ocurre un error en la solicitud, mostrar el error y devolver null
        console.error("Error al obtener el clima:", error);
        return null;
    }
}

// Función para obtener los restaurantes cercanos utilizando Yelp
async function getRestaurants(lat, lon) {
    const apiKey = 'nqyxYBHU_e4B862y7_nRwOet2BwfuTucAYZSqA6PEUhxvIFl16yIdYNPcGwit_CU0YGhuJp9bpx-RWV-ICYrZ0fAtSJbSY8Lsw0SJbMmQLKTHUpZ86LI_ydC8Qs2Z3Yx'; // Tu API Key de Yelp
    // URL de la API de Yelp para buscar negocios (restaurantes) cercanos
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&categories=restaurants&limit=5`;

    try {
        // Realizar la solicitud HTTP para obtener los restaurantes cercanos
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`, // Autenticación con la API Key
                'Accept-Language': 'es'  // Solicitar resultados en español
            }
        });
        const data = await response.json();

        // Verificar si Yelp devolvió una lista de restaurantes
        if (!data.businesses || data.businesses.length === 0) {
            console.log("No se encontraron restaurantes cercanos.");
            return []; // Si no se encuentran restaurantes, devolver un array vacío
        }

        // Retornar la lista de restaurantes encontrados
        return data.businesses;
    } catch (error) {
        // Si ocurre un error en la solicitud, mostrar el error y devolver un array vacío
        console.error("Error al obtener restaurantes de Yelp:", error);
        return [];
    }
}

// Función para mostrar los datos del clima en la interfaz de usuario
function displayWeather(data) {
    const temperature = document.getElementById('temperature');
    const weatherCondition = document.getElementById('weatherCondition');

    // Si los datos del clima son válidos, mostrar la temperatura y las condiciones
    if (data && data.main) {
        temperature.textContent = `Temperatura: ${data.main.temp}°C`; // Mostrar la temperatura en grados Celsius
        weatherCondition.textContent = `Condición: ${data.weather[0].description}`; // Mostrar la descripción del clima
    } else {
        // Si no se obtienen datos, mostrar un mensaje de error
        temperature.textContent = 'Error al obtener clima';
        weatherCondition.textContent = '';
    }
}

// Función para mostrar los restaurantes cercanos en la interfaz de usuario
function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurantList');
    restaurantList.innerHTML = ''; // Limpiar la lista antes de mostrar los nuevos resultados

    // Si se encontraron restaurantes, mostrarlos en la lista
    if (restaurants && restaurants.length > 0) {
        restaurants.forEach(restaurant => {
            const li = document.createElement('li'); // Crear un nuevo elemento de lista
            li.textContent = `${restaurant.name} - ${restaurant.location.address1}`; // Mostrar el nombre y dirección del restaurante
            restaurantList.appendChild(li); // Agregar el restaurante a la lista
        });
    } else {
        // Si no se encontraron restaurantes, mostrar un mensaje de "No encontrados"
        const li = document.createElement('li');
        li.textContent = 'No se encontraron restaurantes cercanos.';
        restaurantList.appendChild(li); // Agregar el mensaje a la lista
    }
}
