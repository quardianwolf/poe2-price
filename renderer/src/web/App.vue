<template>
  <div id="app" class="text-sm font-poe-sc">
    <OverlayWindow />
  </div>
</template>

<script setup lang="ts">
import OverlayWindow from "./overlay/OverlayWindow.vue";
</script>

<style lang="postcss">
@import url("@fortawesome/fontawesome-free/css/all.min.css");
@import url("animate.css/animate.css");
@import url("../assets/font.css");
@tailwind base;
@tailwind components;
@tailwind utilities;

.table-stripped tbody tr:nth-child(odd) {
  background: rgba(255, 255, 255, 0.035);
}

.table-stripped tbody tr {
  transition: background-color 0.12s ease;
}

.table-stripped tbody tr:hover {
  background: rgba(228, 190, 138, 0.08);
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  overflow: hidden;
  justify-content: space-between;
  --accent: #e4be8a;
  --accent-soft: rgba(228, 190, 138, 0.16);

  :focus {
    outline: 0;
  }

  :focus-visible {
    outline: 0;
    box-shadow: 0 0 0 2px rgba(228, 190, 138, 0.55);
    border-radius: 0.25rem;
  }
}

.layout-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0.625rem;
  height: 0.625rem;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.25);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    rgba(80, 90, 114, 0.9),
    rgba(44, 52, 70, 0.9)
  );
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    to bottom,
    rgba(228, 190, 138, 0.85),
    rgba(189, 136, 66, 0.85)
  );
  background-clip: padding-box;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

/* Buttons — beveled metal plate */
.btn {
  @apply px-3 py-1 leading-none text-gray-200;
  border-radius: 3px;
  background: linear-gradient(180deg, #2b3243, #171c28);
  border: 1px solid #3a4458;
  border-top-color: #4b5872;
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.06),
    0 1px 2px 0 rgba(0, 0, 0, 0.5);
  transition:
    background 0.13s ease,
    border-color 0.13s ease,
    color 0.13s ease,
    box-shadow 0.13s ease,
    transform 0.08s ease;
}

.btn:hover {
  @apply text-white;
  background: linear-gradient(180deg, #36405a, #20283a);
  border-color: rgba(228, 190, 138, 0.7);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    0 0 11px -2px rgba(228, 190, 138, 0.5);
}

.btn:active {
  transform: translateY(1px);
}

/* Accent — gold ingot */
.btn-accent {
  @apply px-3 py-1 leading-none text-gray-900 font-semibold;
  border-radius: 3px;
  background: linear-gradient(180deg, #f7e0b6 0%, #e8c281 45%, #d0a45f 100%);
  border: 1px solid #f1d6a3;
  border-bottom-color: #b9893f;
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.55),
    0 2px 9px -2px rgba(228, 190, 138, 0.55);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  transition:
    filter 0.13s ease,
    box-shadow 0.13s ease,
    transform 0.08s ease;
}

.btn-accent:hover {
  filter: brightness(1.06);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.65),
    0 0 15px -2px rgba(228, 190, 138, 0.75);
}

.btn-accent:active {
  transform: translateY(1px);
}

.btn-icon {
  @apply text-xs text-gray-600;
}

/* Checkbox — carved rune socket, lights up gold when set */
.ee-check {
  display: inline-block;
  position: relative;
  width: 1.05rem;
  height: 1.05rem;
  flex: none;
  border-radius: 3px;
  border: 1px solid #4a546b;
  background: #0c111b;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7);
  transition:
    background 0.13s ease,
    border-color 0.13s ease,
    box-shadow 0.13s ease;
}
.ee-check::after {
  content: "";
  position: absolute;
  left: 0.34rem;
  top: 0.13rem;
  width: 0.28rem;
  height: 0.52rem;
  border: solid #1a130a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.15s cubic-bezier(0.2, 1.5, 0.45, 1);
}
.group:hover .ee-check {
  border-color: rgba(228, 190, 138, 0.55);
}
.ee-check--on {
  background: linear-gradient(180deg, #f5d9ab, #d8a861);
  border-color: #f0d29a;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 0 10px -1px rgba(228, 190, 138, 0.7);
}
.ee-check--on::after {
  transform: rotate(45deg) scale(1);
}

/* Radio — round carved socket with a gold gem */
.ee-radio {
  display: inline-block;
  position: relative;
  width: 1.05rem;
  height: 1.05rem;
  flex: none;
  border-radius: 9999px;
  border: 1px solid #4a546b;
  background: #0c111b;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7);
  transition:
    border-color 0.13s ease,
    box-shadow 0.13s ease;
}
.group:hover .ee-radio {
  border-color: rgba(228, 190, 138, 0.55);
}
.ee-radio::after {
  content: "";
  position: absolute;
  inset: 0.24rem;
  border-radius: 9999px;
  background: radial-gradient(circle at 38% 32%, #fbe6c4, #d8a861);
  transform: scale(0);
  transition: transform 0.15s cubic-bezier(0.2, 1.5, 0.45, 1);
}
.ee-radio--on {
  border-color: #f0d29a;
  box-shadow: 0 0 10px -1px rgba(228, 190, 138, 0.7);
}
.ee-radio--on::after {
  transform: scale(1);
}

@keyframes ring {
  0% {
    -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }

  2% {
    -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);
  }

  4% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  6% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  8% {
    -webkit-transform: rotate(-22deg);
    -ms-transform: rotate(-22deg);
    transform: rotate(-22deg);
  }

  10% {
    -webkit-transform: rotate(22deg);
    -ms-transform: rotate(22deg);
    transform: rotate(22deg);
  }

  12% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  14% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  16% {
    -webkit-transform: rotate(-12deg);
    -ms-transform: rotate(-12deg);
    transform: rotate(-12deg);
  }

  18% {
    -webkit-transform: rotate(12deg);
    -ms-transform: rotate(12deg);
    transform: rotate(12deg);
  }

  20% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

.faa-ring {
  animation: ring 2s ease;
  transform-origin-x: 50%;
  transform-origin-y: 0px;
  transform-origin-z: initial;
}
</style>
