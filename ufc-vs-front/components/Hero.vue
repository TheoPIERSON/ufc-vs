<template>
  <div class="grid place-items-center">
    <div v-if="fighters.red && fighters.blue">
      <div class="flex w-screen justify-around px-10">
        <div ref="redFighter" class="text-center w-1/3 p-8" @click="checkWinner('Red')">
          <img :src="getImageUrl(fighters.red)" alt="Red Fighter" class="w-full h-72 object-scale-down border" />
          <p class="border p-2 bg-white">{{ fighters.red }}</p>
        </div>
        <div ref="blueFighter" class="text-center w-1/3 p-8" @click="checkWinner('Blue')">
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

// Fonction pour animer les photos
const animatePhotos = () => {
  if (redFighter.value && blueFighter.value) {
    const timeline = gsap.timeline();

    // Étape 1 : Les deux combattants arrivent depuis les côtés
    timeline.from(redFighter.value, {
      x: -700, // Le rouge arrive de la gauche
      opacity: 0,
      duration: 0.5,
      ease: "none",
    });
    timeline.from(
      blueFighter.value,
      {
        x: 700, // Le bleu arrive de la droite
        opacity: 0,
        duration: 0.5,
        ease: "none",
      },
      "<"
    ); // Les deux animations commencent en même temps

    // Étape 2 : Les deux combattants se rapprochent rapidement
    timeline.to(
      [redFighter.value, blueFighter.value],
      {
        x: (index) => (index === 0 ? "+=200" : "-=200"), // Rouge avance de +200px, Bleu de -200px
        duration: 0.3,
        ease: "power3.in",
      },
      "-=0.001" // Attend un court instant avant de commencer
    );

    // Étape 3 : Ils rebondissent légèrement après l'entrechoquement
    timeline.to([redFighter.value, blueFighter.value], {
      x: (index) => (index === 0 ? "-=100" : "+=100"), // Petit rebond en arrière
      duration: 0.2,
      ease: "elastic.out(1, 0.75)",
    });

    // Étape 4 : Retour à leur position finale
    timeline.to([redFighter.value, blueFighter.value], {
      x: 0, // Retour à leur position de départ (centrée)
      duration: 0.4,
      ease: "power2.out",
    });
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
        animatePhotos();
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
