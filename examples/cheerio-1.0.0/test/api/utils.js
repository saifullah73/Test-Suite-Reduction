var expect = require('expect.js'),
    fixtures = require('../fixtures'),
    cheerio = require('../..');

describe('cheerio', function () {
  describe('.html', function () {
it('-523-() : should return innerHTML; $.html(obj) should return outerHTML', function () {
      var $div = cheerio('div', '<div><span>foo</span><span>bar</span></div>');
      var span = $div.children()[1];
      expect(cheerio(span).html()).to.equal('bar');
      expect(cheerio.html(span)).to.equal('<span>bar</span>');
    });

it('-524-(<obj>) : should accept an object, an array, or a cheerio object', function () {
      var $span = cheerio('<span>foo</span>');
      expect(cheerio.html($span[0])).to.equal('<span>foo</span>');
      expect(cheerio.html($span)).to.equal('<span>foo</span>');
    });

it('-525-(<value>) : should be able to set to an empty string', function () {
      var $elem = cheerio('<span>foo</span>').html('');
      expect(cheerio.html($elem)).to.equal('<span></span>');
    });

it('-526-(<root>) : does not render the root element', function () {
      var $ = cheerio.load('');
      expect(cheerio.html($.root())).to.equal(
        '<html><head></head><body></body></html>'
      );
    });

it('-527-(<elem>, <root>, <elem>) : does not render the root element', function () {
      var $ = cheerio.load('<div>a div</div><span>a span</span>');
      var $collection = $('div').add($.root()).add('span');
      var expected =
        '<span>a span</span><html><head></head><body><div>a div</div><span>a span</span></body></html><div>a div</div>';
      expect(cheerio.html($collection)).to.equal(expected);
    });
  });

  describe('.text', function () {
it('-528-(cheerio object) : should return the text contents of the specified elements', function () {
      var $ = cheerio.load('<a>This is <em>content</em>.</a>');
      expect(cheerio.text($('a'))).to.equal('This is content.');
    });

it('-529-(cheerio object) : should omit comment nodes', function () {
      var $ = cheerio.load('<a>This is <!-- a comment --> not a comment.</a>');
      expect(cheerio.text($('a'))).to.equal('This is  not a comment.');
    });

it('-530-(cheerio object) : should include text contents of children recursively', function () {
      var $ = cheerio.load(
        '<a>This is <div>a child with <span>another child and <!-- a comment --> not a comment</span> followed by <em>one last child</em> and some final</div> text.</a>'
      );
      expect(cheerio.text($('a'))).to.equal(
        'This is a child with another child and  not a comment followed by one last child and some final text.'
      );
    });

it('-531-() : should return the rendered text content of the root', function () {
      var $ = cheerio.load(
        '<a>This is <div>a child with <span>another child and <!-- a comment --> not a comment</span> followed by <em>one last child</em> and some final</div> text.</a>'
      );
      expect(cheerio.text($.root())).to.equal(
        'This is a child with another child and  not a comment followed by one last child and some final text.'
      );
    });

it('-532-(cheerio object) : should omit script tags', function () {
      var $ = cheerio.load('<script>console.log("test")</script>');
      expect(cheerio.text($.root())).to.equal('');
    });

it('-533-(cheerio object) : should omit style tags', function () {
      var $ = cheerio.load(
        '<style type="text/css">.cf-hidden { display: none; } .cf-invisible { visibility: hidden; }</style>'
      );
      expect($.text()).to.equal('');
    });

it('-534-(cheerio object) : should include text contents of children omiting style and script tags', function () {
      var $ = cheerio.load(
        '<body>Welcome <div>Hello, testing text function,<script>console.log("hello")</script></div><style type="text/css">.cf-hidden { display: none; }</style>End of messege</body>'
      );
      expect(cheerio.text($.root())).to.equal(
        'Welcome Hello, testing text function,End of messege'
      );
    });
  });

  describe('.load', function () {
it('-535-(html) : should retain original root after creating a new node', function () {
      var $ = cheerio.load('<body><ul id="fruits"></ul></body>');
      expect($('body')).to.have.length(1);
      $('<script>');
      expect($('body')).to.have.length(1);
    });

it('-536-(html) : should handle lowercase tag options', function () {
      var $ = cheerio.load('<BODY><ul id="fruits"></ul></BODY>', {
        xml: { lowerCaseTags: true },
      });
      expect($.html()).to.be('<body><ul id="fruits"/></body>');
    });

it('-537-(html) : should handle the `normalizeWhitepace` option', function () {
      var $ = cheerio.load('<body><b>foo</b>  <b>bar</b></body>', {
        xml: { normalizeWhitespace: true },
      });
      expect($.html()).to.be('<body><b>foo</b> <b>bar</b></body>');
    });

it('-538-(buffer) : should accept a buffer', function () {
      var html = '<html><head></head><body>foo</body></html>';
      var $html = cheerio.load(Buffer.from(html));
      expect($html.html()).to.be(html);
    });
  });

  describe('.clone', function () {
it('-539-() : should return a copy', function () {
      var $src = cheerio(
        '<div><span>foo</span><span>bar</span><span>baz</span></div>'
      ).children();
      var $elem = $src.clone();
      expect($elem.length).to.equal(3);
      expect($elem.parent()).to.have.length(0);
      expect($elem.text()).to.equal($src.text());
      $src.text('rofl');
      expect($elem.text()).to.not.equal($src.text());
    });

it('-540-() : should return a copy of document', function () {
      var $src = cheerio
        .load('<html><body><div>foo</div>bar</body></html>')
        .root()
        .children();
      var $elem = $src.clone();
      expect($elem.length).to.equal(1);
      expect($elem.parent()).to.have.length(0);
      expect($elem.text()).to.equal($src.text());
      $src.text('rofl');
      expect($elem.text()).to.not.equal($src.text());
    });

it('-541-() : should preserve parsing options', function () {
      var $ = cheerio.load('<div>π</div>', { decodeEntities: false });
      var $div = $('div');

      expect($div.text()).to.equal($div.clone().text());
    });
  });

  describe('.parseHTML', function () {
    var $ = cheerio.load('');

it('-542-() : returns null', function () {
      expect($.parseHTML()).to.equal(null);
    });

it('-543-(null) : returns null', function () {
      expect($.parseHTML(null)).to.equal(null);
    });

it('-544-("") : returns null', function () {
      expect($.parseHTML('')).to.equal(null);
    });

it('-545-(largeHtmlString) : parses large HTML strings', function () {
      var html = new Array(10).join('<div></div>');
      var nodes = $.parseHTML(html);

      expect(nodes.length).to.be.greaterThan(4);
      expect(nodes).to.be.an('array');
    });

it('-546-("<script>") : ignores scripts by default', function () {
      var html = '<script>undefined()</script>';
      expect($.parseHTML(html)).to.have.length(0);
    });

it('-547-("<script>", true) : preserves scripts when requested', function () {
      var html = '<script>undefined()</script>';
      expect($.parseHTML(html, true)[0].tagName).to.match(/script/i);
    });

it('-548-("scriptAndNonScript) : preserves non-script nodes', function () {
      var html = '<script>undefined()</script><div></div>';
      expect($.parseHTML(html)[0].tagName).to.match(/div/i);
    });

it('-549-(scriptAndNonScript, true) : Preserves script position', function () {
      var html = '<script>undefined()</script><div></div>';
      expect($.parseHTML(html, true)[0].tagName).to.match(/script/i);
    });

it('-550-(text) : returns a text node', function () {
      expect($.parseHTML('text')[0].type).to.be('text');
    });

it('-551-(\\ttext) : preserves leading whitespace', function () {
      expect($.parseHTML('\t<div></div>')[0].data).to.equal('\t');
    });

it('-552-( text) : Leading spaces are treated as text nodes', function () {
      expect($.parseHTML(' <div/> ')[0].type).to.be('text');
    });

it('-553-(html) : should preserve content', function () {
      var html = '<div>test div</div>';
      expect(cheerio($.parseHTML(html)[0]).html()).to.equal('test div');
    });

it('-554-(malformedHtml) : should not break', function () {
      expect($.parseHTML('<span><span>')).to.have.length(1);
    });

it('-555-(garbageInput) : should not cause an error', function () {
      expect(
        $.parseHTML('<#if><tr><p>This is a test.</p></tr><#/if>') || true
      ).to.be.ok();
    });

it('-556-(text) : should return an array that is not effected by DOM manipulation methods', function () {
      var $ = cheerio.load('<div>');
      var elems = $.parseHTML('<b></b><i></i>');

      $('div').append(elems);

      expect(elems).to.have.length(2);
    });
  });

  describe('.merge', function () {
    var $ = cheerio.load('');
    var arr1, arr2;

    beforeEach(function () {
      arr1 = [1, 2, 3];
      arr2 = [4, 5, 6];
    });

it('-557-should be a function', function () {
      expect(typeof $.merge).to.equal('function');
    });

it('-558-(arraylike, arraylike) : should return an array', function () {
      var ret = $.merge(arr1, arr2);
      expect(typeof ret).to.equal('object');
      expect(ret instanceof Array).to.be.ok();
    });

it('-559-(arraylike, arraylike) : should modify the first array', function () {
      $.merge(arr1, arr2);
      expect(arr1).to.have.length(6);
    });

it('-560-(arraylike, arraylike) : should not modify the second array', function () {
      $.merge(arr1, arr2);
      expect(arr2).to.have.length(3);
    });

it('-561-(arraylike, arraylike) : should handle objects that arent arrays, but are arraylike', function () {
      arr1 = {};
      arr2 = {};
      arr1.length = 3;
      arr1[0] = 'a';
      arr1[1] = 'b';
      arr1[2] = 'c';
      arr2.length = 3;
      arr2[0] = 'd';
      arr2[1] = 'e';
      arr2[2] = 'f';
      $.merge(arr1, arr2);
      expect(arr1).to.have.length(6);
      expect(arr1[3]).to.equal('d');
      expect(arr1[4]).to.equal('e');
      expect(arr1[5]).to.equal('f');
      expect(arr2).to.have.length(3);
    });

it('-562-(?, ?) : should gracefully reject invalid inputs', function () {
      var ret = $.merge([4], 3);
      expect(ret).to.not.be.ok();
      ret = $.merge({}, {});
      expect(ret).to.not.be.ok();
      ret = $.merge([], {});
      expect(ret).to.not.be.ok();
      ret = $.merge({}, []);
      expect(ret).to.not.be.ok();
      var fakeArray1 = { length: 3 };
      fakeArray1[0] = 'a';
      fakeArray1[1] = 'b';
      fakeArray1[3] = 'd';
      ret = $.merge(fakeArray1, []);
      expect(ret).to.not.be.ok();
      ret = $.merge([], fakeArray1);
      expect(ret).to.not.be.ok();
      fakeArray1 = {};
      fakeArray1.length = '7';
      ret = $.merge(fakeArray1, []);
      expect(ret).to.not.be.ok();
      fakeArray1.length = -1;
      ret = $.merge(fakeArray1, []);
      expect(ret).to.not.be.ok();
    });

it('-563-(?, ?) : should no-op on invalid inputs', function () {
      var fakeArray1 = { length: 3 };
      fakeArray1[0] = 'a';
      fakeArray1[1] = 'b';
      fakeArray1[3] = 'd';
      $.merge(fakeArray1, []);
      expect(fakeArray1).to.have.length(3);
      expect(fakeArray1[0]).to.equal('a');
      expect(fakeArray1[1]).to.equal('b');
      expect(fakeArray1[3]).to.equal('d');
      $.merge([], fakeArray1);
      expect(fakeArray1).to.have.length(3);
      expect(fakeArray1[0]).to.equal('a');
      expect(fakeArray1[1]).to.equal('b');
      expect(fakeArray1[3]).to.equal('d');
    });
  });

  describe('.contains', function () {
    var $;

    beforeEach(function () {
      $ = cheerio.load(fixtures.food);
    });

it('-564-(container, contained) : should correctly detect the provided element', function () {
      var $food = $('#food');
      var $fruits = $('#fruits');
      var $apple = $('.apple');

      expect($.contains($food[0], $fruits[0])).to.equal(true);
      expect($.contains($food[0], $apple[0])).to.equal(true);
    });

it('-565-(container, other) : should not detect elements that are not contained', function () {
      var $fruits = $('#fruits');
      var $vegetables = $('#vegetables');
      var $apple = $('.apple');

      expect($.contains($vegetables[0], $apple[0])).to.equal(false);
      expect($.contains($fruits[0], $vegetables[0])).to.equal(false);
      expect($.contains($vegetables[0], $fruits[0])).to.equal(false);
      expect($.contains($fruits[0], $fruits[0])).to.equal(false);
      expect($.contains($vegetables[0], $vegetables[0])).to.equal(false);
    });
  });

  describe('.root', function () {
it('-566-() : should return a cheerio-wrapped root object', function () {
      var $ = cheerio.load('<html><head></head><body>foo</body></html>');
      $.root().append('<div id="test"></div>');
      expect($.html()).to.equal(
        '<html><head></head><body>foo</body></html><div id="test"></div>'
      );
    });
  });
});
