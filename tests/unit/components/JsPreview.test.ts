import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JsPreview from '../../../src/components/JsPreview.vue'

describe('JsPreview', () => {
  it('should render iframe element', () => {
    const wrapper = mount(JsPreview)
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.classes()).toContain('js-preview-iframe')
  })

  it('should render wrapper div', () => {
    const wrapper = mount(JsPreview)
    const wrapperDiv = wrapper.find('.js-preview-wrapper')
    expect(wrapperDiv.exists()).toBe(true)
  })

  it('should expose iframe ref', () => {
    const wrapper = mount(JsPreview)
    expect(wrapper.vm.iframe).toBeDefined()
    expect(wrapper.vm.iframe).toBeInstanceOf(HTMLIFrameElement)
  })

  it('should expose wrapper ref', () => {
    const wrapper = mount(JsPreview)
    expect(wrapper.vm.wrapper).toBeDefined()
    expect(wrapper.vm.wrapper).toBeInstanceOf(HTMLDivElement)
  })
})
