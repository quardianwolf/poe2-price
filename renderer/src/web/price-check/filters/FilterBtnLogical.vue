<template>
  <button
    :class="[
      $style.btn,
      { [$style.active]: active != null ? active : !filter.disabled },
    ]"
    @click="toggle"
  >
    <img v-if="img" :src="img" class="w-5 h-5" />
    <span class="pl-1">{{ t(text) }}</span>
    <i
      v-if="collapse"
      class="pl-2 text-xs text-gray-400"
      :class="filter.disabled ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"
    />
  </button>
</template>

<script setup lang="ts">
import { type PropType } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  filter: {
    type: Object as PropType<{ disabled: boolean }>, // will be mutated directly, instead of emit
    required: true,
  },
  text: { type: String, required: true },
  img: { type: String, default: undefined },
  readonly: { type: Boolean, default: undefined },
  active: { type: Boolean, default: undefined },
  collapse: { type: Boolean, default: undefined },
});

const { t } = useI18n();

function toggle() {
  const { filter, readonly } = props;
  if (!readonly) {
    filter.disabled = !filter.disabled;
  }
}
</script>

<style lang="postcss" module>
.btn {
  @apply rounded-md text-gray-300;
  @apply border;
  @apply pl-1 pr-2;
  line-height: 1.4rem;
  display: flex;
  align-items: center;
  border-color: rgba(255, 255, 255, 0.06);
  background: linear-gradient(to bottom, #141a26, #0c111a);
  font-variant: small-caps;
  letter-spacing: 0.02em;
  transition:
    border-color 0.13s ease,
    color 0.13s ease;

  &.active {
    @apply text-accent-100;
    border-color: rgba(228, 190, 138, 0.55);
    box-shadow: 0 0 10px -3px rgba(228, 190, 138, 0.45);
  }
}
</style>
