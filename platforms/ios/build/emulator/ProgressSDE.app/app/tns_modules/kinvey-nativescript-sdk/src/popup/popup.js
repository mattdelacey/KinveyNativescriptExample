"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var frameModule = require("ui/frame");
var page_1 = require("ui/page");
var grid_layout_1 = require("ui/layouts/grid-layout");
var stack_layout_1 = require("ui/layouts/stack-layout");
var web_view_1 = require("ui/web-view");
var OAuthWebViewHelper = (function (_super) {
    __extends(OAuthWebViewHelper, _super);
    function OAuthWebViewHelper() {
        return _super.call(this) || this;
    }
    OAuthWebViewHelper.initWithWebViewAndIntercept = function (wv, webViewIntercept) {
        wv._delegate = OAuthWebViewHelper.initWithOwner(new WeakRef(wv), webViewIntercept);
    };
    OAuthWebViewHelper.initWithOwner = function (owner, webViewIntercept) {
        var delegate = new OAuthWebViewHelper();
        delegate._owner = owner;
        delegate._origDelegate = owner.get()._delegate;
        delegate._webViewIntercept = webViewIntercept;
        return delegate;
    };
    OAuthWebViewHelper.prototype.webViewShouldStartLoadWithRequestNavigationType = function (webView, request, navigationType) {
        return this._origDelegate.webViewShouldStartLoadWithRequestNavigationType(webView, request, navigationType);
    };
    OAuthWebViewHelper.prototype.webViewDidStartLoad = function (webView) {
        this._origDelegate.webViewDidStartLoad(webView);
    };
    OAuthWebViewHelper.prototype.webViewDidFinishLoad = function (webView) {
        this._webViewIntercept(webView, null);
        this._origDelegate.webViewDidFinishLoad(webView);
    };
    OAuthWebViewHelper.prototype.webViewDidFailLoadWithError = function (webView, error) {
        this._webViewIntercept(webView, error);
        this._origDelegate.webViewDidFailLoadWithError(webView, error);
    };
    return OAuthWebViewHelper;
}(NSObject));
OAuthWebViewHelper.ObjCProtocols = [UIWebViewDelegate];
var OAuthPageProvider = (function () {
    function OAuthPageProvider(authUrl, webViewIntercept) {
        this._authUrl = authUrl;
        this._webViewIntercept = webViewIntercept;
    }
    OAuthPageProvider.prototype.createWebViewPage = function () {
        var webView = new web_view_1.WebView();
        OAuthWebViewHelper.initWithWebViewAndIntercept(webView, this._webViewIntercept);
        var grid = new grid_layout_1.GridLayout();
        grid.addChild(webView);
        var stack = new stack_layout_1.StackLayout();
        stack.addChild(grid);
        var page = new page_1.Page();
        page.content = stack;
        webView.src = this._authUrl;
        return page;
    };
    return OAuthPageProvider;
}());
var Popup = (function (_super) {
    __extends(Popup, _super);
    function Popup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._open = false;
        return _this;
    }
    Popup.prototype.open = function (url) {
        var _this = this;
        if (url === void 0) { url = '/'; }
        if (this._open === false) {
            var webViewIntercept = function (webView, error, url) {
                var urlStr = '';
                try {
                    if (error && error.userInfo && error.userInfo.allValues && error.userInfo.allValues.count > 0) {
                        var val0 = error.userInfo.allValues[0];
                        if (val0.absoluteString) {
                            urlStr = val0.absoluteString;
                        }
                        else if (val0.userInfo && val0.userInfo.allValues && val0.userInfo.allValues.count > 0) {
                            urlStr = val0.userInfo.allValues[0];
                        }
                        else {
                            urlStr = val0;
                        }
                    }
                    else if (webView.request && webView.request.URL && webView.request.URL.absoluteString) {
                        urlStr = webView.request.URL.absoluteString;
                    }
                    else if (url) {
                        urlStr = url;
                    }
                }
                catch (ex) {
                }
                _this.emit('loadstop', { url: urlStr });
                return true;
            };
            var authPage_1 = new OAuthPageProvider(url, webViewIntercept);
            frameModule.topmost().navigate(function () { return authPage_1.createWebViewPage(); });
            this._open = true;
        }
        return this;
    };
    Popup.prototype.close = function () {
        if (this._open) {
            frameModule.topmost().goBack();
            this._open = false;
        }
        return this;
    };
    return Popup;
}(events_1.EventEmitter));
exports.Popup = Popup;
