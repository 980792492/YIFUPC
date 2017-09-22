import Web from '@/utils/Web'

if (!window.Quill && !Web.isIE()) {
  window.Quill = require('quill/dist/quill.js')
  const BlockEmbed = Quill.import('blots/block/embed')
  const Link = Quill.import('formats/link')
}

const ATTRIBUTES = [
  'height',
  'width'
];


class Swf extends BlockEmbed {
  static create({ value, width, height }) {
    let node = super.create(value);
    node.setAttribute('type', 'application/x-shockwave-flash');
    node.setAttribute('allowfullscreen', true);
    node.setAttribute('data', this.sanitize(value));
    width && node.setAttribute('width', width);
    height && node.setAttribute('height', height);
    node.innerHTML = '<param name="movie" value="' + this.sanitize(value) + '">'
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Swf.blotName = 'swf';
Swf.className = 'ql-swf';
Swf.tagName = 'object';


export default Swf;
