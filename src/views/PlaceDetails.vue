<template>
  <div class="place-details">
    <header class="header">
      <button class="btn-icon" @click="reloadPage" aria-label="Home">
        <i class="fas fa-arrow-left"></i>
      </button>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h1 class="place-title">{{ place.name }}</h1>
    </header>

    <div class="hero-section">
      <div class="carousel-container">
        <div id="placeCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div v-for="(photo, index) in photos" :key="index" :class="['carousel-item', { 'active': index === 0 }]">
              <img :src="photo" :alt="`${place.name} - Photo ${index + 1}`" class="carousel-image">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#placeCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#placeCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="hero-overlay">
        <h2 class="hero-title">Descubre la belleza</h2>
        <p class="hero-subtitle">Sumérgete en las maravillas de {{ place.name }}</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="place-info">
        <h3 class="section-title">Acerca de este lugar</h3>
        <p class="info-text">{{ place.info }}</p>
      </div>

      <div class="rating-section">
        <div class="current-rating">
          <h3 class="section-title">Rating</h3>
          <StarRating :rating="place.rating" :totalStars="5" />
          <span class="rating-value">{{ place.rating.toFixed(1) }} / 5</span>
        </div>
        <button type="button" class="btn btn-primary" @click="showModal = true">
          Rate this place
        </button>
      </div>
    </div>

    <!-- Custom Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Rate {{ place.name }}</h5>
          <button type="button" class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <label for="ratingInput" class="form-label">Your rating:</label>
          <StarRating :rating="ratingInput" :totalStars="5" @update:rating="updateRating" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="submitRatingFromModal">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '@/firebase';
import StarRating from '@/components/StarRating.vue';

export default {
  name: 'PlaceDetails',
  components: {
    StarRating
  },
  props: {
    place: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const ratingInput = ref(0);
// Filtrar solo las fotos que existan (diferentes de undefined o null)
const photos = ref([props.place.photo, props.place.photo1].filter(photo => photo));

    const showModal = ref(false);

    const updateRating = (newRating) => {
      ratingInput.value = newRating;
    };

    const submitRatingFromModal = async () => {
      if (ratingInput.value >= 1 && ratingInput.value <= 5) {
        try {
          const placeDocRef = db.collection('places').doc(props.place.id);
          await placeDocRef.update({ rating: ratingInput.value });
          props.place.rating = ratingInput.value;
          closeModal();
        } catch (error) {
          console.error("Error saving rating:", error);
        }
      } else {
        console.log("Invalid rating");
      }
    };

    const reloadPage = () => {
      location.reload();
    };

    const closeModal = () => {
      showModal.value = false;
      ratingInput.value = 0;
    };

    return {
      ratingInput,
      photos,
      showModal,
      updateRating,
      submitRatingFromModal,
      reloadPage,
      closeModal
    };
  }
};
</script>

<style scoped>
.place-details {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: #0056b3;
}

.place-title {
  margin: 0 0 0 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}


/* Estilos del contenedor del carrusel */
.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px; /* Ajusta la altura según sea necesario */
  overflow: hidden;
  position: relative;
}

.carousel-inner {
  width: 100%;
  height: 100%;
}

.carousel-image {
  object-fit: cover; /* Mantiene las proporciones de la imagen */
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  max-width: 100%; /* Evita que la imagen se salga del carrusel */
  max-height: 100%; /* Mantiene la imagen dentro del contenedor */
}

/* Asegura que los botones de control estén bien posicionados */
.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.carousel-control-prev {
  left: 10px;
}

.carousel-control-next {
  right: 10px;
}


.hero-section {
  position: relative;
  width: 100%;
  height: 500px; /* Ajusta la altura de toda la sección */
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  padding: 20px;
  color: white;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.5rem;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.info-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.rating-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.current-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
  margin-top: 0.5rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.features-section {
  grid-column: 1 / -1;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  list-style-type: none;
  padding: 0;
}

.features-list li {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #555;
}

.features-list i {
  margin-right: 0.5rem;
  color: #007bff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .place-title {
    font-size: 1.5rem;
  }
}
/* Añadir estilos para asegurar que el modal se muestre correctamente */
.modal-backdrop {
  opacity: 0.5;
}

.modal-open {
  padding-right: 0 !important;
  overflow: auto !important;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 1.75rem auto;
}
/* Custom Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 15px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Ensure the page doesn't scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
</style>

