import { describe, it, expect } from 'vitest'
import { extractBackgroundColor, extractPluginUrls, generateId } from '../../src/utils/sketch'

describe('extractBackgroundColor', () => {
  it('should extract background color from comment', () => {
    const code = `
      // @background #ff0000
      function setup() {
        createCanvas(400, 400);
      }
    `
    expect(extractBackgroundColor(code)).toBe('#ff0000')
  })

  it('should extract background color with hex format', () => {
    const code = '// @background #DD11BB'
    expect(extractBackgroundColor(code)).toBe('#DD11BB')
  })

  it('should extract background color with rgb format', () => {
    const code = '// @background rgb(255, 0, 0)'
    expect(extractBackgroundColor(code)).toBe('rgb(255, 0, 0)')
  })

  it('should extract background color with color name', () => {
    const code = '// @background white'
    expect(extractBackgroundColor(code)).toBe('white')
  })

  it('should return null when no background comment exists', () => {
    const code = `
      function setup() {
        createCanvas(400, 400);
      }
    `
    expect(extractBackgroundColor(code)).toBeNull()
  })
})

describe('extractPluginUrls', () => {
  it('should extract single plugin URL', () => {
    const code = '// @plugin https://cdn.example.com/plugin.js'
    expect(extractPluginUrls(code)).toEqual(['https://cdn.example.com/plugin.js'])
  })

  it('should extract multiple plugin URLs', () => {
    const code = `
      // @plugin https://cdn.example.com/plugin1.js
      // @plugin https://cdn.example.com/plugin2.js
    `
    expect(extractPluginUrls(code)).toEqual([
      'https://cdn.example.com/plugin1.js',
      'https://cdn.example.com/plugin2.js',
    ])
  })

  it('should return empty array when no plugin comments exist', () => {
    const code = `
      function setup() {
        createCanvas(400, 400);
      }
    `
    expect(extractPluginUrls(code)).toEqual([])
  })

  it('should only extract valid http/https URLs', () => {
    const code = `
      // @plugin https://cdn.example.com/valid.js
      // @plugin ftp://invalid.com/plugin.js
      // @plugin https://another.com/plugin.js
    `
    expect(extractPluginUrls(code)).toEqual([
      'https://cdn.example.com/valid.js',
      'https://another.com/plugin.js',
    ])
  })
})

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('should generate ID in expected format', () => {
    const id = generateId()
    expect(id).toMatch(/^\d+-[a-z0-9]+$/)
  })
})
