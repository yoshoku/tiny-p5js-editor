import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolBar from '../../../src/components/ToolBar.vue'

describe('ToolBar', () => {
  describe('Button States', () => {
    it('should disable run and fullscreen buttons when running', () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: true,
        },
      })

      const runButton = wrapper.find('.run-button')
      const fullscreenButton = wrapper.find('.fullscreen-button')
      const stopButton = wrapper.find('.stop-button')

      expect(runButton.attributes('disabled')).toBeDefined()
      expect(fullscreenButton.attributes('disabled')).toBeDefined()
      expect(stopButton.attributes('disabled')).toBeUndefined()
    })

    it('should enable run and fullscreen buttons when not running', () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      const runButton = wrapper.find('.run-button')
      const fullscreenButton = wrapper.find('.fullscreen-button')
      const stopButton = wrapper.find('.stop-button')

      expect(runButton.attributes('disabled')).toBeUndefined()
      expect(fullscreenButton.attributes('disabled')).toBeUndefined()
      expect(stopButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Events', () => {
    it('should emit run event when run button is clicked', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      await wrapper.find('.run-button').trigger('click')
      expect(wrapper.emitted('run')).toBeTruthy()
      expect(wrapper.emitted('run')).toHaveLength(1)
    })

    it('should emit stop event when stop button is clicked', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: true,
        },
      })

      await wrapper.find('.stop-button').trigger('click')
      expect(wrapper.emitted('stop')).toBeTruthy()
      expect(wrapper.emitted('stop')).toHaveLength(1)
    })

    it('should emit fullscreen event when fullscreen button is clicked', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      await wrapper.find('.fullscreen-button').trigger('click')
      expect(wrapper.emitted('fullscreen')).toBeTruthy()
      expect(wrapper.emitted('fullscreen')).toHaveLength(1)
    })

    it('should emit download event when download button is clicked', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      await wrapper.find('.download-button').trigger('click')
      expect(wrapper.emitted('download')).toBeTruthy()
      expect(wrapper.emitted('download')).toHaveLength(1)
    })
  })

  describe('File Upload', () => {
    it('should trigger file input click when upload button is clicked', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      const fileInput = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

      await wrapper.find('.upload-button').trigger('click')
      expect(clickSpy).toHaveBeenCalled()
    })

    it('should emit upload event with file when .js file is selected', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      const file = new File(['console.log("test")'], 'test.js', { type: 'text/javascript' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')
      expect(wrapper.emitted('upload')).toBeTruthy()
      expect(wrapper.emitted('upload')?.[0]).toEqual([file])
    })

    it('should not emit upload event when non-.js file is selected', async () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')
      expect(wrapper.emitted('upload')).toBeFalsy()
    })

    it('should accept only .js files via accept attribute', () => {
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.attributes('accept')).toBe('.js')
    })
  })

  describe('About Button', () => {
    it('should open GitHub repository when about button is clicked', async () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const wrapper = mount(ToolBar, {
        props: {
          isRunning: false,
        },
      })

      await wrapper.find('.about-button').trigger('click')
      expect(openSpy).toHaveBeenCalledWith(
        'https://github.com/yoshoku/tiny-p5js-editor',
        '_blank'
      )

      openSpy.mockRestore()
    })
  })
})
