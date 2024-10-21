<template>
  <div class="btn-container_foreground max-w-4xl h-60px standalone:h-75px" :style="cssVariables">
    <div class="btn-container bg-neutral text-neutral-content h-55px standalone:h-70px">
      <div
          v-for="(button, index) in localOptions"
          :key="`label-${index}`"
          :class="{
          [`btn-item-${index} labels`]: true,
          ['checked']: button.isActive,
          ['unchecked']: !button.isActive,
        }"
          @click="handleLabelClick(button)"
      >
        <div class="active-label">
          <div class="btn-badge" v-if="button.badge">
            {{ button.badge }}
          </div>
          <slot name="icon" v-if="hasSlot('icon')" :props="button"/>
          <template v-else>
            <i :class="`${button.icon}`"/>
          </template>
        </div>

        <div class="btn-title">
          <slot name="title" v-if="hasSlot('title')" :props="button"/>
          <template v-else>
            {{ button.title }}
          </template>
        </div>

        <div
            v-if="hasChild(button)"
            :class="{
            ['btn-super-parent h-60px standalone:h-70px b-55px standalone:b-70px']: button.isActive,
            ['btn-class-showable']: showable,
          }"
        >
          <child :childs="button.childs || []" @update="handleChildClick"/>
        </div>
      </div>

      <div id="sweep" v-show="hasActiveClass">
        <div id="sweep-right"/>
        <div id="sweep-center"/>
        <div id="sweep-left"/>
      </div>
    </div>
  </div>
</template>

<script>
import Child from "./Child.vue";

