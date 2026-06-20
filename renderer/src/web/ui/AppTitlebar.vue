<template>
  <div :class="$style.titlebar">
    <slot />
    <button
      @click="emit('click')"
      class="truncate flex-1 text-center font-poe-sc"
      :class="$style.title"
    >
      {{ title }}
    </button>
    <button
      @click.stop="emit('close')"
      tabindex="-1"
      :class="[$style.button, $style.close]"
      title="Close"
    >
      <i class="fas fa-xmark"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  (e: "click" | "close"): void;
}>();
</script>

<style lang="postcss" module>
.titlebar {
  @apply text-gray-400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.6rem;
  line-height: 1.6rem;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--rarity, #e4be8a) 9%, rgba(18, 23, 34, 0.92)),
    rgba(9, 12, 19, 0.94)
  );
  border-bottom: 1px solid
    color-mix(in srgb, var(--rarity, #e4be8a) 45%, transparent);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.4);
  letter-spacing: 0.08em;
  font-variant: small-caps;

  button {
    @apply px-2 pt-px;
    transition:
      color 0.13s ease,
      background 0.13s ease;

    &:hover {
      @apply text-accent-200;
      background: linear-gradient(
        to top,
        rgba(228, 190, 138, 0.04),
        rgba(228, 190, 138, 0.16)
      );
    }

    &.close:hover {
      @apply text-red-100;
      background: theme("colors.red.600");
    }
  }
}

.title {
  color: #d3c4a4;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
}
.title:hover {
  color: color-mix(in srgb, var(--rarity, #e4be8a) 80%, #fff);
}
</style>
