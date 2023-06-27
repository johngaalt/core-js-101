/* eslint-disable max-classes-per-file */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  // eslint-disable-next-line func-names
  Rectangle.prototype.getArea = function () {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(/* proto, json */) {
  throw new Error('Not implemented');
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BaseSelector {
  constructor() {
    this.parts = [];
    this.hasElement = false;
    this.partOrder = [];
  }

  validateOrder(currentPart) {
    const lastPart = this.partOrder[this.partOrder.length - 1];
    const validOrder = [
      'element',
      'id',
      'class',
      'attribute',
      'pseudoClass',
      'pseudoElement',
    ];

    if (
      lastPart
      && validOrder.indexOf(lastPart) > validOrder.indexOf(currentPart)
    ) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.partOrder.push(currentPart);
  }

  element(element) {
    this.validateOrder('element');
    if (this.hasElement) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.parts.push(element);
    this.hasElement = true;
    return this;
  }

  id(id) {
    this.validateOrder('id');
    const hasId = this.parts.some((p) => p.startsWith('#'));

    if (hasId) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.parts.push(`#${id}`);
    return this;
  }

  class(className) {
    this.validateOrder('class');
    this.parts.push(`.${className}`);
    return this;
  }

  attr(attribute) {
    this.validateOrder('attribute');
    this.parts.push(`[${attribute}]`);
    return this;
  }

  pseudoClass(pseudoClass) {
    this.validateOrder('pseudoClass');
    this.parts.push(`:${pseudoClass}`);
    return this;
  }

  pseudoElement(pseudoElement) {
    this.validateOrder('pseudoElement');
    const hasPseudoElement = this.parts.some((p) => p.startsWith('::'));

    if (hasPseudoElement) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.parts.push(`::${pseudoElement}`);
    return this;
  }

  combine(selector, combinator) {
    const combinedParts = [...this.parts, ` ${combinator} `, ...selector.parts];
    const newSelector = new BaseSelector();
    newSelector.parts = combinedParts;
    return newSelector;
  }

  stringify() {
    return this.parts.join('');
  }
}

class ElementSelector extends BaseSelector {
  constructor(element) {
    super();

    this.validateOrder('element');
    if (this.hasElement) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.hasElement = true;
    this.parts.push(element);
  }
}

class IdSelector extends BaseSelector {
  constructor(id) {
    super();

    this.validateOrder('id');
    const hasId = this.parts.some((p) => p.startsWith('#'));

    if (hasId) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.parts.push(`#${id}`);
  }
}

class ClassSelector extends BaseSelector {
  constructor(className) {
    super();
    this.validateOrder('class');
    this.parts.push(`.${className}`);
  }
}

class AttrSelector extends BaseSelector {
  constructor(attribute) {
    super();
    this.validateOrder('attribute');
    this.parts.push(`[${attribute}]`);
  }
}

class PseudoClassSelector extends BaseSelector {
  constructor(pseudoClass) {
    super();
    this.validateOrder('pseudoClass');
    this.parts.push(`:${pseudoClass}`);
  }
}

class PseudoElementSelector extends BaseSelector {
  constructor(pseudoElement) {
    super();

    this.validateOrder('pseudoElement');
    const hasPseudoElement = this.parts.some((p) => p.startsWith('::'));

    if (hasPseudoElement) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.parts.push(`::${pseudoElement}`);
  }
}

// Usage example:

const cssSelectorBuilder = {
  element(element) {
    return new ElementSelector(element);
  },
  id(id) {
    return new IdSelector(id);
  },
  class(className) {
    return new ClassSelector(className);
  },
  attr(attribute) {
    return new AttrSelector(attribute);
  },
  pseudoClass(pseudoClass) {
    return new PseudoClassSelector(pseudoClass);
  },
  pseudoElement(pseudoElement) {
    return new PseudoElementSelector(pseudoElement);
  },
  combine(selector1, combinator, selector2) {
    return selector1.combine(selector2, combinator);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
