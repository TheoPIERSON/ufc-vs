<template>
  <nav class="flex justify-center text-center">
    <NuxtImg src="grey-background.jpg" class="absolute -z-10 h-screen w-full" />
    <!-- Référence pour le H1 -->
    <h1 ref="title">
      <NuxtImg width="400px" src="UFC-vs.png" />
    </h1>
  </nav>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ref, onMounted } from "vue";

// Crée une référence pour cibler le H1
const title = ref<HTMLElement | null>(null);

onMounted(() => {
  if (title.value) {
    // Timeline pour organiser les animations
    const timeline = gsap.timeline();

    // Animation de glissement depuis la gauche
    timeline.from(title.value, {
      x: -800,
      opacity: 0,
      duration: 0.5,
      ease: "none",
    });

    // Ajout de l'effet de tremblement après le mouvement initial
    timeline.to(title.value, {
      scale: 1.1,
      x: "+=15", // Petit déplacement horizontal
      yoyo: true, // Revient à la position de départ
      repeat: 7, // Nombre de secousses
      duration: 0.05, // Durée rapide pour l'effet de tremblement
      ease: "power1.inOut",
    });
    ("-=0.8"); // Démarre légèrement avant la fin de l'animation précédente
  }
});
</script>

<style scoped></style>
