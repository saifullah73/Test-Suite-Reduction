/*global Symbol*/
var expect = require('expect.js'),
    cheerio = require('../..'),
    food = require('../fixtures').food,
    fruits = require('../fixtures').fruits,
    drinks = require('../fixtures').drinks,
    text = require('../fixtures').text;

describe('$(...)', function () {
  var $;

  beforeEach(function () {
    $ = cheerio.load(fruits);
  });

  describe('.load', function () {
it('-324-should throw a TypeError if given invalid input', function () {
      expect(function () {
        cheerio.load();
      }).to.throwException(function (err) {
        expect(err).to.be.an(Error);
        expect(err.message).to.be('cheerio.load() expects a string');
      });
    });
  });

  describe('.find', function () {
it('-325-() : should find nothing', function () {
      expect($('ul').find()).to.have.length(0);
    });

it('-326-(single) : should find one descendant', function () {
      expect($('#fruits').find('.apple')[0].attribs['class']).to.equal('apple');
    });

it('-327-(many) : should find all matching descendant', function () {
      expect($('#fruits').find('li')).to.have.length(3);
    });

it('-328-(many) : should merge all selected elems with matching descendants', function () {
      expect($('#fruits, #food', food).find('.apple')).to.have.length(1);
    });

it('-329-(invalid single) : should return empty if cant find', function () {
      expect($('ul').find('blah')).to.have.length(0);
    });

it('-330-(invalid single) : should query descendants only', function () {
      expect($('#fruits').find('ul')).to.have.length(0);
    });

it('-331-should return empty if search already empty result', function () {
      expect($('#not-fruits').find('li')).to.have.length(0);
    });

it('-332-should lowercase selectors', function () {
      expect($('#fruits').find('LI')).to.have.length(3);
    });

it('-333-should query immediate descendant only', function () {
      var q = cheerio.load('<foo><bar><bar></bar><bar></bar></bar></foo>');
      expect(q('foo').find('> bar')).to.have.length(1);
    });

it('-334-should query case-sensitively when in xml mode', function () {
      var q = cheerio.load('<caseSenSitive allTheWay>', { xml: true });
      expect(q('caseSenSitive')).to.have.length(1);
      expect(q('[allTheWay]')).to.have.length(1);
      expect(q('casesensitive')).to.have.length(0);
      expect(q('[alltheway]')).to.have.length(0);
    });

it('-335-should throw an Error if given an invalid selector', function () {
      expect(function () {
        $('#fruits').find(':bah');
      }).to.throwException(function (err) {
        expect(err).to.be.a(Error);
        expect(err.message).to.contain('unmatched pseudo-class');
      });
    });

    describe('(cheerio object) :', function () {
it('-336-returns only those nodes contained within the current selection', function () {
        var q = cheerio.load(food);
        var $selection = q('#fruits').find(q('li'));

        expect($selection).to.have.length(3);
        expect($selection[0]).to.be(q('.apple')[0]);
        expect($selection[1]).to.be(q('.orange')[0]);
        expect($selection[2]).to.be(q('.pear')[0]);
      });
it('-337-returns only those nodes contained within any element in the current selection', function () {
        var q = cheerio.load(food);
        var $selection = q('.apple, #vegetables').find(q('li'));

        expect($selection).to.have.length(2);
        expect($selection[0]).to.be(q('.carrot')[0]);
        expect($selection[1]).to.be(q('.sweetcorn')[0]);
      });
    });

    describe('(node) :', function () {
it('-338-returns node when contained within the current selection', function () {
        var q = cheerio.load(food);
        var $selection = q('#fruits').find(q('.apple')[0]);

        expect($selection).to.have.length(1);
        expect($selection[0]).to.be(q('.apple')[0]);
      });
it('-339-returns node when contained within any element the current selection', function () {
        var q = cheerio.load(food);
        var $selection = q('#fruits, #vegetables').find(q('.carrot')[0]);

        expect($selection).to.have.length(1);
        expect($selection[0]).to.be(q('.carrot')[0]);
      });
it('-340-does not return node that is not contained within the current selection', function () {
        var q = cheerio.load(food);
        var $selection = q('#fruits').find(q('.carrot')[0]);

        expect($selection).to.have.length(0);
      });
    });
  });

  describe('.children', function () {
it('-341-() : should get all children', function () {
      expect($('ul').children()).to.have.length(3);
    });

it('-342-() : should return children of all matched elements', function () {
      expect($('ul ul', food).children()).to.have.length(5);
    });

it('-343-(selector) : should return children matching selector', function () {
      var cls = $('ul').children('.orange')[0].attribs['class'];
      expect(cls).to.equal('orange');
    });

it('-344-(invalid selector) : should return empty', function () {
      expect($('ul').children('.lulz')).to.have.length(0);
    });

it('-345-should only match immediate children, not ancestors', function () {
      expect($(food).children('li')).to.have.length(0);
    });
  });

  describe('.contents', function () {
    beforeEach(function () {
      $ = cheerio.load(text);
    });

it('-346-() : should get all contents', function () {
      expect($('p').contents()).to.have.length(5);
    });

it('-347-() : should include text nodes', function () {
      expect($('p').contents().first()[0].type).to.equal('text');
    });

it('-348-() : should include comment nodes', function () {
      expect($('p').contents().last()[0].type).to.equal('comment');
    });
  });

  describe('.next', function () {
it('-349-() : should return next element', function () {
      var cls = $('.orange').next()[0].attribs['class'];
      expect(cls).to.equal('pear');
    });

it('-350-(no next) : should return empty for last child', function () {
      expect($('.pear').next()).to.have.length(0);
    });

it('-351-(next on empty object) : should return empty', function () {
      expect($('.banana').next()).to.have.length(0);
    });

it('-352-() : should operate over all elements in the selection', function () {
      expect($('.apple, .orange', food).next()).to.have.length(2);
    });

    describe('(selector) :', function () {
it('-353-should reject elements that violate the filter', function () {
        expect($('.apple').next('.non-existent')).to.have.length(0);
      });

it('-354-should accept elements that satisify the filter', function () {
        expect($('.apple').next('.orange')).to.have.length(1);
      });
    });
  });

  describe('.nextAll', function () {
it('-355-() : should return all following siblings', function () {
      var elems = $('.apple').nextAll();
      expect(elems).to.have.length(2);
      expect(elems[0].attribs['class']).to.equal('orange');
      expect(elems[1].attribs['class']).to.equal('pear');
    });

it('-356-(no next) : should return empty for last child', function () {
      expect($('.pear').nextAll()).to.have.length(0);
    });

it('-357-(nextAll on empty object) : should return empty', function () {
      expect($('.banana').nextAll()).to.have.length(0);
    });

it('-358-() : should operate over all elements in the selection', function () {
      expect($('.apple, .carrot', food).nextAll()).to.have.length(3);
    });

it('-359-() : should not contain duplicate elements', function () {
      var elems = $('.apple, .orange', food);
      expect(elems.nextAll()).to.have.length(2);
    });

    describe('(selector) :', function () {
it('-360-should filter according to the provided selector', function () {
        expect($('.apple').nextAll('.pear')).to.have.length(1);
      });

it("-361-should not consider siblings' contents when filtering", function () {
        expect($('#fruits', food).nextAll('li')).to.have.length(0);
      });
    });
  });

  describe('.nextUntil', function () {
it('-362-() : should return all following siblings if no selector specified', function () {
      var elems = $('.apple', food).nextUntil();
      expect(elems).to.have.length(2);
      expect(elems[0].attribs['class']).to.equal('orange');
      expect(elems[1].attribs['class']).to.equal('pear');
    });

it('-363-() : should filter out non-element nodes', function () {
      var elems = $('<div><div></div><!-- comment -->text<div></div></div>');
      var div = elems.children().eq(0);
      expect(div.nextUntil()).to.have.length(1);
    });

it('-364-() : should operate over all elements in the selection', function () {
      var elems = $('.apple, .carrot', food);
      expect(elems.nextUntil()).to.have.length(3);
    });

it('-365-() : should not contain duplicate elements', function () {
      var elems = $('.apple, .orange', food);
      expect(elems.nextUntil()).to.have.length(2);
    });

it('-366-(selector) : should return all following siblings until selector', function () {
      var elems = $('.apple', food).nextUntil('.pear');
      expect(elems).to.have.length(1);
      expect(elems[0].attribs['class']).to.equal('orange');
    });

it('-367-(selector not sibling) : should return all following siblings', function () {
      var elems = $('.apple').nextUntil('#vegetables');
      expect(elems).to.have.length(2);
    });

it('-368-(selector, filterString) : should return all following siblings until selector, filtered by filter', function () {
      var elems = $('.beer', drinks).nextUntil('.water', '.milk');
      expect(elems).to.have.length(1);
      expect(elems[0].attribs['class']).to.equal('milk');
    });

it('-369-(null, filterString) : should return all following siblings until selector, filtered by filter', function () {
      var elems = $('<ul><li></li><li><p></p></li></ul>');
      var empty = elems.find('li').eq(0).nextUntil(null, 'p');
      expect(empty).to.have.length(0);
    });

it('-370-() : should return an empty object for last child', function () {
      expect($('.pear').nextUntil()).to.have.length(0);
    });

it('-371-() : should return an empty object when called on an empty object', function () {
      expect($('.banana').nextUntil()).to.have.length(0);
    });

it('-372-(node) : should return all following siblings until the node', function () {
      var $fruits = $('#fruits').children();
      var elems = $fruits.eq(0).nextUntil($fruits[2]);
      expect(elems).to.have.length(1);
    });

it('-373-(cheerio object) : should return all following siblings until any member of the cheerio object', function () {
      var $drinks = $(drinks).children();
      var $until = $([$drinks[4], $drinks[3]]);
      var elems = $drinks.eq(0).nextUntil($until);
      expect(elems).to.have.length(2);
    });
  });

  describe('.prev', function () {
it('-374-() : should return previous element', function () {
      var cls = $('.orange').prev()[0].attribs['class'];
      expect(cls).to.equal('apple');
    });

it('-375-(no prev) : should return empty for first child', function () {
      expect($('.apple').prev()).to.have.length(0);
    });

it('-376-(prev on empty object) : should return empty', function () {
      expect($('.banana').prev()).to.have.length(0);
    });

it('-377-() : should operate over all elements in the selection', function () {
      expect($('.orange, .pear', food).prev()).to.have.length(2);
    });

    describe('(selector) :', function () {
it('-378-should reject elements that violate the filter', function () {
        expect($('.orange').prev('.non-existent')).to.have.length(0);
      });

it('-379-should accept elements that satisify the filter', function () {
        expect($('.orange').prev('.apple')).to.have.length(1);
      });
    });
  });

  describe('.prevAll', function () {
it('-380-() : should return all preceding siblings', function () {
      var elems = $('.pear').prevAll();
      expect(elems).to.have.length(2);
      expect(elems[0].attribs['class']).to.equal('orange');
      expect(elems[1].attribs['class']).to.equal('apple');
    });

it('-381-(no prev) : should return empty for first child', function () {
      expect($('.apple').prevAll()).to.have.length(0);
    });

it('-382-(prevAll on empty object) : should return empty', function () {
      expect($('.banana').prevAll()).to.have.length(0);
    });

it('-383-() : should operate over all elements in the selection', function () {
      expect($('.orange, .sweetcorn', food).prevAll()).to.have.length(2);
    });

it('-384-() : should not contain duplicate elements', function () {
      var elems = $('.orange, .pear', food);
      expect(elems.prevAll()).to.have.length(2);
    });

    describe('(selector) :', function () {
it('-385-should filter returned elements', function () {
        var elems = $('.pear').prevAll('.apple');
        expect(elems).to.have.length(1);
      });

it("-386-should not consider siblings's descendents", function () {
        var elems = $('#vegetables', food).prevAll('li');
        expect(elems).to.have.length(0);
      });
    });
  });

  describe('.prevUntil', function () {
it('-387-() : should return all preceding siblings if no selector specified', function () {
      var elems = $('.pear').prevUntil();
      expect(elems).to.have.length(2);
      expect(elems[0].attribs['class']).to.equal('orange');
      expect(elems[1].attribs['class']).to.equal('apple');
    });

it('-388-() : should filter out non-element nodes', function () {
      var elems = $(
        '<div class="1"><div class="2"></div><!-- comment -->text<div class="3"></div></div>'
      );
      var div = elems.children().last();
      expect(div.prevUntil()).to.have.length(1);
    });

it('-389-() : should operate over all elements in the selection', function () {
      var elems = $('.pear, .sweetcorn', food);
      expect(elems.prevUntil()).to.have.length(3);
    });

it('-390-() : should not contain duplicate elements', function () {
      var elems = $('.orange, .pear', food);
      expect(elems.prevUntil()).to.have.length(2);
    });

it('-391-(selector) : should return all preceding siblings until selector', function () {
      var elems = $('.pear').prevUntil('.apple');
      expect(elems).to.have.length(1);
      expect(elems[0].attribs['class']).to.equal('orange');
    });

it('-392-(selector not sibling) : should return all preceding siblings', function () {
      var elems = $('.sweetcorn', food).prevUntil('#fruits');
      expect(elems).to.have.length(1);
      expect(elems[0].attribs['class']).to.equal('carrot');
    });

it('-393-(selector, filterString) : should return all preceding siblings until selector, filtered by filter', function () {
      var elems = $('.cider', drinks).prevUntil('.juice', '.water');
      expect(elems).to.have.length(1);
      expect(elems[0].attribs['class']).to.equal('water');
    });

it('-394-(selector, filterString) : should return all preceding siblings until selector', function () {
      var elems = $('<ul><li><p></p></li><li></li></ul>');
      var empty = elems.find('li').eq(1).prevUntil(null, 'p');
      expect(empty).to.have.length(0);
    });

it('-395-() : should return an empty object for first child', function () {
      expect($('.apple').prevUntil()).to.have.length(0);
    });

it('-396-() : should return an empty object when called on an empty object', function () {
      expect($('.banana').prevUntil()).to.have.length(0);
    });

it('-397-(node) : should return all previous siblings until the node', function () {
      var $fruits = $('#fruits').children();
      var elems = $fruits.eq(2).prevUntil($fruits[0]);
      expect(elems).to.have.length(1);
    });

it('-398-(cheerio object) : should return all previous siblings until any member of the cheerio object', function () {
      var $drinks = $(drinks).children();
      var $until = $([$drinks[0], $drinks[1]]);
      var elems = $drinks.eq(4).prevUntil($until);
      expect(elems).to.have.length(2);
    });
  });

  describe('.siblings', function () {
it('-399-() : should get all the siblings', function () {
      expect($('.orange').siblings()).to.have.length(2);
      expect($('#fruits').siblings()).to.have.length(0);
      expect($('.apple, .carrot', food).siblings()).to.have.length(3);
    });

it('-400-(selector) : should get all siblings that match the selector', function () {
      expect($('.orange').siblings('.apple')).to.have.length(1);
      expect($('.orange').siblings('.peach')).to.have.length(0);
    });

it('-401-(selector) : should throw an Error if given an invalid selector', function () {
      expect(function () {
        $('.orange').siblings(':bah');
      }).to.throwException(function (err) {
        expect(err).to.be.a(Error);
        expect(err.message).to.contain('unmatched pseudo-class');
      });
    });

it('-402-(selector) : does not consider the contents of siblings when filtering (GH-374)', function () {
      expect($('#fruits', food).siblings('li')).to.have.length(0);
    });
  });

  describe('.parents', function () {
    beforeEach(function () {
      $ = cheerio.load(food);
    });

it('-403-() : should get all of the parents in logical order', function () {
      var result = $('.orange').parents();
      expect(result).to.have.length(4);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
      expect(result[2].tagName).to.be('body');
      expect(result[3].tagName).to.be('html');
      result = $('#fruits').parents();
      expect(result).to.have.length(3);
      expect(result[0].attribs.id).to.be('food');
      expect(result[1].tagName).to.be('body');
      expect(result[2].tagName).to.be('html');
    });

it('-404-(selector) : should get all of the parents that match the selector in logical order', function () {
      var result = $('.orange').parents('#fruits');
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
      result = $('.orange').parents('ul');
      expect(result).to.have.length(2);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
    });

it('-405-() : should not break if the selector does not have any results', function () {
      var result = $('.saladbar').parents();
      expect(result).to.have.length(0);
    });

it('-406-() : should return an empty set for top-level elements', function () {
      var result = $('html').parents();
      expect(result).to.have.length(0);
    });

it('-407-() : should return the parents of every element in the *reveresed* collection, omitting duplicates', function () {
      var $parents = $('li').parents();

      expect($parents).to.have.length(5);
      expect($parents[0]).to.be($('#vegetables')[0]);
      expect($parents[1]).to.be($('#food')[0]);
      expect($parents[2]).to.be($('body')[0]);
      expect($parents[3]).to.be($('html')[0]);
      expect($parents[4]).to.be($('#fruits')[0]);
    });
  });

  describe('.parentsUntil', function () {
    beforeEach(function () {
      $ = cheerio.load(food);
    });

it('-408-() : should get all of the parents in logical order', function () {
      var result = $('.orange').parentsUntil();
      expect(result).to.have.length(4);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
      expect(result[2].tagName).to.be('body');
      expect(result[3].tagName).to.be('html');
    });

it('-409-() : should get all of the parents in reversed order, omitting duplicates', function () {
      var result = $('.apple, .sweetcorn').parentsUntil();
      expect(result).to.have.length(5);
      expect(result[0].attribs.id).to.be('vegetables');
      expect(result[1].attribs.id).to.be('food');
      expect(result[2].tagName).to.be('body');
      expect(result[3].tagName).to.be('html');
      expect(result[4].attribs.id).to.be('fruits');
    });

it('-410-(selector) : should get all of the parents until selector', function () {
      var result = $('.orange').parentsUntil('#food');
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
      result = $('.orange').parentsUntil('#fruits');
      expect(result).to.have.length(0);
    });

it('-411-(selector not parent) : should return all parents', function () {
      var result = $('.orange').parentsUntil('.apple');
      expect(result).to.have.length(4);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
      expect(result[2].tagName).to.be('body');
      expect(result[3].tagName).to.be('html');
    });

it('-412-(selector, filter) : should get all of the parents that match the filter', function () {
      var result = $('.apple, .sweetcorn').parentsUntil(
        '.saladbar',
        '#vegetables'
      );
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('vegetables');
    });

it('-413-() : should return empty object when called on an empty object', function () {
      var result = $('.saladbar').parentsUntil();
      expect(result).to.have.length(0);
    });

it('-414-() : should return an empty set for top-level elements', function () {
      var result = $('html').parentsUntil();
      expect(result).to.have.length(0);
    });

it('-415-(cheerio object) : should return all parents until any member of the cheerio object', function () {
      var $fruits = $('#fruits');
      var $until = $('#food');
      var result = $fruits.children().eq(1).parentsUntil($until);
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
    });
  });

  describe('.parent', function () {
it('-416-() : should return the parent of each matched element', function () {
      var result = $('.orange').parent();
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
      result = $('li', food).parent();
      expect(result).to.have.length(2);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('vegetables');
    });

it('-417-() : should return an empty object for top-level elements', function () {
      var result = $('html').parent();
      expect(result).to.have.length(0);
    });

it('-418-() : should not contain duplicate elements', function () {
      var result = $('li').parent();
      expect(result).to.have.length(1);
    });

it('-419-(selector) : should filter the matched parent elements by the selector', function () {
      var result = $('.orange').parent();
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
      result = $('li', food).parent('#fruits');
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
    });
  });

  describe('.closest', function () {
it('-420-() : should return an empty array', function () {
      var result = $('.orange').closest();
      expect(result).to.have.length(0);
      expect(result).to.be.a(cheerio);
    });

it('-421-(selector) : should find the closest element that matches the selector, searching through its ancestors and itself', function () {
      expect($('.orange').closest('.apple')).to.have.length(0);
      var result = $('.orange', food).closest('#food');
      expect(result[0].attribs.id).to.be('food');
      result = $('.orange', food).closest('ul');
      expect(result[0].attribs.id).to.be('fruits');
      result = $('.orange', food).closest('li');
      expect(result[0].attribs['class']).to.be('orange');
    });

it('-422-(selector) : should find the closest element of each item, removing duplicates', function () {
      var result = $('li', food).closest('ul');
      expect(result).to.have.length(2);
    });

it('-423-() : should not break if the selector does not have any results', function () {
      var result = $('.saladbar', food).closest('ul');
      expect(result).to.have.length(0);
    });
  });

  describe('.each', function () {
it('-424-( (i, elem) -> ) : should loop selected returning fn with (i, elem)', function () {
      var items = [],
          classes = ['apple', 'orange', 'pear'];
      $('li').each(function (idx, elem) {
        items[idx] = elem;
        expect(this.attribs['class']).to.equal(classes[idx]);
      });
      expect(items[0].attribs['class']).to.equal('apple');
      expect(items[1].attribs['class']).to.equal('orange');
      expect(items[2].attribs['class']).to.equal('pear');
    });

it('-425-( (i, elem) -> ) : should break iteration when the iterator function returns false', function () {
      var iterationCount = 0;
      $('li').each(function (idx) {
        iterationCount++;
        return idx < 1;
      });

      expect(iterationCount).to.equal(2);
    });
  });

  if (typeof Symbol !== 'undefined') {
    describe('[Symbol.iterator]', function () {
it('-426-should yield each element', function () {
        // The equivalent of: for (const element of $('li')) ...
        var $li = $('li'),
            iterator = $li[Symbol.iterator]();
        expect(iterator.next().value.attribs['class']).to.equal('apple');
        expect(iterator.next().value.attribs['class']).to.equal('orange');
        expect(iterator.next().value.attribs['class']).to.equal('pear');
        expect(iterator.next().done).to.equal(true);
      });
    });
  }

  describe('.map', function () {
it('-427-(fn) : should be invoked with the correct arguments and context', function () {
      var $fruits = $('li');
      var args = [];
      var thisVals = [];

      $fruits.map(function () {
        args.push(Array.prototype.slice.call(arguments));
        thisVals.push(this);
      });

      expect(args).to.eql([
        [0, $fruits[0]],
        [1, $fruits[1]],
        [2, $fruits[2]],
      ]);
      expect(thisVals).to.eql([$fruits[0], $fruits[1], $fruits[2]]);
    });

it('-428-(fn) : should return an Cheerio object wrapping the returned items', function () {
      var $fruits = $('li');
      var $mapped = $fruits.map(function (i) {
        return $fruits[2 - i];
      });

      expect($mapped).to.have.length(3);
      expect($mapped[0]).to.be($fruits[2]);
      expect($mapped[1]).to.be($fruits[1]);
      expect($mapped[2]).to.be($fruits[0]);
    });

it('-429-(fn) : should ignore `null` and `undefined` returned by iterator', function () {
      var $fruits = $('li');
      var retVals = [null, undefined, $fruits[1]];

      var $mapped = $fruits.map(function (i) {
        return retVals[i];
      });

      expect($mapped).to.have.length(1);
      expect($mapped[0]).to.be($fruits[1]);
    });

it('-430-(fn) : should preform a shallow merge on arrays returned by iterator', function () {
      var $fruits = $('li');

      var $mapped = $fruits.map(function () {
        return [1, [3, 4]];
      });

      expect($mapped.get()).to.eql([1, [3, 4], 1, [3, 4], 1, [3, 4]]);
    });

it('-431-(fn) : should tolerate `null` and `undefined` when flattening arrays returned by iterator', function () {
      var $fruits = $('li');

      var $mapped = $fruits.map(function () {
        return [null, undefined];
      });

      expect($mapped.get()).to.eql([
        null,
        undefined,
        null,
        undefined,
        null,
        undefined,
      ]);
    });
  });

  describe('.filter', function () {
it('-432-(selector) : should reduce the set of matched elements to those that match the selector', function () {
      var pear = $('li').filter('.pear').text();
      expect(pear).to.be('Pear');
    });

it('-433-(selector) : should not consider nested elements', function () {
      var lis = $('#fruits').filter('li');
      expect(lis).to.have.length(0);
    });

it('-434-(selection) : should reduce the set of matched elements to those that are contained in the provided selection', function () {
      var $fruits = $('li');
      var $pear = $fruits.filter('.pear, .apple');
      expect($fruits.filter($pear)).to.have.length(2);
    });

it('-435-(element) : should reduce the set of matched elements to those that specified directly', function () {
      var $fruits = $('li');
      var pear = $fruits.filter('.pear')[0];
      expect($fruits.filter(pear)).to.have.length(1);
    });

it("-436-(fn) : should reduce the set of matched elements to those that pass the function's test", function () {
      var orange = $('li')
        .filter(function (i, el) {
          expect(this).to.be(el);
          expect(el.tagName).to.be('li');
          expect(i).to.be.a('number');
          return $(this).attr('class') === 'orange';
        })
        .text();

      expect(orange).to.be('Orange');
    });
  });

  describe('.not', function () {
it('-437-(selector) : should reduce the set of matched elements to those that do not match the selector', function () {
      var $fruits = $('li');

      var $notPear = $fruits.not('.pear');

      expect($notPear).to.have.length(2);
      expect($notPear[0]).to.be($fruits[0]);
      expect($notPear[1]).to.be($fruits[1]);
    });

it('-438-(selector) : should not consider nested elements', function () {
      var lis = $('#fruits').not('li');
      expect(lis).to.have.length(1);
    });

it('-439-(selection) : should reduce the set of matched elements to those that are mot contained in the provided selection', function () {
      var $fruits = $('li');
      var $orange = $('.orange');

      var $notOrange = $fruits.not($orange);

      expect($notOrange).to.have.length(2);
      expect($notOrange[0]).to.be($fruits[0]);
      expect($notOrange[1]).to.be($fruits[2]);
    });

it('-440-(element) : should reduce the set of matched elements to those that specified directly', function () {
      var $fruits = $('li');
      var apple = $('.apple')[0];

      var $notApple = $fruits.not(apple);

      expect($notApple).to.have.length(2);
      expect($notApple[0]).to.be($fruits[1]);
      expect($notApple[1]).to.be($fruits[2]);
    });

it("-441-(fn) : should reduce the set of matched elements to those that do not pass the function's test", function () {
      var $fruits = $('li');

      var $notOrange = $fruits.not(function (i, el) {
        expect(this).to.be(el);
        expect(el.name).to.be('li');
        expect(i).to.be.a('number');
        return $(this).attr('class') === 'orange';
      });

      expect($notOrange).to.have.length(2);
      expect($notOrange[0]).to.be($fruits[0]);
      expect($notOrange[1]).to.be($fruits[2]);
    });
  });

  describe('.has', function () {
    beforeEach(function () {
      $ = cheerio.load(food);
    });

it('-442-(selector) : should reduce the set of matched elements to those with descendants that match the selector', function () {
      var $fruits = $('#fruits,#vegetables').has('.pear');
      expect($fruits).to.have.length(1);
      expect($fruits[0]).to.be($('#fruits')[0]);
    });

it('-443-(selector) : should only consider nested elements', function () {
      var $empty = $('#fruits').has('#fruits');
      expect($empty).to.have.length(0);
    });

it('-444-(element) : should reduce the set of matched elements to those that are ancestors of the provided element', function () {
      var $fruits = $('#fruits,#vegetables').has($('.pear')[0]);
      expect($fruits).to.have.length(1);
      expect($fruits[0]).to.be($('#fruits')[0]);
    });

it('-445-(element) : should only consider nested elements', function () {
      var $fruits = $('#fruits');
      var fruitsEl = $fruits[0];
      var $empty = $fruits.has(fruitsEl);

      expect($empty).to.have.length(0);
    });
  });

  describe('.first', function () {
it('-446-() : should return the first item', function () {
      var $src = $('<span>foo</span><span>bar</span><span>baz</span>');
      var $elem = $src.first();
      expect($elem.length).to.equal(1);
      expect($elem[0].childNodes[0].data).to.equal('foo');
    });

it('-447-() : should return an empty object for an empty object', function () {
      var $src = $();
      var $first = $src.first();
      expect($first.length).to.equal(0);
      expect($first[0]).to.be(undefined);
    });
  });

  describe('.last', function () {
it('-448-() : should return the last element', function () {
      var $src = $('<span>foo</span><span>bar</span><span>baz</span>');
      var $elem = $src.last();
      expect($elem.length).to.equal(1);
      expect($elem[0].childNodes[0].data).to.equal('baz');
    });

it('-449-() : should return an empty object for an empty object', function () {
      var $src = $();
      var $last = $src.last();
      expect($last.length).to.equal(0);
      expect($last[0]).to.be(undefined);
    });
  });

  describe('.first & .last', function () {
it('-450-() : should return equivalent collections if only one element', function () {
      var $src = $('<span>bar</span>');
      var $first = $src.first();
      var $last = $src.last();
      expect($first.length).to.equal(1);
      expect($first[0].childNodes[0].data).to.equal('bar');
      expect($last.length).to.equal(1);
      expect($last[0].childNodes[0].data).to.equal('bar');
      expect($first[0]).to.equal($last[0]);
    });
  });

  describe('.eq', function () {
    function getText(el) {
      if (!el.length) return '';
      return el[0].childNodes[0].data;
    }

it('-451-(i) : should return the element at the specified index', function () {
      expect(getText($('li').eq(0))).to.equal('Apple');
      expect(getText($('li').eq(1))).to.equal('Orange');
      expect(getText($('li').eq(2))).to.equal('Pear');
      expect(getText($('li').eq(3))).to.equal('');
      expect(getText($('li').eq(-1))).to.equal('Pear');
    });
  });

  describe('.get', function () {
it('-452-(i) : should return the element at the specified index', function () {
      var children = $('#fruits').children();
      expect(children.get(0)).to.be(children[0]);
      expect(children.get(1)).to.be(children[1]);
      expect(children.get(2)).to.be(children[2]);
    });

it('-453-(-1) : should return the element indexed from the end of the collection', function () {
      var children = $('#fruits').children();
      expect(children.get(-1)).to.be(children[2]);
      expect(children.get(-2)).to.be(children[1]);
      expect(children.get(-3)).to.be(children[0]);
    });

it('-454-() : should return an array containing all of the collection', function () {
      var children = $('#fruits').children();
      var all = children.get();
      expect(Array.isArray(all)).to.be.ok();
      expect(all).to.eql([children[0], children[1], children[2]]);
    });
  });

  describe('.index', function () {
    describe('() : ', function () {
it('-455-returns the index of a child amongst its siblings', function () {
        expect($('.orange').index()).to.be(1);
      });
it('-456-returns -1 when the selection has no parent', function () {
        expect($('<div/>').index()).to.be(-1);
      });
    });

    describe('(selector) : ', function () {
it('-457-returns the index of the first element in the set matched by `selector`', function () {
        expect($('.apple').index('#fruits, li')).to.be(1);
      });
it('-458-returns -1 when the item is not present in the set matched by `selector`', function () {
        expect($('.apple').index('#fuits')).to.be(-1);
      });
it('-459-returns -1 when the first element in the set has no parent', function () {
        expect($('<div/>').index('*')).to.be(-1);
      });
    });

    describe('(node) : ', function () {
it('-460-returns the index of the given node within the current selection', function () {
        var $lis = $('li');
        expect($lis.index($lis.get(1))).to.be(1);
      });
it('-461-returns the index of the given node within the current selection when the current selection has no parent', function () {
        var $apple = $('.apple').remove();

        expect($apple.index($apple.get(0))).to.be(0);
      });
it('-462-returns -1 when the given node is not present in the current selection', function () {
        expect($('li').index($('#fruits').get(0))).to.be(-1);
      });
it('-463-returns -1 when the current selection is empty', function () {
        expect($('.not-fruit').index($('#fruits').get(0))).to.be(-1);
      });
    });

    describe('(selection) : ', function () {
it('-464-returns the index of the first node in the provided selection within the current selection', function () {
        var $lis = $('li');
        expect($lis.index($('.orange, .pear'))).to.be(1);
      });
it('-465-returns -1 when the given node is not present in the current selection', function () {
        expect($('li').index($('#fruits'))).to.be(-1);
      });
it('-466-returns -1 when the current selection is empty', function () {
        expect($('.not-fruit').index($('#fruits'))).to.be(-1);
      });
    });
  });

  describe('.slice', function () {
    function getText(el) {
      if (!el.length) return '';
      return el[0].childNodes[0].data;
    }

it('-467-(start) : should return all elements after the given index', function () {
      var sliced = $('li').slice(1);
      expect(sliced).to.have.length(2);
      expect(getText(sliced.eq(0))).to.equal('Orange');
      expect(getText(sliced.eq(1))).to.equal('Pear');
    });

it('-468-(start, end) : should return all elements matching the given range', function () {
      var sliced = $('li').slice(1, 2);
      expect(sliced).to.have.length(1);
      expect(getText(sliced.eq(0))).to.equal('Orange');
    });

it('-469-(-start) : should return element matching the offset from the end', function () {
      var sliced = $('li').slice(-1);
      expect(sliced).to.have.length(1);
      expect(getText(sliced.eq(0))).to.equal('Pear');
    });
  });

  describe('.end() :', function () {
    var $fruits;

    beforeEach(function () {
      $fruits = $('#fruits').children();
    });

it('-470-returns an empty object at the end of the chain', function () {
      expect($fruits.end().end().end()).to.be.ok();
      expect($fruits.end().end().end()).to.have.length(0);
    });
it('-471-find', function () {
      expect($fruits.find('.apple').end()).to.be($fruits);
    });
it('-472-filter', function () {
      expect($fruits.filter('.apple').end()).to.be($fruits);
    });
it('-473-map', function () {
      expect(
        $fruits
          .map(function () {
            return this;
          })
          .end()
      ).to.be($fruits);
    });
it('-474-contents', function () {
      expect($fruits.contents().end()).to.be($fruits);
    });
it('-475-eq', function () {
      expect($fruits.eq(1).end()).to.be($fruits);
    });
it('-476-first', function () {
      expect($fruits.first().end()).to.be($fruits);
    });
it('-477-last', function () {
      expect($fruits.last().end()).to.be($fruits);
    });
it('-478-slice', function () {
      expect($fruits.slice(1).end()).to.be($fruits);
    });
it('-479-children', function () {
      expect($fruits.children().end()).to.be($fruits);
    });
it('-480-parent', function () {
      expect($fruits.parent().end()).to.be($fruits);
    });
it('-481-parents', function () {
      expect($fruits.parents().end()).to.be($fruits);
    });
it('-482-closest', function () {
      expect($fruits.closest('ul').end()).to.be($fruits);
    });
it('-483-siblings', function () {
      expect($fruits.siblings().end()).to.be($fruits);
    });
it('-484-next', function () {
      expect($fruits.next().end()).to.be($fruits);
    });
it('-485-nextAll', function () {
      expect($fruits.nextAll().end()).to.be($fruits);
    });
it('-486-prev', function () {
      expect($fruits.prev().end()).to.be($fruits);
    });
it('-487-prevAll', function () {
      expect($fruits.prevAll().end()).to.be($fruits);
    });
it('-488-clone', function () {
      expect($fruits.clone().end()).to.be($fruits);
    });
  });

  describe('.add', function () {
    var $fruits, $apple, $orange, $pear, $carrot, $sweetcorn;

    beforeEach(function () {
      $ = cheerio.load(food);
      $fruits = $('#fruits');
      $apple = $('.apple');
      $orange = $('.orange');
      $pear = $('.pear');
      $carrot = $('.carrot');
      $sweetcorn = $('.sweetcorn');
    });

    describe('(selector', function () {
      describe(') :', function () {
        describe('matched element', function () {
it('-491-occurs before current selection', function () {
            var $selection = $orange.add('.apple');

            expect($selection).to.have.length(2);
            expect($selection[0]).to.be($apple[0]);
            expect($selection[1]).to.be($orange[0]);
          });
it('-492-is identical to the current selection', function () {
            var $selection = $orange.add('.orange');

            expect($selection).to.have.length(1);
            expect($selection[0]).to.be($orange[0]);
          });
it('-493-occurs after current selection', function () {
            var $selection = $orange.add('.pear');

            expect($selection).to.have.length(2);
            expect($selection[0]).to.be($orange[0]);
            expect($selection[1]).to.be($pear[0]);
          });
it('-494-contains the current selection', function () {
            var $selection = $orange.add('#fruits');

            expect($selection).to.have.length(2);
            expect($selection[0]).to.be($fruits[0]);
            expect($selection[1]).to.be($orange[0]);
          });
it('-495-is a child of the current selection', function () {
            var $selection = $fruits.add('.orange');

            expect($selection).to.have.length(2);
            expect($selection[0]).to.be($fruits[0]);
            expect($selection[1]).to.be($orange[0]);
          });
        });
        describe('matched elements', function () {
it('-496-occur before the current selection', function () {
            var $selection = $pear.add('.apple, .orange');

            expect($selection).to.have.length(3);
            expect($selection[0]).to.be($apple[0]);
            expect($selection[1]).to.be($orange[0]);
            expect($selection[2]).to.be($pear[0]);
          });
it('-497-include the current selection', function () {
            var $selection = $pear.add('#fruits li');

            expect($selection).to.have.length(3);
            expect($selection[0]).to.be($apple[0]);
            expect($selection[1]).to.be($orange[0]);
            expect($selection[2]).to.be($pear[0]);
          });
it('-498-occur after the current selection', function () {
            var $selection = $apple.add('.orange, .pear');

            expect($selection).to.have.length(3);
            expect($selection[0]).to.be($apple[0]);
            expect($selection[1]).to.be($orange[0]);
            expect($selection[2]).to.be($pear[0]);
          });
it('-499-occur within the current selection', function () {
            var $selection = $fruits.add('#fruits li');

            expect($selection).to.have.length(4);
            expect($selection[0]).to.be($fruits[0]);
            expect($selection[1]).to.be($apple[0]);
            expect($selection[2]).to.be($orange[0]);
            expect($selection[3]).to.be($pear[0]);
          });
        });
      });
it('-490-, context)', function () {
        var $selection = $fruits.add('li', '#vegetables');
        expect($selection).to.have.length(3);
        expect($selection[0]).to.be($fruits[0]);
        expect($selection[1]).to.be($carrot[0]);
        expect($selection[2]).to.be($sweetcorn[0]);
      });
    });

    describe('(element) :', function () {
      describe('honors document order when element occurs', function () {
it('-501-before the current selection', function () {
          var $selection = $orange.add($apple[0]);

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($apple[0]);
          expect($selection[1]).to.be($orange[0]);
        });
it('-502-after the current selection', function () {
          var $selection = $orange.add($pear[0]);

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($orange[0]);
          expect($selection[1]).to.be($pear[0]);
        });
it('-503-within the current selection', function () {
          var $selection = $fruits.add($orange[0]);

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($fruits[0]);
          expect($selection[1]).to.be($orange[0]);
        });
it('-504-as an ancestor of the current selection', function () {
          var $selection = $orange.add($fruits[0]);

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($fruits[0]);
          expect($selection[1]).to.be($orange[0]);
        });
      });
it('-500-does not insert an element already contained within the current selection', function () {
        var $selection = $apple.add($apple[0]);

        expect($selection).to.have.length(1);
        expect($selection[0]).to.be($apple[0]);
      });
    });
    describe('([elements]) : elements', function () {
it('-505-occur before the current selection', function () {
        var $selection = $pear.add($('.apple, .orange').get());

        expect($selection).to.have.length(3);
        expect($selection[0]).to.be($apple[0]);
        expect($selection[1]).to.be($orange[0]);
        expect($selection[2]).to.be($pear[0]);
      });
it('-506-include the current selection', function () {
        var $selection = $pear.add($('#fruits li').get());

        expect($selection).to.have.length(3);
        expect($selection[0]).to.be($apple[0]);
        expect($selection[1]).to.be($orange[0]);
        expect($selection[2]).to.be($pear[0]);
      });
it('-507-occur after the current selection', function () {
        var $selection = $apple.add($('.orange, .pear').get());

        expect($selection).to.have.length(3);
        expect($selection[0]).to.be($apple[0]);
        expect($selection[1]).to.be($orange[0]);
        expect($selection[2]).to.be($pear[0]);
      });
it('-508-occur within the current selection', function () {
        var $selection = $fruits.add($('#fruits li').get());

        expect($selection).to.have.length(4);
        expect($selection[0]).to.be($fruits[0]);
        expect($selection[1]).to.be($apple[0]);
        expect($selection[2]).to.be($orange[0]);
        expect($selection[3]).to.be($pear[0]);
      });
    });

    /**
     * Element order is undefined in this case, so it should not be asserted
     * here.
     *
     * > If the collection consists of elements from different documents or
     * > ones not in any document, the sort order is undefined.
     *
     * Http://api.jquery.com/add/.
     */
it('-489-(html) : correctly parses and adds the new elements', function () {
      var $selection = $apple.add('<li class="banana">banana</li>');

      expect($selection).to.have.length(2);
      expect($selection.is('.apple')).to.be(true);
      expect($selection.is('.banana')).to.be(true);
    });

    describe('(selection) :', function () {
      describe('element in selection', function () {
it('-509-occurs before current selection', function () {
          var $selection = $orange.add($('.apple'));

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($apple[0]);
          expect($selection[1]).to.be($orange[0]);
        });
it('-510-is identical to the current selection', function () {
          var $selection = $orange.add($('.orange'));

          expect($selection).to.have.length(1);
          expect($selection[0]).to.be($orange[0]);
        });
it('-511-occurs after current selection', function () {
          var $selection = $orange.add($('.pear'));

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($orange[0]);
          expect($selection[1]).to.be($pear[0]);
        });
it('-512-contains the current selection', function () {
          var $selection = $orange.add($('#fruits'));

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($fruits[0]);
          expect($selection[1]).to.be($orange[0]);
        });
it('-513-is a child of the current selection', function () {
          var $selection = $fruits.add($('.orange'));

          expect($selection).to.have.length(2);
          expect($selection[0]).to.be($fruits[0]);
          expect($selection[1]).to.be($orange[0]);
        });
      });
      describe('elements in the selection', function () {
it('-514-occur before the current selection', function () {
          var $selection = $pear.add($('.apple, .orange'));

          expect($selection).to.have.length(3);
          expect($selection[0]).to.be($apple[0]);
          expect($selection[1]).to.be($orange[0]);
          expect($selection[2]).to.be($pear[0]);
        });
it('-515-include the current selection', function () {
          var $selection = $pear.add($('#fruits li'));

          expect($selection).to.have.length(3);
          expect($selection[0]).to.be($apple[0]);
          expect($selection[1]).to.be($orange[0]);
          expect($selection[2]).to.be($pear[0]);
        });
it('-516-occur after the current selection', function () {
          var $selection = $apple.add($('.orange, .pear'));

          expect($selection).to.have.length(3);
          expect($selection[0]).to.be($apple[0]);
          expect($selection[1]).to.be($orange[0]);
          expect($selection[2]).to.be($pear[0]);
        });
it('-517-occur within the current selection', function () {
          var $selection = $fruits.add($('#fruits li'));

          expect($selection).to.have.length(4);
          expect($selection[0]).to.be($fruits[0]);
          expect($selection[1]).to.be($apple[0]);
          expect($selection[2]).to.be($orange[0]);
          expect($selection[3]).to.be($pear[0]);
        });
      });
    });
  });

  describe('.addBack', function () {
    describe('() : ', function () {
it('-519-includes siblings and self', function () {
        var $selection = $('.orange').siblings().addBack();

        expect($selection).to.have.length(3);
        expect($selection[0]).to.be($('.apple')[0]);
        expect($selection[1]).to.be($('.orange')[0]);
        expect($selection[2]).to.be($('.pear')[0]);
      });
it('-520-includes children and self', function () {
        var $selection = $('#fruits').children().addBack();

        expect($selection).to.have.length(4);
        expect($selection[0]).to.be($('#fruits')[0]);
        expect($selection[1]).to.be($('.apple')[0]);
        expect($selection[2]).to.be($('.orange')[0]);
        expect($selection[3]).to.be($('.pear')[0]);
      });
it('-521-includes parent and self', function () {
        var $selection = $('.apple').parent().addBack();

        expect($selection).to.have.length(2);
        expect($selection[0]).to.be($('#fruits')[0]);
        expect($selection[1]).to.be($('.apple')[0]);
      });
it('-522-includes parents and self', function () {
        var q = cheerio.load(food);
        var $selection = q('.apple').parents().addBack();

        expect($selection).to.have.length(5);
        expect($selection[0]).to.be(q('html')[0]);
        expect($selection[1]).to.be(q('body')[0]);
        expect($selection[2]).to.be(q('#food')[0]);
        expect($selection[3]).to.be(q('#fruits')[0]);
        expect($selection[4]).to.be(q('.apple')[0]);
      });
    });
it('-518-(filter) : filters the previous selection', function () {
      var $selection = $('li').eq(1).addBack('.apple');

      expect($selection).to.have.length(2);
      expect($selection[0]).to.be($('.apple')[0]);
      expect($selection[1]).to.be($('.orange')[0]);
    });
  });
});