export default {
  components: {Child},
  model: {
    prop: "value",
    event: "update",
  },
  props: {
    value: {
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    mainColor: {
      type: String,
      default: "#171616",
    },
    foregroundColor: {
      type: String,
      default: "#ff2a66",
    },
    badgeColor: {
      type: String,
      default: "#FBC02D",
    },
  },
  data: () => ({
    localOptions: [],
    showable: false,
  }),
  created() {
    this.localOptions = this.options.map((option) => ({
      ...option,
      isActive: this.isActive(option),
    }));
  },
  mounted() {
    this.cssLoader();
    window.addEventListener("resize", this.onResize);
  },
  computed: {
    cssVariables() {
      const countChilds = (
          (this.localOptions.find((option) => option.isActive) || {}).childs || []
      ).length;
      return {
        "--color-main": this.mainColor,
        "--color-foreground": this.foregroundColor,
        "--color-badge": this.badgeColor,
        "--width-parent": `${countChilds * 45}px`,
      };
    },
    hasActiveClass() {
      return this.localOptions.some((option) => option.isActive);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    cssLoader() {
      let customStyle = "";
      const containerWidth =
          document.querySelector(".btn-container").offsetWidth ||
          window.innerWidth;
      this.options.forEach((item, index) => {
        if (index === 0 && this.hasChild(item)) {
          customStyle += `
          .btn-item-${index}.checked .btn-class-showable .btn-child-parent {
            transform: translateX(${(item.childs.length * 45) / 2 - 35}px);
            transition: transform 500ms ease 300ms;
          }
          `;
        }
        if (index === this.options.length - 1 && this.hasChild(item)) {
          customStyle += `
          .btn-item-${index}.checked .btn-class-showable .btn-child-parent {
            transform: translateX(-${(item.childs.length * 45) / 2 - 35}px);
            transition: transform 500ms ease 300ms;
          }
          `;
        }
        customStyle += `
        .btn-item-${index} {
          padding: 10px;
          transition: transform 100ms ease;
          width : ${containerWidth / this.options.length}px !important;
          display: flex;
          justify-content :center;
          align-items : center;
          position: relative;
          z-index: 10;
        }
        .btn-item-${index}.checked ~ #sweep {
          transform: translateX(${(index * containerWidth) /
        this.options.length +
        containerWidth / this.options.length / 4}px);
          transition: transform 500ms ease;
        }
        `;
        if (this.hasChild(item)) {
          item.childs.forEach((child, idx) => {
            customStyle += `
            .btn-item-${index}.checked .btn-class-showable .btn-child:nth-child(${idx +
            1}) {
              transform: translateX(${(0.5 + idx) * 45 -
            (item.childs.length * 45) / 2}px);
              transition: transform 500ms ease 300ms;
            }
          `;
          });
        }
      });
      document.getElementById("sweep").style.left = `
      ${containerWidth / this.options.length / 4 - 135 / 2}px`;
      var head = document.getElementsByTagName("head")[0];
      var style = document.createElement("style");
      style.id = "bottom-navigation-style";
      if (style.styleSheet) {
        style.styleSheet.cssText = customStyle;
      } else {
        style.appendChild(document.createTextNode(customStyle));
      }
      head.appendChild(style);
    },
    handleLabelClick(button) {
      if (!this.showable || button.isActive) {
        this.toggleClass();
      }
      this.updateValue(button.id, this.hasChild(button));
      this.routeChange(button.id);
    },
    handleChildClick(value) {
      this.updateValue(value);
      this.toggleClass();
      this.routeChange(value);
    },
    routeChange(value) {
      let id = parseInt(value);
      if (id === 1) {
        this.$router.push('/').catch(() => {
        });
      } else if (id === 2) {
        this.$router.push('/following').catch(() => {
        });
      } else if (id === 3) {
        this.$router.push('/popular').catch(() => {
        });
      } else if (id === 5) {
        this.$router.push('/categories').catch(() => {
        });
      } else if (id === 6) {
        this.$router.push('/menu').catch(() => {
        });
      } else if (id === 101) {
        this.$router.push('/upload-image').catch(() => {
        });
      } else if (id === 102) {
        this.$router.push('/upload-video').catch(() => {
        });
      } else if (id === 103) {
        this.$router.push('/upload-youtube').catch(() => {
        });
      }
    },
    updateValue(value, prevent = false) {
      this.localOptions.forEach(
          (option) => (option.isActive = this.isActive(option, value))
      );
      if (!prevent) {
        this.$emit("update", value);
      }
    },
    toggleClass() {
      this.showable = !this.showable;
    },
    isActive(button, value = this.value) {
      return (
          button.id == value ||
          (button.childs || []).find((child) => child.id == value)
      );
    },
    onResize() {
      this.$nextTick(() => {
        const styleElement = document.getElementById("bottom-navigation-style");
        styleElement && styleElement.remove();
      });
      this.cssLoader();
    },
    hasSlot(slotName) {
      return this.$slots[slotName];
    },
    hasChild(button) {
      return (button.childs || []).length;
    },
  },
};
</script>

<style scoped>
.btn-super-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: var(--width-parent);
  z-index: -1;
}

input {
  display: none;
}

.btn-container_foreground {
  position: fixed;
  direction: ltr;
  display: flex;
  align-items: flex-end;
  bottom: 0;
  width: 100%;
  z-index: 998;
  background: var(--color-foreground);
}

.btn-container {
  direction: ltr;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.active-label {
  width: 35px;
  height: 35px;
  border-radius: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 300ms ease;
  position: absolute;
  top: 10px;
  background: #fff !important;
  color: rgba(0, 0, 0, 0.54);
}

.btn-title {
  position: absolute;
  color: rgb(255, 255, 255);
  font-size: 10px;
}

.btn-badge {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  left: 25px;
  border-radius: 50%;
  font-size: 12px;
  color: #fff;
  background: var(--color-badge);
}

.checked .active-label {
  transform: translateY(-10px);
}

.checked .btn-title {
  animation: fadein 200ms;
  position: absolute;
  top: 40px;
}

.unchecked .active-label {
  background: transparent;
}

.unchecked .btn-title {
  visibility: hidden;
}

#sweep {
  height: 100%;
  width: 135px;
  display: flex;
  position: absolute;
  left: 0;
  top: 5px;
}

#sweep-center {
  height: 38px;
  display: flex;
  flex: 1;
  background: var(--color-foreground);
  border-radius: 0 0 45% 45%;
}

#sweep-left {
  height: 33px;
  width: 45px;
  overflow: hidden;
  position: relative;
  right: 2px;
}

#sweep-left:before {
  content: "";
  display: block;
  width: 220%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  box-shadow: -40px -40px 0 0 var(--color-foreground);
}

#sweep-right {
  height: 33px;
  width: 45px;
  overflow: hidden;
  position: relative;
  left: 2px;
}

#sweep-right:before {
  content: "";
  display: block;
  width: 220%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
  top: 0;
  right: 0;
  box-shadow: 40px -40px 0 0 var(--color-foreground);
}

@media screen and (min-width: 576px) {
  .labels {
    cursor: pointer;
  }
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>