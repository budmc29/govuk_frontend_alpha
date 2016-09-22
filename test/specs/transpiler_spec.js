const expect = require('chai').expect
const assert = require('assert')
const es = require('event-stream')
const File = require('vinyl')
const transpiler = require('../../lib/transpilation/transpiler.js')

const transpilationTest = function (transpiler, originalString, expectedString, callback) {
  let inputFile = new File({contents: new Buffer(originalString)})
  transpiler.write(inputFile)
  transpiler.once('data', function (file) {
    expect(file.contents.toString('utf8')).to.equal(expectedString)
    callback()
  })
}

const nunjucksAssetPath = `<link href="{{ asset_path + 'stylesheets/govuk-template.css' }}" media="screen" rel="stylesheet" />`
const nunjucksTextFor = `<a href="#content" class="skiplink">{{ skip_link_message|default('Skip to main content') }}</a>`
const nunjucksBlockFor = `{% block top_of_page %}{% endblock %}`

describe('Transpilation', function () {
  it('should return a Buffer', function (done) {
    let inputFile = new File({contents: new Buffer('test')})
    let testTranspiler = transpiler('erb')
    testTranspiler.write(inputFile)
    testTranspiler.once('data', function (file) {
      expect(file.isBuffer()).to.equal(true)
      done()
    })
  })

  describe('into ERB', function () {
    let erbTranspiler

    beforeEach(function () {
      erbTranspiler = transpiler('erb')
    })

    it('should have a correct asset_path', function (done) {
      const erbAssetPath = `<link href="<%= asset_path 'stylesheets/govuk-template.css' %>" media="screen" rel="stylesheet" />`
      transpilationTest(erbTranspiler, nunjucksAssetPath, erbAssetPath, done)
    })
    it('should have a correct text_for', function (done) {
      const erbTextFor = `<a href="#content" class="skiplink"><%= content_for?(:skip_link_message) ? yield(:skip_link_message) : 'Skip to main content' %></a>`
      transpilationTest(erbTranspiler, nunjucksTextFor, erbTextFor, done)
    })
    it('should have a correct block_for', function (done) {
      const erbBlockFor = `<%= content_for?(:top_of_page) ? yield(:top_of_page) : '' %>`
      transpilationTest(erbTranspiler, nunjucksBlockFor, erbBlockFor, done)
    })
    it('should have a correct block_for for the special case content block', function (done) {
      const nunjucksContentBlockFor = `{% block content %}{% endblock %}`
      const erbContentBlockFor = `<%= content_for?(:content) ? yield(:content) : yield %>`
      transpilationTest(erbTranspiler, nunjucksContentBlockFor, erbContentBlockFor, done)
    })
  })

  describe('into Handlebars', function () {
    let handlebarsTranspiler

    beforeEach(function () {
      handlebarsTranspiler = transpiler('handlebars')
    })

    it('should have a correct asset_path', function (done) {
      const handlebarsAssetPath = `<link href="{{{ asset_path }}}stylesheets/govuk-template.css" media="screen" rel="stylesheet" />`
      transpilationTest(handlebarsTranspiler, nunjucksAssetPath, handlebarsAssetPath, done)
    })
    it('should have a correct text_for', function (done) {
      const handlebarsTextFor = `<a href="#content" class="skiplink">{{#if skip_link_message}}{{{ skip_link_message }}}{{else}}Skip to main content{{/if}}</a>`
      transpilationTest(handlebarsTranspiler, nunjucksTextFor, handlebarsTextFor, done)
    })
    it('should have a correct block_for', function (done) {
      const handlebarsBlockFor = `{{#if top_of_page}}{{{ top_of_page }}}{{else}}{{/if}}`
      transpilationTest(handlebarsTranspiler, nunjucksBlockFor, handlebarsBlockFor, done)
    })
  })

  describe('into Django', function () {
    let djangoTranspiler

    beforeEach(function () {
      djangoTranspiler = transpiler('django')
    })

    it('should have a correct asset_path', function (done) {
      const djangoAssetPath = `<link href="{% static 'stylesheets/govuk-template.css' %}" media="screen" rel="stylesheet" />`
      transpilationTest(djangoTranspiler, nunjucksAssetPath, djangoAssetPath, done)
    })
    it('should have a correct text_for', function (done) {
      const djangoTextFor = `<a href="#content" class="skiplink">{{ skip_link_message|default:'Skip to main content' }}</a>`
      transpilationTest(djangoTranspiler, nunjucksTextFor, djangoTextFor, done)
    })
    it('should have a correct block_for', function (done) {
      const djangoBlockFor = `{% block top_of_page %}{% endblock %}`
      transpilationTest(djangoTranspiler, nunjucksBlockFor, djangoBlockFor, done)
    })
  })
})