import DefaultTheme from 'vitepress/theme'
import Landing from './Landing.vue'
import './style.css'

const theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Landing', Landing)
  },
}

export default theme;
