<template>
    <div class="star-rating">
      <span
        class="star"
        v-for="(star, index) in totalStars"
        :key="index"
        @click="selectRating(index + 1)"
        :class="{ 'selected': index + 1 <= rating }"
      >
        &#9733;
      </span>
    </div>
  </template>


  <script>
  import { ref, watch } from 'vue';
  
  export default {
    name: 'StarRating',
    props: {
      rating: {
        type: Number,
        required: true
      },
      totalStars: {
      type: Number,
      required: true
    }
    },
    setup(props, { emit }) {
      const selectedRating = ref(props.rating);
  
      watch(selectedRating, (newRating) => {
        emit('update:rating', newRating);
      });
  
      const selectRating = (rating) => {
        if (rating !== selectedRating.value) {
          selectedRating.value = rating;
        }
      };
  
      return {
        selectedRating,
        selectRating
      };
    }
  };
  </script>
  
  <style scoped>
  .star-rating {
    color: yellow;
    font-size: 24px;
  }
  
  .star {
    cursor: pointer;
  }
  
  .selected {
    color: gold;
  }
  </style>