import {assert} from 'chai'
import fs from 'fs'
import path from 'path'
import {compile} from '../src'

describe('stml spectacular', () => {
  it('should compile expression correctly', () => {
    const sourceFilename = path.join(__dirname, 'fixtures/expression.stml'),
      targetFilename = path.join(__dirname, 'fixtures/expression.html'),
      source = fs.readFileSync(sourceFilename, 'utf-8'),
      target = fs.readFileSync(targetFilename, 'utf-8')

    assert.strictEqual(
      compile(source, {
        locals: {
          name: 'hello',
          entries: ['entry1', 'entry2', 'entry3']
        },
        filename: sourceFilename
      }).replace(/\s/g, ''),
      target.replace(/\s/g, '')
    )
  })

  it('should compile block correctly', () => {
    const sourceFilename = path.join(__dirname, 'fixtures/block.stml'),
      targetFilename = path.join(__dirname, 'fixtures/block.html'),
      source = fs.readFileSync(sourceFilename, 'utf-8'),
      target = fs.readFileSync(targetFilename, 'utf-8')

    assert.strictEqual(
      compile(source, {
        locals: {
          entries: ['entry1', 'entry2', 'entry3']
        },
        filename: sourceFilename
      }).replace(/\s/g, ''),
      target.replace(/\s/g, '')
    )
  })

  it('should compile extends correctly', () => {
    const sourceFilename = path.join(__dirname, 'fixtures/extends.stml'),
      targetFilename = path.join(__dirname, 'fixtures/extends.html'),
      source = fs.readFileSync(sourceFilename, 'utf-8'),
      target = fs.readFileSync(targetFilename, 'utf-8')

    assert.strictEqual(
      compile(source, {
        locals: {
          entries: ['entry1', 'entry2', 'entry3']
        },
        filename: sourceFilename
      }).replace(/\s/g, ''),
      target.replace(/\s/g, '')
    )
  })

  it('should throw syntax error correctly', () => {
    const sourceFilename = path.join(__dirname, 'fixtures/syntax-error.stml'),
      source = fs.readFileSync(sourceFilename, 'utf-8')

    assert.throws(
      () => compile(source, {
        filename: sourceFilename
      })
    )
  })
})
