<template>
  <button @click="updateInput" :class="$style['radio']" class="group">
    <template v-if="!useBgSelection">
      <span class="ee-radio" :class="{ 'ee-radio--on': isChecked }" />
      <slot />
    </template>
    <template v-else>
      <div
        class="rounded px-1 py-0.5 transition-colors"
        :class="{
          'bg-accent-600 text-gray-900 font-medium shadow-glow': isChecked,
          'hover:bg-gray-700': !isChecked,
        }"
      >
        <slot />
      </div>
    </template>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "UiRadio",
  emits: ["update:modelValue"],
  props: {
    value: {
      type: null,
      required: true,
    },
    modelValue: {
      type: null,
      required: true,
    },
    useBgSelection: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    return {
      isChecked: computed(() => {
        return props.modelValue === props.value;
      }),
      updateInput() {
        ctx.emit("update:modelValue", props.value);
      },
    };
  },
});
</script>

<style lang="postcss" module>
.radio {
  display: flex;
  @apply gap-x-1.5;
  align-items: center;
  text-align: left;
}
</style>
