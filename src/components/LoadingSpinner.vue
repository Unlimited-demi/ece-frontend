<script>
import lottie from 'lottie-web';
import animationData from '../assets/lottieFiles/loading-spinner.json';

export default {
  mounted() {
    // Load the animation when the component is mounted
    lottie.loadAnimation({
      container: this.$refs.lottie, // DOM element to render the animation
      renderer: 'svg', // Render as SVG
      loop: true, // Loop the animation
      autoplay: true, // Autoplay the animation
      animationData: animationData, // JSON animation file
    });
  },
};
</script>

<template>
  <div ref="lottie" style="width: 120px; height: 120px; margin: auto;"></div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
