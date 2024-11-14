<template>
  <div class="grid place-items-center">
    <h2 class="text-5xl font-bold font-Bebas uppercase text-gray-100">Are you a UFC expert ?</h2>
    <p class="text-4xl font-bold font-Bebas text-gray-100">Who won the fight between...</p>
    <div v-if="fighters.red && fighters.blue">
      <div class="flex w-screen justify-around">
        <div class="text-center w-1/3 p-8" @click="checkWinner('Red')">
          <img :src="getImageUrl(fighters.red)" alt="Red Fighter" class="w-full h-72 object-scale-down border" />
          <p class="border p-2 bg-white">{{ fighters.red }}</p>
        </div>
        <div class="text-center w-1/3 p-8" @click="checkWinner('Blue')">
          <img :src="getImageUrl(fighters.blue)" alt="Blue Fighter" class="w-full h-72 object-scale-down border" />
          <p class="border p-2 bg-white">{{ fighters.blue }}</p>
        </div>
      </div>
    </div>
    <p class="text-gray-100 text-2xl">on {{ fightDate }}</p>
    <div v-if="message" class="mt-0">
      <p :class="{ 'text-green-500': !isCorrect, 'text-red-500': isCorrect }">{{ message }}</p>
    </div>
    <button @click="loadRandomFight" class="bg-red-700 p-2 px-6 rounded-full text-white font-medium">Next Fight</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Papa from "papaparse";

const fighters = ref<{ red: string; blue: string; winner?: string }>({ red: "", blue: "" });
const message = ref<string | null>(null);
const isCorrect = ref<boolean | null>(null);
const fightDate = ref<string | null>(null); // Utilisez string pour la date
const photoData = ref<{ FighterName: string; Photo: string }[]>([]);

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
  try {
    const response = await fetch("/ufc-master.csv");
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true, // Utilisation de l'en-tête pour identifier les colonnes
      skipEmptyLines: true, // Ignorer les lignes vides
      complete: (result: { data: any }) => {
        const data = result.data;

        // Sélectionne un combat aléatoire
        const randomFight = data[Math.floor(Math.random() * data.length)];

        // Récupère les combattants "Red Fighter" et "Blue Fighter"
        fighters.value = {
          red: randomFight.RedFighter, // Nom de la colonne pour Red Fighter
          blue: randomFight.BlueFighter, // Nom de la colonne pour Blue Fighter
          winner: randomFight.Winner, // Détermine le vainqueur
        };
        fightDate.value = randomFight.Date; // Assigner la date à fightDate
        console.log(`Winner: ${fighters.value.winner} (${randomFight.Winner})`);
        message.value = null; // Réinitialiser le message
      },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
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
