
import {
  defineComponent, reactive, computed, ref, toRefs, h, resolveDynamicComponent, PropType, watch,
} from 'vue';
import { CompModule, PreviewMode, RenderStatus } from '../typings';
import { compileSchemaToElement } from '../utils';


export default defineComponent({
  name: 'material-brochure_generator_renderer',
  components: {
  },
  props: {
    schema: {
      type: Object as PropType<CompModule>,
      required: true,
    },
    previewMode: {
      type: String as PropType<PreviewMode>,
      default: 'pc',
    },
    status: {
      type: String as PropType<RenderStatus>,
      default: 'preview',
    },
  },
  setup(props, { emit }) {
    return () => compileSchemaToElement(props.schema, props.schema.data, null, { mode: props.previewMode, status: props.status });
  },
});
