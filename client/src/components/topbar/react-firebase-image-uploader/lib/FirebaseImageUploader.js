
Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uuid = require('uuid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * FirebaseImageUploader for React
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function generateImageName(fileName) {
	// Define file data
	var extension = /(?:\.([^.]+))?$/.exec(fileName)[0];
	var imageName = (0, _uuid.v4)() + extension;
	return imageName;
}

var FirebaseImageUploader = function (_Component) {
	_inherits(FirebaseImageUploader, _Component);

	function FirebaseImageUploader() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, FirebaseImageUploader);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FirebaseImageUploader.__proto__ || Object.getPrototypeOf(FirebaseImageUploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.cancelRunningUpload = function () {
			if (_this.uploadTask) {
				if (_this.uploadTask.snapshot.state === 'running') {
					_this.uploadTask.cancel();
					_this.uploadTask = null;
				}
			}
		}, _this.handleImageSelection = function (event) {
			_this.handleUploadStart(event.target.files[0]);
		}, _this.handleUploadStart = function (file) {

			if (file === undefined) return;

			// Cancel any running tasks
			_this.cancelRunningUpload();

			if (_this.props.onUploadStart) {
				_this.props.onUploadStart(file);
			}

			_this.setState({ isUploading: true, progress: 0 });

			// upload file
			var imageName = generateImageName(file.name);
			var metadata = {
				contentType: file.type
			};
			if (_this.props.cacheControl) {
				metadata.cacheControl = _this.props.cacheControl;
			}
			_this.uploadTask = _this.props.storageRef.child(imageName).put(file, metadata);
			// Listen for progress
			_this.uploadTask.on('state_changed', function (snapshot) {
				return _this.handleProgress(snapshot);
			}, function (error) {
				return _this.handleUploadError(error);
			}, function () {
				return _this.handleUploadSuccess();
			});
		}, _this.handleProgress = function (snapshot) {
			var progress = Math.round(100 * snapshot.bytesTransferred / snapshot.totalBytes);
			if (_this.props.onProgress) {
				_this.props.onProgress(progress);
			}
			_this.setState({ progress: progress });
		}, _this.handleUploadSuccess = function () {
			if (!_this.uploadTask) {
				return;
			}
			var filename = _this.uploadTask.snapshot.metadata.name;
			if (_this.props.onUploadSuccess) {
				_this.props.onUploadSuccess(filename);
			}
			_this.setState({ filename: filename, isUploading: false, progress: 100 });
		}, _this.handleUploadError = function (error) {
			if (_this.props.onUploadError) {
				_this.props.onUploadError(error);
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(FirebaseImageUploader, [{
		key: 'componentWillUnmount',


		// Cancel upload if quiting
		value: function componentWillUnmount() {
			this.cancelRunningUpload();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var name = this.props.name;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.Children.map(this.props.children, function (child) {
					return _react2.default.cloneElement(child, _extends({}, _this2.state));
				}),
				_react2.default.createElement('input', {
					name: name,
					type: 'file',
					accept: 'image/*',
					onChange: this.handleImageSelection
				})
			);
		}
	}]);

	return FirebaseImageUploader;
}(_react.Component);

exports.default = FirebaseImageUploader;