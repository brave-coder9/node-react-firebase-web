'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _placeholders = require('./placeholders');

var placeholders = _interopRequireWildcard(_placeholders);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactPlaceholder = (_temp2 = _class = function (_React$Component) {
  _inherits(ReactPlaceholder, _React$Component);

  function ReactPlaceholder() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPlaceholder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactPlaceholder.__proto__ || Object.getPrototypeOf(ReactPlaceholder)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      ready: _this.props.ready
    }, _this.getFiller = function () {
      var _this$props = _this.props,
          firstLaunchOnly = _this$props.firstLaunchOnly,
          children = _this$props.children,
          ready = _this$props.ready,
          className = _this$props.className,
          type = _this$props.type,
          customPlaceholder = _this$props.customPlaceholder,
          showLoadingAnimation = _this$props.showLoadingAnimation,
          rest = _objectWithoutProperties(_this$props, ['firstLaunchOnly', 'children', 'ready', 'className', 'type', 'customPlaceholder', 'showLoadingAnimation']);

      var classes = showLoadingAnimation ? ['show-loading-animation', className].filter(function (c) {
        return c;
      }).join(' ') : className;

      if (customPlaceholder && _react2.default.isValidElement(customPlaceholder)) {
        var mergedCustomClasses = [customPlaceholder.props.className, classes].filter(function (c) {
          return c;
        }).join(' ');
        return _react2.default.cloneElement(customPlaceholder, { className: mergedCustomClasses });
      } else if (customPlaceholder) {
        return customPlaceholder;
      }

      var Placeholder = placeholders[type];

      return _react2.default.createElement(Placeholder, _extends({}, rest, { className: classes }));
    }, _this.setNotReady = function () {
      var delay = _this.props.delay;


      if (delay > 0) {
        _this.timeout = setTimeout(function () {
          _this.setState({ ready: false });
        }, delay);
      } else {
        _this.setState({ ready: false });
      }
    }, _this.setReady = function () {
      if (_this.timeout) {
        clearTimeout(_this.timeout);
      }

      if (!_this.state.ready) {
        _this.setState({ ready: true });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactPlaceholder, [{
    key: 'render',
    value: function render() {
      return this.state.ready ? this.props.children : this.getFiller();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!this.props.firstLaunchOnly && this.state.ready && !nextProps.ready) {
        this.setNotReady();
      } else if (nextProps.ready) {
        this.setReady();
      }
    }
  }]);

  return ReactPlaceholder;
}(_react2.default.Component), _class.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.element]).isRequired,
  delay: _propTypes2.default.number,
  ready: _propTypes2.default.bool.isRequired,
  firstLaunchOnly: _propTypes2.default.bool,
  type: _propTypes2.default.oneOf(['text', 'media', 'textRow', 'rect', 'round']),
  rows: _propTypes2.default.number,
  color: _propTypes2.default.string,
  showLoadingAnimation: _propTypes2.default.bool,
  customPlaceholder: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.element])
}, _class.defaultProps = {
  delay: 0,
  type: 'text',
  color: '#CDCDCD'
}, _temp2);
exports.default = ReactPlaceholder;