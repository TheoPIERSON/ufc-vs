<template>
  <div class="grid place-items-center">
    <div v-if="fighters.red && fighters.blue">
      <div class="flex w-screen justify-around items-center p-0 md:px-10">
        <div
          ref="redFighter"
          class="text-center grid place-items-center w-full md:w-1/3 p-2 md:p-8"
          @click="checkWinner('Red')"
        >
          <img :src="getImageUrl(fighters.red)" alt="Red Fighter" class="w-full h-64 md:h-[25rem] object-scale-down" />
          <p class="text-center w-full md:w-1/2 p-2 bg-white">{{ fighters.red }}</p>
        </div>
        <h3 class="text-center text-4xl md:text-9xl font-Bebas text-gray-100">&</h3>
        <div
          ref="blueFighter"
          class="text-center grid place-items-center w-full md:w-1/3 p-2 md:p-8"
          @click="checkWinner('Blue')"
        >
          <img
            :src="getImageUrl(fighters.blue)"
            alt="Blue Fighter"
            class="w-full h-64 md:h-[25rem] object-scale-down"
          />
          <p class="text-center w-full md:w-1/2 p-2 bg-white">{{ fighters.blue }}</p>
        </div>
      </div>
    </div>
    <p class="text-gray-100 text-2xl">on {{ fightDate }}</p>
    <div v-if="message" class="mt-0">
      <p :class="{ 'text-green-500 text-3xl text-center': !isCorrect, 'text-red-500': isCorrect }">{{ message }}</p>
    </div>
    <button
      @click="loadRandomFight"
      :disabled="isButtonDisabled"
      class="bg-red-700 p-2 px-6 rounded-full text-white font-medium"
    >
      Next Fight
    </button>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ref, onMounted } from "vue";
import Papa from "papaparse";

const fighters = ref<{ red: string; blue: string; winner?: string }>({ red: "", blue: "" });
const message = ref<string | null>(null);
const isCorrect = ref<boolean | null>(null);
const fightDate = ref<string | null>(null); // Utilisez string pour la date
const photoData = ref<{ FighterName: string; Photo: string }[]>([]);
const redFighter = ref<HTMLElement | null>(null);
const blueFighter = ref<HTMLElement | null>(null);
const isButtonDisabled = ref(false);

// Fonction pour animer les photos
const animatePhotos = () => {
  if (redFighter.value && blueFighter.value) {
    const timeline = gsap.timeline();

    // Étape 1 : Les deux combattants arrivent depuis les côtés
    timeline.from(redFighter.value, {
      x: -100, // Le rouge arrive de la gauche
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    timeline.from(
      blueFighter.value,
      {
        x: 100, // Le bleu arrive de la droite
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
      },
      "<"
    ); // Les deux animations commencent en même temps
  }
};

// Charger les photos des combattants depuis le fichier JSON
const loadPhotos = async () => {
  try {
    const photoResponse = await fetch("/fighters-photo.json");
    photoData.value = await photoResponse.json();
  } catch (error) {
    console.error("Erreur lors du chargement des photos :", error);
  }
};

const checkWinner = (selected: "Red" | "Blue") => {
  if (fighters.value.winner === selected) {
    message.value = "Correct! You chose the winner!";
    isCorrect.value = false;
  } else {
    message.value = "Oops! You chose the wrong fighter.";
    isCorrect.value = true;
  }
};

// Récupère l'URL de la photo du combattant
const getImageUrl = (fighterName: string) => {
  // Vérifie que les données photo sont chargées avant de faire la recherche
  if (!photoData.value.length) {
    console.warn("Les données de photo ne sont pas encore chargées");
    return "/favicon.ico"; // Image par défaut si les données ne sont pas encore chargées
  }

  // Recherche le combattant par son nom
  const fighter = photoData.value.find((f) => f.FighterName === fighterName);

  // Retourne la photo du combattant si trouvée, sinon celle de Hasbulla
  if (fighter) {
    return fighter.Photo;
  } else {
    const hasbulla = photoData.value.find((f) => f.FighterName === "Hasbulla");
    return hasbulla ? hasbulla.Photo : "/favicon.ico";
  }
};

// Fonction pour charger un combat aléatoire
const loadRandomFight = async () => {
  if (isButtonDisabled.value) {
    return; // Empêche les clics multiples
  }

  isButtonDisabled.value = true; // Désactive le bouton

  try {
    const response = await fetch("/ufc-master.csv");
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result: { data: any }) => {
        const data = result.data;

        // Sélectionne un combat aléatoire
        const randomFight = data[Math.floor(Math.random() * data.length)];

        // Met à jour les combattants et les autres informations
        fighters.value = {
          red: randomFight.RedFighter,
          blue: randomFight.BlueFighter,
          winner: randomFight.Winner,
        };
        fightDate.value = randomFight.Date;
        message.value = null;
        animatePhotos();
      },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  } finally {
    // Réactive le bouton après une seconde
    setTimeout(() => {
      isButtonDisabled.value = false;
    }, 500);
  }
};

// Charge un combat aléatoire au démarrage
onMounted(() => {
  loadPhotos();
  loadRandomFight();
});
</script>

<style scoped>
/* Ajoutez du style si nécessaire */
</style>
