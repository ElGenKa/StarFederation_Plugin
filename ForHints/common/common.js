function prepare_event(e)
{
  e = e || window.event;

  if (!e.which && e.button)
  {
    if (e.button & 1) e.which = 1;
    else if (e.button & 4) e.which = 2;
    else if (e.button & 2) e.which = 3;
  }

  return e;
}

function UndoStack(maxsize)
{
  this.maxsize = maxsize ? maxsize : 128;

  this.stack = new Array();
  this.pos =  -1;
  this.size = 0;
  this.disabled = false;
  this.disable = function()
  {
    this.disabled = true;
  };

  this.enable = function()
  {
    this.disabled = false;
  };

  this.push = function(object)
  {
    if (this.disabled) return;

    if (this.pos >= this.maxsize)
    {
      for (var i = 0; i < this.maxsize - 1; i++)
      {
        this.stack[i] = this.stack[i+1];
      }
      this.pos = this.maxsize - 1;
    }

    this.stack[++this.pos] = object;

    this.size = this.pos + 1;

    //console.log("push",this);
  };

  this.back = function()
  {
    if (!this.can_back())  return null;
    var object = this.stack[--this.pos];
    //console.log("back",this,this.size,this.pos);
    return object;
  };

  this.can_forward = function()
  {
    return (this.pos + 1 ) < this.size ;
  };

  this.can_back = function()
  {
    return this.pos > 0;
  };

  this.forward = function()
  {
    if (!this.can_forward()) return null;
    var object = this.stack[++this.pos];
    console.log("forward",this,this.size,this.pos);
    //console.log("back",object,this.size,this.pos);
    return object;
  };
}

Number.prototype.format = function(decPlaces, thouSeparator, decSeparator) {
  var n = this,
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? "." : decSeparator,
    thouSeparator = thouSeparator == undefined ? " " : thouSeparator,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};

Number.prototype.tohtml = function()
{
  var n= this;
  var html = "";
  if (n < 0)
  {
    html = "<span class='v-warn'>"+n.format(0)+"</span>"
  }
  else if (n > 0)
  {
    html = "<span style='v-norm'>"+n.format(0)+"</span>"
  }
  else
  {
    html = "<span style='v-null'>0</span>"
  }

  return html;
}

function hookEvent(hElem, eventName, callback) {
  if (typeof(hElem) == 'string') {
    // Если передан ID, то получить DOM-элемент
    hElem = document.getElementById(hElem);
  }
  // Если такого элемента нет, то возврат с ошибкой
  if (!hElem) { return false; }

  if (hElem.addEventListener) {
    if (eventName == 'mousewheel') {
      // Событие вращения колесика для Mozilla
      hElem.addEventListener('DOMMouseScroll', callback, false);
    }
    // Колесико для Opera, WebKit-based, а также любые другие события
    // для всех браузеров кроме Internet Explorer
    hElem.addEventListener(eventName, callback, false);
  }
  else if (hElem.attachEvent) {
    // Все события для Internet Explorer
    hElem.attachEvent('on' + eventName, callback);
  }
  else { return false; }
  return true;
}

function cancelEvent(e) {

  e = e ? e : window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;

  return false;
}

function HTMLtoRGBA(h,a){
  var m = h.slice(1).match(/.{2}/g);

  m[0]=parseInt(m[0], 16);
  m[1]=parseInt(m[1], 16);
  m[2]=parseInt(m[2], 16);
  return ('rgba('+m[0]+','+m[1]+','+m[2]+','+a+')');
};

function intervals_value(v, min1, max1, min2, max2)
{
  if (v < min1) v = min1;
  else if (v > max1) v = max1;

  return (max2 - min2) * (v - min1) / (max1 - min1) + min2;
}

