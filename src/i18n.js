import { createI18n } from 'vue-i18n';

const messages = {
  es: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Foto {index}',
      info: {
        plaza_de_armas: 'La Plaza de Armas es el corazón histórico de la ciudad.',
        machu_picchu: 'Machu Picchu es una antigua ciudad inca en lo alto de los Andes.',
        lago_titicaca: 'El Lago Titicaca es el lago navegable más alto del mundo.'
      }
    },
    carousel: {
      previous: 'Anterior',
      next: 'Siguiente'
    },
    hero: {
      title: 'Descubre la belleza',
      subtitle: 'Sumérgete en las maravillas de {name}'
    },
    about: {
      title: 'Acerca de este lugar'
    },
    rating: {
      title: 'Calificación',
      rateButton: 'Calificar este lugar'
    },
    modal: {
      title: 'Calificar {name}',
      ratingLabel: 'Tu calificación:',
      cancel: 'Cancelar',
      submit: 'Enviar'
    }
  },
  en: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Photo {index}',
      info: {
        plaza_de_armas: 'The Plaza de Armas is the historical heart of the city.',
        machu_picchu: 'Machu Picchu is an ancient Inca city high in the Andes Mountains.',
        lago_titicaca: 'Lake Titicaca is the highest navigable lake in the world.'
      }
    },
    carousel: {
      previous: 'Previous',
      next: 'Next'
    },
    hero: {
      title: 'Discover the beauty',
      subtitle: 'Immerse yourself in the wonders of {name}'
    },
    about: {
      title: 'About this place'
    },
    rating: {
      title: 'Rating',
      rateButton: 'Rate this place'
    },
    modal: {
      title: 'Rate {name}',
      ratingLabel: 'Your rating:',
      cancel: 'Cancel',
      submit: 'Submit'
    }
  },
  fr: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Photo {index}',
      info: {
        plaza_de_armas: 'La Plaza de Armas est le cœur historique de la ville.',
        machu_picchu: 'Le Machu Picchu est une ancienne cité inca perchée dans les Andes.',
        lago_titicaca: 'Le lac Titicaca est le plus haut lac navigable du monde.'
      }
    },
    carousel: {
      previous: 'Précédent',
      next: 'Suivant'
    },
    hero: {
      title: 'Découvrez la beauté',
      subtitle: 'Plongez dans les merveilles de {name}'
    },
    about: {
      title: 'À propos de ce lieu'
    },
    rating: {
      title: 'Évaluation',
      rateButton: 'Évaluer cet endroit'
    },
    modal: {
      title: 'Évaluer {name}',
      ratingLabel: 'Votre évaluation :',
      cancel: 'Annuler',
      submit: 'Envoyer'
    }
  },
  pt: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Foto {index}',
      info: {
        plaza_de_armas: 'A Plaza de Armas é o coração histórico da cidade.',
        machu_picchu: 'Machu Picchu é uma antiga cidade inca no alto dos Andes.',
        lago_titicaca: 'O Lago Titicaca é o lago navegável mais alto do mundo.'
      }
    },
    carousel: {
      previous: 'Anterior',
      next: 'Próximo'
    },
    hero: {
      title: 'Descubra a beleza',
      subtitle: 'Mergulhe nas maravilhas de {name}'
    },
    about: {
      title: 'Sobre este lugar'
    },
    rating: {
      title: 'Avaliação',
      rateButton: 'Avaliar este lugar'
    },
    modal: {
      title: 'Avaliar {name}',
      ratingLabel: 'Sua avaliação:',
      cancel: 'Cancelar',
      submit: 'Enviar'
    }
  },
  ay: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Uñjäwi {index}',
      info: {
        plaza_de_armas: 'Plaza de Armas uka marka taypi chiqapa.',
        machu_picchu: 'Machu Picchu uka nayra Inka marka patxa Andes qullunakanwa.',
        lago_titicaca: 'Titiqaqa quta jach\'a quta patxankiriwa.'
      }
    },
    carousel: {
      previous: 'Nayra',
      next: 'Jutiri'
    },
    hero: {
      title: 'K\'achata uñjam',
      subtitle: '{name} ukana suma kankañanakapa uñjam'
    },
    about: {
      title: 'Aka chiqata'
    },
    rating: {
      title: 'Uñakipawi',
      rateButton: 'Aka chiqaru uñakipam'
    },
    modal: {
      title: '{name} uñakipam',
      ratingLabel: 'Jumataki kunjamasa:',
      cancel: 'Jan munaña',
      submit: 'Apayaña'
    }
  },
  qu: {
    place: {
      name: '{name}',
      photoAlt: '{name} - Rikch\'ay {index}',
      info: {
        plaza_de_armas: 'Plaza de Armas llaqtaq sunqunmi.',
        machu_picchu: 'Machu Picchu ñawpaq Inka llaqta Andes urqukunapi.',
        lago_titicaca: 'Titiqaqa qucha aswan hatun wamp\'una quchami.'
      }
    },
    carousel: {
      previous: 'Ñawpaq',
      next: 'Qatiq'
    },
    hero: {
      title: 'Sumaq kayta riqsiy',
      subtitle: '{name} nisqap sumaq kayninkunata riqsiy'
    },
    about: {
      title: 'Kay lugarmanta'
    },
    rating: {
      title: 'Chaninchay',
      rateButton: 'Kay lugarta chaninchay'
    },
    modal: {
      title: '{name} chaninchay',
      ratingLabel: 'Qampa chaninchayniyki:',
      cancel: 'Ama',
      submit: 'Kachay'
    }
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: 'es', // set default locale
  fallbackLocale: 'en', // set fallback locale
  messages,
});