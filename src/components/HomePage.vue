<template>
  <div class="page-container">
    <div v-if="!showPlaceDetails" class="map-section">
      <div class="map-container">
        <l-map ref="map" :zoom="zoom" :center="center" style="width: 100%; height: 100vh;">
          <l-tile-layer :url="url"></l-tile-layer>
          <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="userIcon">
            <l-popup>
              <h2>Tu ubicación</h2>
            </l-popup>
          </l-marker>
          <l-marker v-for="place in places" :key="place.id" :lat-lng="place.location" @click="selectPlace(place)" :icon="placeIcon">
            <l-popup>
              <h2>{{ place.name }}</h2>
              <img :src="place.photo" :alt="place.name" style="width: 100px; height: auto; margin-bottom: 5px;">
              <div>
                <b>Rating:</b>
                <StarRating :rating="place.rating" :totalStars="place.rating" />
              </div>
              <button class="btn btn-outline-success" @click="viewDetails(place)"><i class="fa-solid fa-circle-info"></i> + info</button>
            </l-popup>
          </l-marker>
        </l-map>
        <div class="map-overlay">
          <button class="btn btn-outline-light" @click="suggestNextPlace"><i class="fa-solid fa-location-arrow"></i> Sugerir lugar</button>
        </div>
        <div class="menu-button" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </div>
        <div v-if="showMenu" class="menu-overlay">
          <div class="menu-content">
            <div class="menu-header">
              <h3>Menú</h3>
              <button class="close-menu-button" @click="toggleMenu">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <ul>
              <li @click="centerOnUser"><i class="fas fa-map-marker-alt"></i> Centrar en mi ubicación</li>
              <li @click="toggleDarkMode"><i class="fas fa-moon"></i> Modo oscuro</li>
              <li @click="showFilterOptions"><i class="fas fa-filter"></i> Filtrar lugares</li>
              <li @click="changeNotificationRadius"><i class="fas fa-bell"></i> Cambiar radio de notificación</li>
              <li @click="showAbout"><i class="fas fa-info-circle"></i> Acerca de</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="place-details">
      <PlaceDetails :place="selectedPlace" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from 'vue3-leaflet';
import { firebase, db } from '@/firebase';
import StarRating from '@/components/StarRating.vue';
import L from 'leaflet';