function get_url_vars(url) {
  var vars = {};
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
// функция для спановой обертки чекбокса
function checkbox_action(owner)
{
  owner = $(owner);
  var ch = $(owner).children('input');


  if (ch.prop('checked') == true)
  {
    ch.prop('checked',false);
    owner.removeClass('inputCheckBoxChecked');
  }
  else
  {
    ch.prop('checked',true);
    owner.addClass('inputCheckBoxChecked');
  }

}


function checkbox_set(owner,checked)
{
  owner = $(owner);
  var ch = $(owner).children('input');


  if (checked == true)
  {
    ch.prop('checked',true);
    owner.addClass('inputCheckBoxChecked');

  }
  else
  {
    ch.prop('checked',false);
    owner.removeClass('inputCheckBoxChecked');
  }

}


function radio_value(name){

  return $("input:radio[name="+name+"]:checked").val();

}

function radio_action(owner)
{
  owner = $(owner);
  var ch = $(owner).children('input');



  if (ch.prop('checked') == false)
  {
    //alert();
    var name = '\"'+ch.prop('name')+'\"';

    $('input:radio[name='+name+']').each(function (index,value){

      $(this).prop('checked',false);
      $(this).parent().removeClass('inputCheckBoxChecked')
    });

    ch.prop('checked',true);
    owner.addClass('inputCheckBoxChecked');

  }
}



function checkbox_checked( owner, classname )
{
  owner = $(owner);
  var ch = $(owner).children('input');

  if (ch.prop('checked') != true)
  {
    $("."+classname).children('input').prop('checked',false);
    $("."+classname).removeClass('inputCheckBoxChecked');
  }
  else
  {
    $("."+classname).children('input').prop('checked',true);
    $("."+classname).addClass('inputCheckBoxChecked');
  }
}

function checkbox_checked_parent( owner, classname, pclassname )
{
  owner = $(owner);
  var ch = $(owner).children('input');

  if (ch.prop('checked') != true)
  {
    var checked = true;

    $("."+classname).each(function(index){

      var ch = $(this).children('input');
      checked = checked & !ch.prop('checked');
    });

    if (checked) {

      $("."+pclassname).children('input').prop('checked',false);
      $("."+pclassname).removeClass('inputCheckBoxChecked');
    }
  }
  else
  {
    var checked = true;

    $("."+classname).each(function(index){

      var ch = $(this).children('input');
      checked = checked & ch.prop('checked');
    });

    if (checked) {

      $("."+pclassname).children('input').prop('checked',false);
      $("."+pclassname).removeClass('inputCheckBoxChecked');
    }

    $("."+pclassname).children('input').prop('checked',true);
    $("."+pclassname).addClass('inputCheckBoxChecked');
  }
}

function checkbox_check( owner, classname )
{
  owner = $(owner);
  $("."+classname).children('input').prop('checked',true);
  $("."+classname).removeClass('inputCheckBoxChecked');
}

function checkbox_uncheck( owner, classname )
{

  owner = $(owner);
  var ch = $(owner).children('input');

  if (ch.prop('checked') == true)
  {
    $("."+classname).children('input').prop('checked',false);
    $("."+classname).removeClass('inputCheckBoxChecked');
  }
}

function checkbox_disable( id )
{

  var owner = $('#'+id);
  var ch = $(owner).children('input');

  if (ch.prop('checked') == true) {

    owner.removeClass('inputCheckBoxChecked');
    owner.addClass('inputCheckBoxD');
  }

  ch.prop('disabled',true);
  ch.prop('checked',false);
}

function checkbox_enable( id , enabled, clearchecked)
{
  var ch = $('#'+id);
  var owner = $(ch).parent();

  if ( enabled )  {

    owner.removeClass('inputCheckBoxD');
  }
  else {

    owner.addClass('inputCheckBoxD');
  }

  if (clearchecked && ch.prop('checked')) {

    owner.removeClass('inputCheckBoxChecked');
    ch.prop('checked',false);
  }

  ch.prop('disabled',!enabled);
}

function sound_click(type)
{
  if (!dhtmlx.is_sound) return;

  var audio = new Audio();
  audio.volume = dhtmlx.sound_volume?dhtmlx.sound_volume:1;

  var file = 'btn_click.mp3';

  switch (type)
  {
    case 1: file = 'link_click.mp3';break;
    case 3:
    case 4: return;
    case 6: file = 'key_press.mp3';break;
    case 9:
    case 8: file = 'incoming_message.mp3';audio.volume *= 0.3;break;
  }


  audio.src = '/sounds/'+file;
  audio.autoplay = true;
}

function htmlspecialchars(html) {
  // Сначала необходимо заменить &
  html = html.replace(/&/g, "&amp;");
  // А затем всё остальное в любой последовательности
  html = html.replace(/</g, "&lt;");
  html = html.replace(/>/g, "&gt;");
  html = html.replace(/"/g, "&quot;");
  // Возвращаем полученное значение
  return html;
}

function isIPad(){
  var retV = (/Android|iPhone|iPad|iPod|Windows Phone|Opera Mini|Opera Mobi/i.test(navigator.userAgent));
  return retV;
}

function html_float_value(id,value) {

  $('#'+id).text(Math.ceil(value).format(0))
  if (value > 0) {

    $('#'+id).removeClass('v-null');
    $('#'+id).removeClass('v-warn');
    $('#'+id).addClass('v-norm');
  }
  else if (value < 0) {

    $('#'+id).removeClass('v-null');
    $('#'+id).removeClass('v-norm');
    $('#'+id).addClass('v-warn');
  }
  else {

    $('#'+id).removeClass('v-warn');
    $('#'+id).removeClass('v-norm');
    $('#'+id).addClass('v-null');

  }

}


function parseNbr(val) {

  val = ''+val;
  val = val.replace(/ /g,'');
  val = val.replace(/k|K|к|К/g,'000');

  return parseFloat(val);
}