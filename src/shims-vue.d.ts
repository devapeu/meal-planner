// Source - https://stackoverflow.com/questions/63724523/how-to-add-typescript-to-vue-3-and-vite-project
// Posted by gg.jiang
// Retrieved 2025-11-17, License - CC BY-SA 4.0

declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
