<template>
  <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
    <div class="divider">Choose Theme</div>
    <div class="form-control mt-1 mb-5">
      <label class="label">
        <span class="label-text font-bold">Themes :</span>
      </label>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <div class="truncate" v-for="(theme,index) in themes" :key="index">
          <div class="indicator w-full">
            <div v-if="themeName == theme.value" class="indicator-item mt-2 mr-2"><i
                class="bx bxs-check-circle text-base"></i></div>
            <div class="card w-full p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-2 mb-1 clickable"
                 @click="themeChange(theme)">
              <div class="text-base font-semibold">{{ theme.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.checkTheme();
  },
  data() {
    return {
      themeName: '',
      themes: [
        {
          "value": "light",
          "name": "🌝 Light"
        },
        {
          "value": "dark",
          "name": "🌚 Dark"
        },
        {
          "value": "cupcake",
          "name": "🧁 Cupcake"
        },
        {
          "value": "bumblebee",
          "name": "🐝 Bumblebee"
        },
        {
          "value": "emerald",
          "name": "✳️ Emerald"
        },
        {
          "value": "corporate",
          "name": "🏢 Corporate"
        },
        {
          "value": "synthwave",
          "name": "🌃 Synthwave"
        },
        {
          "value": "retro",
          "name": "👴 Retro"
        },
        {
          "value": "cyberpunk",
          "name": "🤖 Cyberpunk"
        },
        {
          "value": "valentine",
          "name": "🌸 Valentine"
        },
        {
          "value": "halloween",
          "name": "🎃 Halloween"
        },
        {
          "value": "garden",
          "name": "🌷 Garden"
        },
        {
          "value": "forest",
          "name": "🌲 Forest"
        },
        {
          "value": "aqua",
          "name": "🐟 Aqua"
        },
        {
          "value": "lofi",
          "name": "👓 Lofi"
        },
        {
          "value": "active",
          "name": "🖍 Pastel"
        },
        {
          "value": "active",
          "name": "♀️ Fantasy"
        },
        {
          "value": "wireframe",
          "name": "📝 Wireframe"
        },
        {
          "value": "black",
          "name": "🏴 Black"
        },
        {
          "value": "luxury",
          "name": "💎 Luxury"
        },
        {
          "value": "dracula",
          "name": "♂️ Dracula"
        },
        {
          "value": "cmyk",
          "name": "🖨 CMYK"
        }
      ],
    }
  },
  methods: {
    checkTheme() {
      let currentTheme = localStorage.getItem('theme')
      if (currentTheme && currentTheme !== 'null') {
        this.themeName = currentTheme;
      }
    },
    themeChange(theme) {
      this.themeName = theme.value;
      document.documentElement.setAttribute("data-theme", theme.value);
      localStorage.setItem('theme', theme.value);
    },
  },
}
</script>

<style scoped></style>