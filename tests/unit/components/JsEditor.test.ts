import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JsEditor from '../../../src/components/JsEditor.vue'

vi.mock('@guolao/vue-monaco-editor', () => ({
  VueMonacoEditor: {
    name: 'VueMonacoEditor',
    template: '<div class="mock-monaco-editor"></div>',
    props: ['value', 'language', 'theme'],
    emits: ['update:value', 'mount'],
  },
}))

describe('JsEditor', () => {
  it('should render editor wrapper', () => {
    const wrapper = mount(JsEditor, {
      props: {
        code: 'console.log("test")',
      },
    })

    const editorWrapper = wrapper.find('.js-editor-wrapper')
    expect(editorWrapper.exists()).toBe(true)
  })

  it('should set javascript language for monaco editor', () => {
    const wrapper = mount(JsEditor, {
      props: {
        code: '',
      },
    })

    const monacoEditor = wrapper.findComponent({ name: 'VueMonacoEditor' })
    expect(monacoEditor.props('language')).toBe('javascript')
  })

  it('should pass code prop to monaco editor', () => {
    const testCode = 'function setup() {\n  createCanvas(400, 400);\n}'
    const wrapper = mount(JsEditor, {
      props: {
        code: testCode,
      },
    })

    const monacoEditor = wrapper.findComponent({ name: 'VueMonacoEditor' })
    expect(monacoEditor.exists()).toBe(true)
    expect(monacoEditor.props('value')).toBe(testCode)
  })

  it('should emit update:code event when editor value changes', async () => {
    const wrapper = mount(JsEditor, {
      props: {
        code: 'initial code',
      },
    })

    const monacoEditor = wrapper.findComponent({ name: 'VueMonacoEditor' })
    const newCode = 'updated code'

    await monacoEditor.vm.$emit('update:value', newCode)

    expect(wrapper.emitted('update:code')).toBeTruthy()
    expect(wrapper.emitted('update:code')?.[0]).toEqual([newCode])
  })
})
