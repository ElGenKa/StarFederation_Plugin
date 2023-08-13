//var ajaxAuth = 0;
var lastAjaxQuery = 0;
var connectError = false;

function ajax_resp(rtext, callback)
{

  var dt = new Date();
  lastAjaxQuery = dt.getTime();

  var z = new Array();
  var resp = new Object();

  if (ajaxErrorHandler.validateResponse(rtext)) {

    var ihdr = rtext.indexOf("-->");
    resp = rtext.substring(14, ihdr);
    resp = eval('(' + resp + ')');
    resp.html = rtext.substring(ihdr + 4);
    z = resp.html.match(/<script[^>]*>[^\f]*?<\/script>/g) || [];
    resp.html = resp.html.replace(/<script[^>]*>[^\f]*?<\/script>/g, "");

  } else {

    return;
  }

  if (resp.win)
  {
    resp.wnd = getWindow(resp.win);
  }

  callback(resp);

  if (resp.RESULT === 'FAILED') {

    showMessage(resp);
  }

  for (var i = 0; i < z.length; i++)
  {
    var s = z[i].replace(/<([\/]{0,1})script[^>]*>/g, "");
    if (s)
    {
      if (resp.jsondata)
      {
        var jsondata = resp.jsondata;
        eval(s, jsondata);
      } else {
        if (window.execScript)
          window.execScript(s);
        else
          window.eval(s);
      }
    }
  }

  loading_hide();
}

var ajaxErrorHandler = (function () {

  var connectErrWinId = "dhxWins_mw_connect_err";

  return {

    validateResponse: function (rtext) {

      var self = this;

      if (rtext.substring(0, 14) !== "<!-- JSONDATA ") {

        if (rtext != "") {

          self.showErrorMsg(js_lang.getString(js_lang.SERVERERROR), htmlspecialchars(rtext), 500, 400);

        } else {

          connectError = true;

          var win = dhxWins.window(connectErrWinId);

          if (!win) {
            self.showErrorMsg(js_lang.getString(js_lang.CONNECTIONERROR),
              "<table width=100% height=100%><tr><td align=center>" + js_lang.getString(js_lang.NOSERVERCONNECTION) + "</td></tr></table>",
              300, 200, connectErrWinId);
          } else {
            win.bringToTop();
          }
        }


        return false;

      } else {
        connectError = false;
        return true;
      }
    },

    showErrorMsg: function (caption, html, w, h, winid) {

      var resp = new Object();

      resp.icon = "/common/images/gui/i_error.gif";
      resp.w = w;
      resp.h = h;
      resp.html = html;
      resp.caption = caption;

      showMessage(resp, winid);
    }
  };
}());

var ajaxManager = (function () {
  var requests = [],
    parl_req = 2,
    r_delay = 500,
    c_timeout = 10;

  return {
    addReq: function (url, callback, on_execute) {
      var self = this;

      //console.log("push: "+url);

      if (self.existReq(url)) {
        return;
      }

      requests.push({
        url: url,
        callback: callback,
        start: Date.now()
      });

      if (typeof on_execute === "function")
        on_execute();

      self.run();
    },
    removeReq: function (url) {

      var i = requests.length;

      while (i--) {

        if (requests[i].url == url) {
          requests.splice(i, 1);
        }

      }
    },
    existReq: function (url) {

      var i = requests.length;

      while (i--) {

        if (requests[i].url == url) {
          return true;
        }

      }

      return false;
    },
    run: function () {
      var self = this;

      if (requests.length) {

        for (var i = 0; i < requests.length; i++) {

          var exec = 0;
          for (var j = 0; j < requests.length; j++) {
            if (requests[j].complete) {
              exec++;
            }
          }

          if (exec >= parl_req) {
            self.repeat(true);
            return;
          }

          if (!requests[i].complete) {

            var complete = requests[i].complete = function (url) {
              self.removeReq(url);
              self.repeat(false);
            };

            var _url = requests[i].url;
            var _callback = requests[i].callback;

            //console.log("run: "+_url);

            dhtmlxAjax.get(_url, function (loader) {
              complete(_url);
              ajax_resp(loader.xmlDoc.responseText, _callback);
            });

          }
        }

      } else {
        self.repeat(true);
      }
    },
    repeat: function (delay) {
      var self = this;

      if (delay) {
        self.tid = setTimeout(function tickAjax() {
          self.run.apply(self, []);
        }, r_delay);
      } else {
        self.run.apply(self, []);
      }

      if (!self.cid) {
        self.cid = setTimeout(function tickClct() {
          self.collect();
          self.cid = 0;
        }, c_timeout * 1000);
      }
    },
    stop: function () {
      requests = [];
      clearTimeout(this.tid);
    },
    collect: function () {
      var self = this;
      for (var i = 0; i < requests.length; i++) {
        if (requests[i].complete && requests[i].start + (c_timeout * 1000) <= Date.now()) {
          self.removeReq(requests[i].url);
        }
      }
    }
  };
}());

function ajaxGet(url, callback, on_execute)
{

  ajaxManager.addReq(url, callback, on_execute);
}

function ajaxGetSync(url, callback)
{
  var result = dhtmlxAjax.getSync(url);

  ajax_resp(result.xmlDoc.responseText, callback);
}

function ajaxPostForm(url, form, callback)
{

  if (typeof form === "string")
  {
    form = document.getElementById(form);
  }



  var params = "";

  for (var i = 0; i < form.elements.length; i++)
  {
    if (params !== "")
      params = params + "&";

    var value = form.elements[i].value;

    if (form.elements[i].type == 'checkbox')
    {
      value = form.elements[i].checked;
      params = params + form.elements[i].name + "=" + encodeURIComponent(value);
    } else if (form.elements[i].type == 'radio')
    {
      if (form.elements[i].checked) {

        params = params + form.elements[i].name + "=" + encodeURIComponent(value);
      }
    } else {
      params = params + form.elements[i].name + "=" + encodeURIComponent(value);
    }
  }


  dhtmlxAjax.post(url, params, function (loader) {
    ajax_resp(loader.xmlDoc.responseText, callback);
  });
}


