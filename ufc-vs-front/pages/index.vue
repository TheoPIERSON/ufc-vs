<template>
  <div>
    <Loader v-if="isLoading" />

    <div v-else>
      <BaseNavigation />
      <HeroTitle />
      <Hero />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loader from "~/components/Loader.vue";

const isLoading = ref(true);

onMounted(async () => {
  // Simulez un délai pour tester le loader (optionnel)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Désactivez le loader une fois que tout est chargé
  isLoading.value = false;
});
</script>

<style scoped></style>
