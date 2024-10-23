<template>
  <div class="grid place-items-center mt-10">
    <h2>Are you a UFC expert?</h2>
    <p>Who won the fight between...</p>
    <div v-if="fighters.red && fighters.blue">
      <div class="flex w-screen justify-around">
        <p class="border p-20 cursor-pointer" @click="checkWinner('Red')">
          {{ fighters.red }}
        </p>
        <p class="border p-20 cursor-pointer" @click="checkWinner('Blue')">
          {{ fighters.blue }}
        </p>
      </div>
    </div>
    <p>on {{ fightDate }}</p>
    <div v-if="message" class="mt-4">
      <p :class="{ 'text-green-500': !isCorrect, 'text-red-500': isCorrect }">{{ message }}</p>
    </div>
    <button @click="loadRandomFight">Next Fight</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Papa from "papaparse";

const fighters = ref<{ red: string; blue: string; winner?: string }>({ red: "", blue: "" });
const message = ref<string | null>(null);
const isCorrect = ref<boolean | null>(null);
const fightDate = ref<string | null>(null); // Utilisez string pour la date

const checkWinner = (selected: "Red" | "Blue") => {
  if (fighters.value.winner === selected) {
    message.value = "Correct! You chose the winner!";
    isCorrect.value = false;
  } else {
    message.value = "Oops! You chose the wrong fighter.";
    isCorrect.value = true;
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
      complete: (result) => {
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
  loadRandomFight();
});
</script>

<style scoped>
/* Ajoutez du style si nécessaire */
</style>
