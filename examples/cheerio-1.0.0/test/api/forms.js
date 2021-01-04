var expect = require('expect.js'),
    cheerio = require('../..'),
    forms = require('../fixtures').forms;

describe('$(...)', function () {
  var $;

  beforeEach(function () {
    $ = cheerio.load(forms);
  });

  describe('.serializeArray', function () {
it('-139-() : should get form controls', function () {
      expect($('form#simple').serializeArray()).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
      ]);
    });

it('-140-() : should get nested form controls', function () {
      expect($('form#nested').serializeArray()).to.have.length(2);
      var data = $('form#nested').serializeArray();
      data.sort(function (a, b) {
        return a.value - b.value;
      });
      expect(data).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
        {
          name: 'vegetable',
          value: 'Carrot',
        },
      ]);
    });

it('-141-() : should not get disabled form controls', function () {
      expect($('form#disabled').serializeArray()).to.eql([]);
    });

it('-142-() : should not get form controls with the wrong type', function () {
      expect($('form#submit').serializeArray()).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
      ]);
    });

it('-143-() : should get selected options', function () {
      expect($('form#select').serializeArray()).to.eql([
        {
          name: 'fruit',
          value: 'Orange',
        },
      ]);
    });

it('-144-() : should not get unnamed form controls', function () {
      expect($('form#unnamed').serializeArray()).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
      ]);
    });

it('-145-() : should get multiple selected options', function () {
      expect($('form#multiple').serializeArray()).to.have.length(2);
      var data = $('form#multiple').serializeArray();
      data.sort(function (a, b) {
        return a.value - b.value;
      });
      expect(data).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
        {
          name: 'fruit',
          value: 'Orange',
        },
      ]);
    });

it('-146-() : should get individually selected elements', function () {
      var data = $('form#nested input').serializeArray();
      data.sort(function (a, b) {
        return a.value - b.value;
      });
      expect(data).to.eql([
        {
          name: 'fruit',
          value: 'Apple',
        },
        {
          name: 'vegetable',
          value: 'Carrot',
        },
      ]);
    });

it('-147-() : should standardize line breaks', function () {
      expect($('form#textarea').serializeArray()).to.eql([
        {
          name: 'fruits',
          value: 'Apple\r\nOrange',
        },
      ]);
    });

    it("-148-() : shouldn't serialize the empty string", function () {
      expect($('<input value=pineapple>').serializeArray()).to.eql([]);
      expect($('<input name="" value=pineapple>').serializeArray()).to.eql([]);
      expect($('<input name="fruit" value=pineapple>').serializeArray()).to.eql(
        [
          {
            name: 'fruit',
            value: 'pineapple',
          },
        ]
      );
    });

it('-149-() : should serialize inputs without value attributes', function () {
      expect($('<input name="fruit">').serializeArray()).to.eql([
        {
          name: 'fruit',
          value: '',
        },
      ]);
    });
  });

  describe('.serialize', function () {
it('-150-() : should get form controls', function () {
      expect($('form#simple').serialize()).to.equal('fruit=Apple');
    });

it('-151-() : should get nested form controls', function () {
      expect($('form#nested').serialize()).to.equal(
        'fruit=Apple&vegetable=Carrot'
      );
    });

it('-152-() : should not get disabled form controls', function () {
      expect($('form#disabled').serialize()).to.equal('');
    });

it('-153-() : should get multiple selected options', function () {
      expect($('form#multiple').serialize()).to.equal(
        'fruit=Apple&fruit=Orange'
      );
    });

    it("-154-() : should encode spaces as +'s", function () {
      expect($('form#spaces').serialize()).to.equal('fruit=Blood+orange');
    });
  });
});
