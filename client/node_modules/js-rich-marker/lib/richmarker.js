'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3.js
// @output_wrapper (function() {%output%})();
// ==/ClosureCompiler==

/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A RichMarker that allows any HTML/DOM to be added to a map and be draggable.
 *
 * @param {Object.<string, *>=} opt_options Optional properties to set.
 * @extends {google.maps.OverlayView}
 * @constructor
 */

var RichMarker = exports.RichMarker = function (_google$maps$OverlayV) {
  _inherits(RichMarker, _google$maps$OverlayV);

  function RichMarker(opt_options) {
    _classCallCheck(this, RichMarker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RichMarker).call(this));

    var options = opt_options || {};

    /**
     * @type {boolean}
     * @private
     */
    _this.ready_ = false;

    /**
     * @type {boolean}
     * @private
     */
    _this.dragging_ = false;

    if (opt_options['visible'] == undefined) {
      opt_options['visible'] = true;
    }

    if (opt_options['shadow'] == undefined) {
      opt_options['shadow'] = '7px -3px 5px rgba(88,88,88,0.7)';
    }

    if (opt_options['anchor'] == undefined) {
      opt_options['anchor'] = RichMarkerPosition['BOTTOM'];
    }

    _this.setValues(options);
    return _this;
  }

  /**
   * Returns the current visibility state of the marker.
   *
   * @return {boolean} The visiblity of the marker.
   */


  _createClass(RichMarker, [{
    key: 'getVisible',
    value: function getVisible() {
      return (/** @type {boolean} */this.get('visible')
      );
    }
  }, {
    key: 'setVisible',


    /**
     * Sets the visiblility state of the marker.
     *
     * @param {boolean} visible The visiblilty of the marker.
     */
    value: function setVisible(visible) {
      this.set('visible', visible);
    }
  }, {
    key: 'visible_changed',


    /**
     *  The visible changed event.
     */
    value: function visible_changed() {
      if (this.ready_) {
        this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';
        this.draw();
      }
    }
  }, {
    key: 'setFlat',


    /**
     * Sets the marker to be flat.
     *
     * @param {boolean} flat If the marker is to be flat or not.
     */
    value: function setFlat(flat) {
      this.set('flat', !!flat);
    }
  }, {
    key: 'getFlat',


    /**
     * If the makrer is flat or not.
     *
     * @return {boolean} True the marker is flat.
     */
    value: function getFlat() {
      return (/** @type {boolean} */this.get('flat')
      );
    }
  }, {
    key: 'getWidth',


    /**
     * Get the width of the marker.
     *
     * @return {Number} The width of the marker.
     */
    value: function getWidth() {
      return (/** @type {Number} */this.get('width')
      );
    }
  }, {
    key: 'getHeight',


    /**
     * Get the height of the marker.
     *
     * @return {Number} The height of the marker.
     */
    value: function getHeight() {
      return (/** @type {Number} */this.get('height')
      );
    }
  }, {
    key: 'setShadow',


    /**
     * Sets the marker's box shadow.
     *
     * @param {string} shadow The box shadow to set.
     */
    value: function setShadow(shadow) {
      this.set('shadow', shadow);
      this.flat_changed();
    }
  }, {
    key: 'getShadow',


    /**
     * Gets the marker's box shadow.
     *
     * @return {string} The box shadow.
     */
    value: function getShadow() {
      return (/** @type {string} */this.get('shadow')
      );
    }
  }, {
    key: 'flat_changed',


    /**
     * Flat changed event.
     */
    value: function flat_changed() {
      if (!this.ready_) {
        return;
      }

      this.markerWrapper_.style['boxShadow'] = this.markerWrapper_.style['webkitBoxShadow'] = this.markerWrapper_.style['MozBoxShadow'] = this.getFlat() ? '' : this.getShadow();
    }
  }, {
    key: 'setZIndex',


    /**
     * Sets the zIndex of the marker.
     *
     * @param {Number} index The index to set.
     */
    value: function setZIndex(index) {
      this.set('zIndex', index);
    }
  }, {
    key: 'getZIndex',


    /**
     * Gets the zIndex of the marker.
     *
     * @return {Number} The zIndex of the marker.
     */
    value: function getZIndex() {
      return (/** @type {Number} */this.get('zIndex')
      );
    }
  }, {
    key: 'zIndex_changed',


    /**
     * zIndex changed event.
     */
    value: function zIndex_changed() {
      if (this.getZIndex() && this.ready_) {
        this.markerWrapper_.style.zIndex = this.getZIndex();
      }
    }
  }, {
    key: 'getDraggable',


    /**
     * Whether the marker is draggable or not.
     *
     * @return {boolean} True if the marker is draggable.
     */
    value: function getDraggable() {
      return (/** @type {boolean} */this.get('draggable')
      );
    }
  }, {
    key: 'setDraggable',


    /**
     * Sets the marker to be draggable or not.
     *
     * @param {boolean} draggable If the marker is draggable or not.
     */
    value: function setDraggable(draggable) {
      this.set('draggable', !!draggable);
    }
  }, {
    key: 'draggable_changed',


    /**
     * Draggable property changed callback.
     */
    value: function draggable_changed() {
      if (this.ready_) {
        if (this.getDraggable()) {
          this.addDragging_(this.markerWrapper_);
        } else {
          this.removeDragListeners_();
        }
      }
    }
  }, {
    key: 'getPosition',


    /**
     * Gets the postiton of the marker.
     *
     * @return {google.maps.LatLng} The position of the marker.
     */
    value: function getPosition() {
      return (/** @type {google.maps.LatLng} */this.get('position')
      );
    }
  }, {
    key: 'setPosition',


    /**
     * Sets the position of the marker.
     *
     * @param {google.maps.LatLng} position The position to set.
     */
    value: function setPosition(position) {
      this.set('position', position);
    }
  }, {
    key: 'position_changed',


    /**
     * Position changed event.
     */
    value: function position_changed() {
      this.draw();
    }
  }, {
    key: 'getAnchor',


    /**
     * Gets the anchor.
     *
     * @return {google.maps.Size} The position of the anchor.
     */
    value: function getAnchor() {
      return (/** @type {google.maps.Size} */this.get('anchor')
      );
    }
  }, {
    key: 'setAnchor',


    /**
     * Sets the anchor.
     *
     * @param {RichMarkerPosition|google.maps.Size} anchor The anchor to set.
     */
    value: function setAnchor(anchor) {
      this.set('anchor', anchor);
    }
  }, {
    key: 'anchor_changed',


    /**
     * Anchor changed event.
     */
    value: function anchor_changed() {
      this.draw();
    }
  }, {
    key: 'htmlToDocumentFragment_',


    /**
     * Converts a HTML string to a document fragment.
     *
     * @param {string} htmlString The HTML string to convert.
     * @return {Node} A HTML document fragment.
     * @private
     */
    value: function htmlToDocumentFragment_(htmlString) {
      var tempDiv = document.createElement('DIV');
      tempDiv.innerHTML = htmlString;
      if (tempDiv.childNodes.length == 1) {
        return (/** @type {!Node} */tempDiv.removeChild(tempDiv.firstChild)
        );
      } else {
        var fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        return fragment;
      }
    }
  }, {
    key: 'removeChildren_',


    /**
     * Removes all children from the node.
     *
     * @param {Node} node The node to remove all children from.
     * @private
     */
    value: function removeChildren_(node) {
      if (!node) {
        return;
      }

      var child;
      while (child = node.firstChild) {
        node.removeChild(child);
      }
    }
  }, {
    key: 'setContent',


    /**
     * Sets the content of the marker.
     *
     * @param {string|Node} content The content to set.
     */
    value: function setContent(content) {
      this.set('content', content);
    }
  }, {
    key: 'getContent',


    /**
     * Get the content of the marker.
     *
     * @return {string|Node} The marker content.
     */
    value: function getContent() {
      return (/** @type {Node|string} */this.get('content')
      );
    }
  }, {
    key: 'content_changed',


    /**
     * Sets the marker content and adds loading events to images
     */
    value: function content_changed() {
      if (!this.markerContent_) {
        // Marker content area doesnt exist.
        return;
      }

      this.removeChildren_(this.markerContent_);
      var content = this.getContent();
      if (content) {
        if (typeof content == 'string') {
          content = content.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
          content = this.htmlToDocumentFragment_(content);
        }
        this.markerContent_.appendChild(content);

        var that = this;
        var images = this.markerContent_.getElementsByTagName('IMG');
        for (var i = 0, image; image = images[i]; i++) {
          // By default, a browser lets a image be dragged outside of the browser,
          // so by calling preventDefault we stop this behaviour and allow the image
          // to be dragged around the map and now out of the browser and onto the
          // desktop.
          google.maps.event.addDomListener(image, 'mousedown', function (e) {
            if (that.getDraggable()) {
              if (e.preventDefault) {
                e.preventDefault();
              }
              e.returnValue = false;
            }
          });

          // Because we don't know the size of an image till it loads, add a
          // listener to the image load so the marker can resize and reposition
          // itself to be the correct height.
          google.maps.event.addDomListener(image, 'load', function () {
            that.draw();
          });
        }

        google.maps.event.trigger(this, 'domready');
      }

      if (this.ready_) {
        this.draw();
      }
    }
  }, {
    key: 'setCursor_',


    /**
     * Sets the cursor.
     *
     * @param {string} whichCursor What cursor to show.
     * @private
     */
    value: function setCursor_(whichCursor) {
      if (!this.ready_) {
        return;
      }

      var cursor = '';
      if (navigator.userAgent.indexOf('Gecko/') !== -1) {
        // Moz has some nice cursors :)
        if (whichCursor == 'dragging') {
          cursor = '-moz-grabbing';
        }

        if (whichCursor == 'dragready') {
          cursor = '-moz-grab';
        }

        if (whichCursor == 'draggable') {
          cursor = 'pointer';
        }
      } else {
        if (whichCursor == 'dragging' || whichCursor == 'dragready') {
          cursor = 'move';
        }

        if (whichCursor == 'draggable') {
          cursor = 'pointer';
        }
      }

      if (this.markerWrapper_.style.cursor != cursor) {
        this.markerWrapper_.style.cursor = cursor;
      }
    }
  }, {
    key: 'startDrag',


    /**
     * Start dragging.
     *
     * @param {Event} e The event.
     */
    value: function startDrag(e) {
      if (!this.getDraggable()) {
        return;
      }

      if (!this.dragging_) {
        this.dragging_ = true;
        var map = this.getMap();
        this.mapDraggable_ = map.get('draggable');
        map.set('draggable', false);

        // Store the current mouse position
        this.mouseX_ = e.clientX;
        this.mouseY_ = e.clientY;

        this.setCursor_('dragready');

        // Stop the text from being selectable while being dragged
        this.markerWrapper_.style['MozUserSelect'] = 'none';
        this.markerWrapper_.style['KhtmlUserSelect'] = 'none';
        this.markerWrapper_.style['WebkitUserSelect'] = 'none';

        this.markerWrapper_['unselectable'] = 'on';
        this.markerWrapper_['onselectstart'] = function () {
          return false;
        };

        this.addDraggingListeners_();

        google.maps.event.trigger(this, 'dragstart');
      }
    }
  }, {
    key: 'stopDrag',


    /**
     * Stop dragging.
     */
    value: function stopDrag() {
      if (!this.getDraggable()) {
        return;
      }

      if (this.dragging_) {
        this.dragging_ = false;
        this.getMap().set('draggable', this.mapDraggable_);
        this.mouseX_ = this.mouseY_ = this.mapDraggable_ = null;

        // Allow the text to be selectable again
        this.markerWrapper_.style['MozUserSelect'] = '';
        this.markerWrapper_.style['KhtmlUserSelect'] = '';
        this.markerWrapper_.style['WebkitUserSelect'] = '';
        this.markerWrapper_['unselectable'] = 'off';
        this.markerWrapper_['onselectstart'] = function () {};

        this.removeDraggingListeners_();

        this.setCursor_('draggable');
        google.maps.event.trigger(this, 'dragend');

        this.draw();
      }
    }
  }, {
    key: 'drag',


    /**
     * Handles the drag event.
     *
     * @param {Event} e The event.
     */
    value: function drag(e) {
      if (!this.getDraggable() || !this.dragging_) {
        // This object isn't draggable or we have stopped dragging
        this.stopDrag();
        return;
      }

      var dx = this.mouseX_ - e.clientX;
      var dy = this.mouseY_ - e.clientY;

      this.mouseX_ = e.clientX;
      this.mouseY_ = e.clientY;

      var left = parseInt(this.markerWrapper_.style['left'], 10) - dx;
      var top = parseInt(this.markerWrapper_.style['top'], 10) - dy;

      this.markerWrapper_.style['left'] = left + 'px';
      this.markerWrapper_.style['top'] = top + 'px';

      var offset = this.getOffset_();

      // Set the position property and adjust for the anchor offset
      var point = new google.maps.Point(left - offset.width, top - offset.height);
      var projection = this.getProjection();
      this.setPosition(projection.fromDivPixelToLatLng(point));

      this.setCursor_('dragging');
      google.maps.event.trigger(this, 'drag');
    }
  }, {
    key: 'removeDragListeners_',


    /**
     * Removes the drag listeners associated with the marker.
     *
     * @private
     */
    value: function removeDragListeners_() {
      if (this.draggableListener_) {
        google.maps.event.removeListener(this.draggableListener_);
        delete this.draggableListener_;
      }
      this.setCursor_('');
    }
  }, {
    key: 'addDragging_',


    /**
     * Add dragability events to the marker.
     *
     * @param {Node} node The node to apply dragging to.
     * @private
     */
    value: function addDragging_(node) {
      if (!node) {
        return;
      }

      var that = this;
      this.draggableListener_ = google.maps.event.addDomListener(node, 'mousedown', function (e) {
        that.startDrag(e);
      });

      this.setCursor_('draggable');
    }
  }, {
    key: 'addDraggingListeners_',


    /**
     * Add dragging listeners.
     *
     * @private
     */
    value: function addDraggingListeners_() {
      var that = this;
      if (this.markerWrapper_.setCapture) {
        this.markerWrapper_.setCapture(true);
        this.draggingListeners_ = [google.maps.event.addDomListener(this.markerWrapper_, 'mousemove', function (e) {
          that.drag(e);
        }, true), google.maps.event.addDomListener(this.markerWrapper_, 'mouseup', function () {
          that.stopDrag();
          that.markerWrapper_.releaseCapture();
        }, true)];
      } else {
        this.draggingListeners_ = [google.maps.event.addDomListener(window, 'mousemove', function (e) {
          that.drag(e);
        }, true), google.maps.event.addDomListener(window, 'mouseup', function () {
          that.stopDrag();
        }, true)];
      }
    }
  }, {
    key: 'removeDraggingListeners_',


    /**
     * Remove dragging listeners.
     *
     * @private
     */
    value: function removeDraggingListeners_() {
      if (this.draggingListeners_) {
        for (var i = 0, listener; listener = this.draggingListeners_[i]; i++) {
          google.maps.event.removeListener(listener);
        }
        this.draggingListeners_.length = 0;
      }
    }
  }, {
    key: 'getOffset_',


    /**
     * Get the anchor offset.
     *
     * @return {google.maps.Size} The size offset.
     * @private
     */
    value: function getOffset_() {
      var anchor = this.getAnchor();
      if ((typeof anchor === 'undefined' ? 'undefined' : _typeof(anchor)) == 'object') {
        return (/** @type {google.maps.Size} */anchor
        );
      }

      var offset = new google.maps.Size(0, 0);
      if (!this.markerContent_) {
        return offset;
      }

      var width = this.markerContent_.offsetWidth;
      var height = this.markerContent_.offsetHeight;

      switch (anchor) {
        case RichMarkerPosition['TOP_LEFT']:
          break;
        case RichMarkerPosition['TOP']:
          offset.width = -width / 2;
          break;
        case RichMarkerPosition['TOP_RIGHT']:
          offset.width = -width;
          break;
        case RichMarkerPosition['LEFT']:
          offset.height = -height / 2;
          break;
        case RichMarkerPosition['MIDDLE']:
          offset.width = -width / 2;
          offset.height = -height / 2;
          break;
        case RichMarkerPosition['RIGHT']:
          offset.width = -width;
          offset.height = -height / 2;
          break;
        case RichMarkerPosition['BOTTOM_LEFT']:
          offset.height = -height;
          break;
        case RichMarkerPosition['BOTTOM']:
          offset.width = -width / 2;
          offset.height = -height;
          break;
        case RichMarkerPosition['BOTTOM_RIGHT']:
          offset.width = -width;
          offset.height = -height;
          break;
      }

      return offset;
    }
  }, {
    key: 'onAdd',


    /**
     * Adding the marker to a map.
     * Implementing the interface.
     */
    value: function onAdd() {
      if (!this.markerWrapper_) {
        this.markerWrapper_ = document.createElement('DIV');
        this.markerWrapper_.style['position'] = 'absolute';
      }

      if (this.getZIndex()) {
        this.markerWrapper_.style['zIndex'] = this.getZIndex();
      }

      this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';

      if (!this.markerContent_) {
        this.markerContent_ = document.createElement('DIV');
        this.markerWrapper_.appendChild(this.markerContent_);

        var that = this;
        google.maps.event.addDomListener(this.markerContent_, 'click', function (e) {
          google.maps.event.trigger(that, 'click', e);
        });
        google.maps.event.addDomListener(this.markerContent_, 'mouseover', function (e) {
          google.maps.event.trigger(that, 'mouseover', e);
        });
        google.maps.event.addDomListener(this.markerContent_, 'mouseout', function (e) {
          google.maps.event.trigger(that, 'mouseout', e);
        });
      }

      this.ready_ = true;
      this.content_changed();
      this.flat_changed();
      this.draggable_changed();

      var panes = this.getPanes();
      if (panes) {
        panes.overlayMouseTarget.appendChild(this.markerWrapper_);
      }

      google.maps.event.trigger(this, 'ready');
    }
  }, {
    key: 'draw',


    /**
     * Impelementing the interface.
     */
    value: function draw() {
      if (!this.ready_ || this.dragging_) {
        return;
      }

      var projection = this.getProjection();

      if (!projection) {
        // The map projection is not ready yet so do nothing
        return;
      }

      var latLng = /** @type {google.maps.LatLng} */this.get('position');
      var pos = projection.fromLatLngToDivPixel(latLng);

      var offset = this.getOffset_();
      this.markerWrapper_.style['top'] = pos.y + offset.height + 'px';
      this.markerWrapper_.style['left'] = pos.x + offset.width + 'px';

      var height = this.markerContent_.offsetHeight;
      var width = this.markerContent_.offsetWidth;

      if (width != this.get('width')) {
        this.set('width', width);
      }

      if (height != this.get('height')) {
        this.set('height', height);
      }
    }
  }, {
    key: 'onRemove',


    /**
     * Removing a marker from the map.
     * Implementing the interface.
     */
    value: function onRemove() {
      if (this.markerWrapper_ && this.markerWrapper_.parentNode) {
        this.markerWrapper_.parentNode.removeChild(this.markerWrapper_);
      }
      this.removeDragListeners_();
    }
  }]);

  return RichMarker;
}(google.maps.OverlayView);

/**
 * RichMarker Anchor positions
 * @enum {number}
 */


var RichMarkerPosition = exports.RichMarkerPosition = {
  'TOP_LEFT': 1,
  'TOP': 2,
  'TOP_RIGHT': 3,
  'LEFT': 4,
  'MIDDLE': 5,
  'RIGHT': 6,
  'BOTTOM_LEFT': 7,
  'BOTTOM': 8,
  'BOTTOM_RIGHT': 9
};