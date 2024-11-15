<template>
  <section class="grid place-items-center">
    <h2 ref="title" class="text-5xl font-bold font-Bebas uppercase text-gray-100 text-center">
      Are you a UFC expert ?
    </h2>
    <p ref="question" class="text-4xl font-bold font-Bebas text-gray-100 text-center">Who won the fight between...</p>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ref, onMounted } from "vue";

// Crée une référence pour cibler le H1
const title = ref<HTMLElement | null>(null);
const question = ref<HTMLElement | null>(null);

onMounted(() => {
  if (title.value) {
    // Timeline pour organiser les animations

    // Animation de glissement depuis la gauche
    gsap.from(title.value, {
      x: 600,
      opacity: 0,
      delay: 0.9,
      duration: 0.3,
      ease: "none",
    });
    gsap.from(question.value, {
      x: -600,
      opacity: 0,
      delay: 1.4,
      duration: 0.3,
      ease: "none",
    });
  }
});
</script>

<style scoped></style>
