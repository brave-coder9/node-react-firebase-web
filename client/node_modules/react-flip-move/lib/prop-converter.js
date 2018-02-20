'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _errorMessages = require('./error-messages');

var _enterLeavePresets = require('./enter-leave-presets');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/**
 * React Flip Move | propConverter
 * (c) 2016-present Joshua Comeau
 *
 * Abstracted away a bunch of the messy business with props.
 *   - props flow types and defaultProps
 *   - Type conversion (We accept 'string' and 'number' values for duration,
 *     delay, and other fields, but we actually need them to be ints.)
 *   - Children conversion (we need the children to be an array. May not always
 *     be, if a single child is passed in.)
 *   - Resolving animation presets into their base CSS styles
 */
/* eslint-disable block-scoped-var */

// eslint-disable-next-line no-duplicate-imports


function isProduction() {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
}

function propConverter(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(FlipMovePropConverter, _Component);

    function FlipMovePropConverter() {
      _classCallCheck(this, FlipMovePropConverter);

      return _possibleConstructorReturn(this, (FlipMovePropConverter.__proto__ || Object.getPrototypeOf(FlipMovePropConverter)).apply(this, arguments));
    }

    _createClass(FlipMovePropConverter, [{
      key: 'checkChildren',


      // eslint-disable-next-line class-methods-use-this
      value: function checkChildren(children) {
        // Skip all console warnings in production.
        // Bail early, to avoid unnecessary work.
        if (isProduction()) {
          return;
        }

        // same as React.Node, but without fragments, see https://github.com/facebook/flow/issues/4781


        // FlipMove does not support stateless functional components.
        // Check to see if any supplied components won't work.
        // If the child doesn't have a key, it means we aren't animating it.
        // It's allowed to be an SFC, since we ignore it.
        _react.Children.forEach(children, function (child) {
          // null, undefined, and booleans will be filtered out by Children.toArray
          if (child == null || typeof child === 'boolean') {
            return;
          }

          if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object') {
            (0, _errorMessages.primitiveNodeSupplied)();
            return;
          }

          if ((0, _helpers.isElementAnSFC)(child) && child.key != null) {
            (0, _errorMessages.statelessFunctionalComponentSupplied)();
          }
        });
      }
    }, {
      key: 'convertProps',
      value: function convertProps(props) {
        var workingProps = {
          // explicitly bypass the props that don't need conversion
          children: props.children,
          easing: props.easing,
          onStart: props.onStart,
          onFinish: props.onFinish,
          onStartAll: props.onStartAll,
          onFinishAll: props.onFinishAll,
          typeName: props.typeName,
          disableAllAnimations: props.disableAllAnimations,
          getPosition: props.getPosition,
          maintainContainerHeight: props.maintainContainerHeight,
          verticalAlignment: props.verticalAlignment,

          // Do string-to-int conversion for all timing-related props
          duration: this.convertTimingProp('duration'),
          delay: this.convertTimingProp('delay'),
          staggerDurationBy: this.convertTimingProp('staggerDurationBy'),
          staggerDelayBy: this.convertTimingProp('staggerDelayBy'),

          // Our enter/leave animations can be specified as boolean (default or
          // disabled), string (preset name), or object (actual animation values).
          // Let's standardize this so that they're always objects
          appearAnimation: this.convertAnimationProp(props.appearAnimation, _enterLeavePresets.appearPresets),
          enterAnimation: this.convertAnimationProp(props.enterAnimation, _enterLeavePresets.enterPresets),
          leaveAnimation: this.convertAnimationProp(props.leaveAnimation, _enterLeavePresets.leavePresets),

          delegated: {}
        };

        this.checkChildren(workingProps.children);

        // Accept `disableAnimations`, but add a deprecation warning
        if (typeof props.disableAnimations !== 'undefined') {
          workingProps.disableAllAnimations = props.disableAnimations;

          if (!isProduction()) {
            (0, _errorMessages.deprecatedDisableAnimations)();
          }
        }

        // Gather any additional props;
        // they will be delegated to the ReactElement created.
        var primaryPropKeys = Object.keys(workingProps);
        var delegatedProps = (0, _helpers.omit)(this.props, primaryPropKeys);

        // The FlipMove container element needs to have a non-static position.
        // We use `relative` by default, but it can be overridden by the user.
        // Now that we're delegating props, we need to merge this in.
        delegatedProps.style = _extends({
          position: 'relative'
        }, delegatedProps.style);

        workingProps.delegated = delegatedProps;

        return workingProps;
      }
    }, {
      key: 'convertTimingProp',
      value: function convertTimingProp(prop) {
        var rawValue = this.props[prop];

        var value = typeof rawValue === 'number' ? rawValue : parseInt(rawValue, 10);

        if (isNaN(value)) {
          var defaultValue = FlipMovePropConverter.defaultProps[prop];

          if (!isProduction()) {
            (0, _errorMessages.invalidTypeForTimingProp)({
              prop: prop,
              value: rawValue,
              defaultValue: defaultValue
            });
          }

          return defaultValue;
        }

        return value;
      }

      // eslint-disable-next-line class-methods-use-this

    }, {
      key: 'convertAnimationProp',
      value: function convertAnimationProp(animation, presets) {
        switch (typeof animation === 'undefined' ? 'undefined' : _typeof(animation)) {
          case 'boolean':
            {
              // If it's true, we want to use the default preset.
              // If it's false, we want to use the 'none' preset.
              return presets[animation ? _enterLeavePresets.defaultPreset : _enterLeavePresets.disablePreset];
            }

          case 'string':
            {
              var presetKeys = Object.keys(presets);

              if (presetKeys.indexOf(animation) === -1) {
                if (!isProduction()) {
                  (0, _errorMessages.invalidEnterLeavePreset)({
                    value: animation,
                    acceptableValues: presetKeys.filter(function (key) {
                      return key.indexOf('accordian') === -1;
                    }).join(', '),
                    defaultValue: _enterLeavePresets.defaultPreset
                  });
                }

                return presets[_enterLeavePresets.defaultPreset];
              }

              return presets[animation];
            }

          default:
            {
              return animation;
            }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(ComposedComponent, this.convertProps(this.props));
      }
    }]);

    return FlipMovePropConverter;
  }(_react.Component), _class.defaultProps = {
    easing: 'ease-in-out',
    duration: 350,
    delay: 0,
    staggerDurationBy: 0,
    staggerDelayBy: 0,
    typeName: 'div',
    enterAnimation: _enterLeavePresets.defaultPreset,
    leaveAnimation: _enterLeavePresets.defaultPreset,
    disableAllAnimations: false,
    getPosition: function getPosition(node) {
      return node.getBoundingClientRect();
    },
    maintainContainerHeight: false,
    verticalAlignment: 'top'
  }, _temp;
}

exports.default = propConverter;
module.exports = exports['default'];