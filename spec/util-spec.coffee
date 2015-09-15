uri = require('../lib/util/uri-helpers')

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
