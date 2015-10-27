uri = require('../lib/util/uri-helpers')
clone = require('../lib/util/clone-obj')

xdescribe 'resolveURL()', ->
  it 'should replace the last segment', ->
    expect(uri.resolveURL('a', 'b')).toBe 'b'
    expect(uri.resolveURL('x/y', 'z')).toBe 'x/z'
    expect(uri.resolveURL('m', 'n/o')).toBe 'n/o'
    expect(uri.resolveURL('a/b', 'c/d')).toBe 'a/c/d'

  it 'should replace absolute segments', ->
    expect(uri.resolveURL('//a/b/c', '/y/z')).toBe '//a/y/z'

  it 'should resolve relative segments', ->
    expect(uri.resolveURL('a/b/c', '../x')).toBe 'a/x'

  it 'should resolve fully-qualified URIs', ->
    expect(uri.resolveURL('//site.com/a/b/c', 'x/y')).toBe '//site.com/a/b/x/y'

describe 'clone()', ->
  it 'should clone', ->
    object =
      name: 'hello'
    result = clone(object)
    expect(object).toEqual result
    expect(object).not.toBe result

  it 'should throw for circular objects', ->
    circular =
      prop:
        name: 'foo'
    circular.prop.otherProp = circular.prop
    expect(-> clone(circular)).toThrow('unable dereference circular structures');

  it 'should permit shared subobjects', ->
    subobject =
      name: 'hello'
    object =
      one: subobject
      two: subobject
    result = clone(object)
    expect(object).toEqual result
    expect(object).not.toBe result
