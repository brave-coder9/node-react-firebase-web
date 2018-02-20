'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TextBlock = require('./TextBlock');

var _TextBlock2 = _interopRequireDefault(_TextBlock);

var _RoundShape = require('./RoundShape');

var _RoundShape2 = _interopRequireDefault(_RoundShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaBlock = (_temp = _class = function (_React$Component) {
  _inherits(MediaBlock, _React$Component);

  function MediaBlock() {
    _classCallCheck(this, MediaBlock);

    return _possibleConstructorReturn(this, (MediaBlock.__proto__ || Object.getPrototypeOf(MediaBlock)).apply(this, arguments));
  }

  _createClass(MediaBlock, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          color = _props.color,
          rows = _props.rows;


      var classes = ['media-block', className].filter(function (c) {
        return c;
      }).join(' ');

      return _react2.default.createElement(
        'div',
        { className: classes, style: _extends({}, style, { display: 'flex' }) },
        _react2.default.createElement(_RoundShape2.default, {
          color: color,
          style: { minHeight: 55, width: 55, minWidth: 55, marginRight: 10 }
        }),
        _react2.default.createElement(_TextBlock2.default, { color: color, rows: rows })
      );
    }
  }]);

  return MediaBlock;
}(_react2.default.Component), _class.propTypes = {
  rows: _propTypes2.default.number.isRequired,
  color: _propTypes2.default.string.isRequired,
  style: _propTypes2.default.object,
  className: _propTypes2.default.string
}, _temp);
exports.default = MediaBlock;