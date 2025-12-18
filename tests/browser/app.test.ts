import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'

describe('App Integration (Browser)', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(App, {
      attachTo: document.body,
    })
  })

  describe('Initial State', () => {
    it('should render all main components', () => {
      expect(wrapper.find('.container').exists()).toBe(true)
      expect(wrapper.find('.toolbar').exists()).toBe(true)
      expect(wrapper.find('.editor-section').exists()).toBe(true)
      expect(wrapper.find('.preview-section').exists()).toBe(true)
    })

    it('should have initial code in editor', () => {
      const editorComponent = wrapper.findComponent({ name: 'JsEditor' })
      expect(editorComponent.exists()).toBe(true)
      expect(editorComponent.props('code')).toContain('function setup()')
      expect(editorComponent.props('code')).toContain('function draw()')
    })

    it('should not be running initially', () => {
      const toolbar = wrapper.findComponent({ name: 'ToolBar' })
      expect(toolbar.props('isRunning')).toBe(false)
    })

    it('should have default editor width of 50%', async () => {
      await wrapper.vm.$nextTick()
      const editorSection = wrapper.find('.editor-section')
      expect(editorSection.attributes('style')).toContain('50%')
    })
  })

  describe('Sketch Execution', () => {
    it('should update running state when run button is clicked', async () => {
      const toolbar = wrapper.findComponent({ name: 'ToolBar' })
      const runButton = wrapper.find('.run-button')

      expect(toolbar.props('isRunning')).toBe(false)

      await runButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(toolbar.props('isRunning')).toBe(true)
    })

    it('should inject code into iframe when running sketch', async () => {
      const runButton = wrapper.find('.run-button')
      await runButton.trigger('click')
      await wrapper.vm.$nextTick()

      const preview = wrapper.findComponent({ name: 'JsPreview' })
      const iframe = preview.vm.iframe as HTMLIFrameElement

      expect(iframe).toBeDefined()
      expect(iframe.srcdoc).toBeDefined()

      const srcdoc = iframe.srcdoc
      expect(srcdoc).toContain('p5')
      expect(srcdoc).toContain('<script src="https://cdn.jsdelivr.net/npm/p5')
    })

    it('should stop sketch and reset iframe when stop button is clicked', async () => {
      const runButton = wrapper.find('.run-button')
      await runButton.trigger('click')
      await wrapper.vm.$nextTick()

      const toolbar = wrapper.findComponent({ name: 'ToolBar' })
      expect(toolbar.props('isRunning')).toBe(true)

      const stopButton = wrapper.find('.stop-button')
      await stopButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(toolbar.props('isRunning')).toBe(false)
    })
  })

  describe('Code Editor', () => {
    it('should update code when editor emits update:code event', async () => {
      const editor = wrapper.findComponent({ name: 'JsEditor' })
      const newCode = 'function setup() { createCanvas(800, 600); }'

      await editor.vm.$emit('update:code', newCode)
      await wrapper.vm.$nextTick()

      expect(editor.props('code')).toBe(newCode)
    })
  })

  describe('Plugin URLs Extraction', () => {
    it('should extract and include plugin URLs in iframe', async () => {
      const codeWithPlugin = `
        // @plugin https://cdn.jsdelivr.net/npm/p5.sound@0.2.0/dist/p5.sound.min.js
        function setup() {
          createCanvas(400, 400);
        }
      `

      const editor = wrapper.findComponent({ name: 'JsEditor' })
      await editor.vm.$emit('update:code', codeWithPlugin)
      await wrapper.vm.$nextTick()

      const runButton = wrapper.find('.run-button')
      await runButton.trigger('click')
      await wrapper.vm.$nextTick()

      const preview = wrapper.findComponent({ name: 'JsPreview' })
      const iframe = preview.vm.iframe as HTMLIFrameElement

      expect(iframe.srcdoc).toBeDefined()

      const srcdoc = iframe.srcdoc
      expect(srcdoc).toContain('<script src="https://cdn.jsdelivr.net/npm/p5.sound@0.2.0/dist/p5.sound.min.js"></script>')
    })
  })

  describe('Background Color', () => {
    it('should apply background color to iframe when specified', async () => {
      const codeWithBackground = `
        // @background #ff0000
        function setup() {
          createCanvas(400, 400);
        }
      `

      const editor = wrapper.findComponent({ name: 'JsEditor' })
      await editor.vm.$emit('update:code', codeWithBackground)
      await wrapper.vm.$nextTick()

      const runButton = wrapper.find('.run-button')
      await runButton.trigger('click')
      await wrapper.vm.$nextTick()

      const preview = wrapper.findComponent({ name: 'JsPreview' })
      const iframe = preview.vm.iframe as HTMLIFrameElement

      expect(iframe.style.backgroundColor).toBe('rgb(255, 0, 0)')
    })
  })

  describe('File Download', () => {
    it('should trigger download when download button is clicked', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement')
      const downloadButton = wrapper.find('.download-button')

      await downloadButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(createElementSpy).toHaveBeenCalledWith('a')
      createElementSpy.mockRestore()
    })
  })

  describe('Resizer', () => {
    it('should have divider element', () => {
      const divider = wrapper.find('.divider')
      expect(divider.exists()).toBe(true)
    })

    it('should have editor section with width style', () => {
      const editorSection = wrapper.find('.editor-section')
      expect(editorSection.exists()).toBe(true)
      expect(editorSection.attributes('style')).toBeDefined()
    })
  })

  describe('Component Integration', () => {
    it('should have all three main components', () => {
      expect(wrapper.findComponent({ name: 'ToolBar' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'JsEditor' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'JsPreview' }).exists()).toBe(true)
    })

    it('should pass isRunning prop to ToolBar correctly', async () => {
      const toolbar = wrapper.findComponent({ name: 'ToolBar' })
      expect(toolbar.props('isRunning')).toBe(false)

      await wrapper.find('.run-button').trigger('click')
      await wrapper.vm.$nextTick()

      expect(toolbar.props('isRunning')).toBe(true)
    })
  })
})
