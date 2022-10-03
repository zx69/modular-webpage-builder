import { App } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import '@/styles/index.scss';

export default {
  install(app: App) {
    app.use(ElementPlus);
  },
};