export default {
  name: 'HomePage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    StarRating,
  },
  setup() {
    const places = ref([]);
    const center = ref([-15.8402, -70.0219]);
    const zoom = ref(9);
    const showPlaceDetails = ref(false);
    const selectedPlace = ref({});
    const userLocation = ref(null);
    const showMenu = ref(false);
    const isDarkMode = ref(false);
    const mapRef = ref(null);
    const mapObject = ref(null);

    const notificationRadius = ref(500); // Radio de notificación en metros
    const nearbyPlaces = ref([]);

    const userIcon = L.icon({
      iconUrl: '/path/to/user-marker-icon.png',
      iconSize: [38, 95],
      iconAnchor: [19, 95],
      popupAnchor: [0, -95],
    });

    const placeIcon = L.icon({
      iconUrl: '/path/to/place-marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const onMapReady = (map) => {
      mapObject.value = map;
    };

    const loadPlaces = async () => {
      try {
        const placesQuerySnapshot = await db.collection('places').get();

        places.value = placesQuerySnapshot.docs.map((doc) => {
          if (doc.exists) {
            const place = doc.data();
            place.id = doc.id;

            if (place.rating && place.rating.length > 0) {
              const averageRating = place.rating.reduce((sum, rating) => sum + rating, 0) / place.rating.length;
              place.averageRating = averageRating;
            } else {
              place.averageRating = 0;
            }

            return place;
          } else {
            console.log(`El documento con ID ${doc.id} no existe`);
            return null;
          }
        });
      } catch (error) {
        console.log('Error al cargar los lugares turísticos:', error);
      }
    };

    const selectPlace = (place) => {
      selectedPlace.value = place;
    };

    const checkNearbyPlaces = () => {
      if (userLocation.value) {
        nearbyPlaces.value = places.value.filter(place => {
          const distance = getDistance(
            userLocation.value[0],
            userLocation.value[1],
            place.location[0],
            place.location[1]
          );
          return distance <= notificationRadius.value / 1000; // Convertir metros a kilómetros
        });

        if (nearbyPlaces.value.length > 0) {
          showNearbyPlacesNotification();
        }
      }
    };

    const showNearbyPlacesNotification = () => {
      const message = `Hay ${nearbyPlaces.value.length} lugar(es) interesante(s) cerca de ti!`;
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(message, {
            body: "Toca para ver más detalles",
            icon: "/path/to/notification-icon.png"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(message, {
                body: "Toca para ver más detalles",
                icon: "/path/to/notification-icon.png"
              });
            }
          });
        }
      } else {
        alert(message); // Fallback para navegadores que no soportan notificaciones
      }
    };

    const changeNotificationRadius = () => {
      const newRadius = prompt("Ingresa el nuevo radio de notificación en metros:", notificationRadius.value);
      if (newRadius && !isNaN(newRadius)) {
        notificationRadius.value = parseInt(newRadius);
        checkNearbyPlaces(); // Verificar lugares cercanos con el nuevo radio
      }
    };

    const suggestNextPlace = () => {
      if (userLocation.value) {
        const distances = calculateDistances(userLocation.value, places.value);
        const nearestPlace = distances[0].place;

        const proximityThreshold = 1; // Definir la distancia en la que se considera cercano el lugar (en kilómetros)
        const distanceToNearestPlace = distances[0].distance;
        if (distanceToNearestPlace <= proximityThreshold) {
          if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }

        const notificationMessage = `El lugar más cercano a tu ubicación es: ${nearestPlace.name}`;
        showNotification(notificationMessage, nearestPlace.photo, nearestPlace.rating);
      } else {
        console.log("La ubicación del usuario no está disponible");
        getUserLocation();
      }
    };

    const calculateDistances = (userLocation, places) => {
      const distances = places.map((place) => {
        const placeLocation = place.location;
        const distance = getDistance(userLocation[0], userLocation[1], placeLocation[0], placeLocation[1]);
        return { place, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      return distances;
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const showNotification = (message, image, rating) => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(message, {
            body: `Rating: ${rating}`,
            icon: image,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(message, {
                body: `Rating: ${rating}`,
                icon: image,
              });
            }
          });
        }
      } else {
        alert(message); // Fallback para navegadores que no soportan notificaciones
      }
    };

    const viewDetails = (place) => {
      selectedPlace.value = place;
      showPlaceDetails.value = true;
    };

    const rateLocation = async () => {
      if (selectedPlace.value && selectedPlace.value.id) {
        const rating = prompt("Ingresa una puntuación del 1 al 5:");
        if (rating) {
          try {
            const placeDocRef = db.collection('places').doc(selectedPlace.value.id);

            await placeDocRef.update({
              rating: firebase.firestore.FieldValue.arrayUnion(parseInt(rating))
            });

            const updatedPlaceSnapshot = await placeDocRef.get();
            const updatedPlaceData = updatedPlaceSnapshot.data();
            const ratings = updatedPlaceData.rating;
            const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

            selectedPlace.value.rating = averageRating;

          } catch (error) {
            console.log("Error al guardar la valoración:", error);
          }
        }
      } else {
        console.log("Lugar inválido");
      }
    };

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            userLocation.value = [latitude, longitude];
            center.value = userLocation.value;
            if (mapObject.value) {
              mapObject.value.setView(userLocation.value, 15);
            }
            checkNearbyPlaces();
          },
          (error) => {
            console.error("Error obteniendo la ubicación:", error);
            handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.log("Geolocalización no está disponible en este navegador");
        alert("Tu navegador no soporta geolocalización. No podremos obtener tu ubicación.");
      }
    };

    const handleLocationError = (error) => {
      let errorMessage = "No se pudo obtener tu ubicación. ";
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Has denegado el permiso para acceder a tu ubicación. ";
          errorMessage += "Por favor, habilita el acceso a la ubicación en la configuración de tu dispositivo o navegador.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "La información de ubicación no está disponible en este momento. ";
          errorMessage += "Por favor, asegúrate de que el GPS de tu dispositivo esté activado e intenta nuevamente.";
          break;
        case error.TIMEOUT:
          errorMessage += "La solicitud para obtener tu ubicación ha expirado. ";
          errorMessage += "Por favor, verifica tu conexión a internet e intenta nuevamente.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage += "Ha ocurrido un error desconocido al obtener tu ubicación. ";
          errorMessage += "Por favor, intenta nuevamente más tarde.";
          break;
      }
      
      alert(errorMessage);
    };

    watch(userLocation, () => {
      if (userLocation.value && mapObject.value) {
        mapObject.value.setView(userLocation.value, 15);
        checkNearbyPlaces(); // Verificar lugares cercanos cuando cambia la ubicación del usuario
      }
    });

    onMounted(async () => {
      await loadPlaces();
      getUserLocation();
      
      // Solicitar permiso para notificaciones al cargar la página
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    });

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const centerOnUser = () => {
      if (userLocation.value && mapObject.value) {
        mapObject.value.setView(userLocation.value, 15);
      } else {
        getUserLocation();
      }
      toggleMenu();
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark-mode', isDarkMode.value);
      toggleMenu();
    };

    const showFilterOptions = () => {
      console.log("Mostrar opciones de filtro");
      toggleMenu();
    };

    const showAbout = () => {
      console.log("Mostrar información sobre la aplicación");
      toggleMenu();
    };

    return {
      showPlaceDetails,
      places,
      center,
      zoom,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      suggestNextPlace,
      rateLocation,
      selectPlace,
      viewDetails,
      userLocation,
      selectedPlace,
      showMenu,
      toggleMenu,
      centerOnUser,
      toggleDarkMode,
      showFilterOptions,
      showAbout,
      userIcon,
      placeIcon,
      mapRef,
      onMapReady,
      notificationRadius,
      nearbyPlaces,
      changeNotificationRadius,
      checkNearbyPlaces,
    };
  },
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  overflow: hidden;
}

.map-section {
  height: 100%;
}
.user-marker {
  color: #ff0000;
  font-size: 24px;
}

.place-marker {
  color: #0000ff;
  font-size: 18px;
}
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.map-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.menu-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1001;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: white;
  z-index: 1002;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.menu-content {
  padding: 20px;
}

.menu-content ul {
  list-style-type: none;
  padding: 0;
}

.menu-content li {
  margin-bottom: 15px;
  cursor: pointer;
}

.menu-content li:hover {
  color: #007bff;
}

.place-details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-y: auto;
  z-index: 1001;
}

.back-button {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1002;
}

.marker {
  text-align: center;
}

/* Estilos para el modo oscuro */
body.dark-mode {
  background-color: #333;
  color: #fff;
}

body.dark-mode .menu-overlay,
body.dark-mode .menu-button {
  background-color: #444;
  color: #fff;
}

body.dark-mode .menu-content li:hover {
  color: #5cacff;
}



</style>