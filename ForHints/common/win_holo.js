var dhxWins = null;
var accesscode = "";
var dhxWins_mw_counter = 0;
var WF_FIXED = 1;
var WF_CENTER = 2;
var WF_MODAL = 4;
var WF_NORELOAD = 8;
var WF_NOHEADER = 16;
var WF_NOCLOSE = 32;
var WF_STAYONTOP = 64;
var WF_NOPARK = 128;
var WF_REFRESH_WITH_URL = 256;

var mainHint = null;
var mainTextHint = null;
var mainNoteHint = null;
var mainCopyHint = null;
var mainControlHint = null;
var mainPopupMenu = null;
var mainPercentList = null;
var mainInfoBox = null;

var userScripts = {

  scripts: Array(),

  install :  function( userScript){

    this.scripts[this.scripts.length] = {
      script: userScript,
    }
    return this.scripts.length - 1;
  },

  process : function (method, param) {

    for( let i=0; i < this.scripts.length ; i++) {

      if (typeof this.scripts[i].script[method] == 'function') {

        this.scripts[i].script[method](param);
      }
    }
  }
}

function sec_to_string(sec)
{

  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec - (h * 3600)) / 60);
  var s = Math.floor(sec - (h * 3600) - (m * 60));
  return (h !== 0 ? h.toString() + ":" : "") + (m < 10 ? "0" : "") + m.toString() + ":" + (s < 10 ? "0" : "") + s.toString();
}

var mainTimer = {
  timers: Array(),
  process: function () {
    for (var i = 0; i < this.timers.length; i++)
    {
      var elem = document.getElementById(this.timers[i].elem);
      if (!elem)
      {
        this.timers.splice(i, 1);
        i--;
      } else
      {
        //console.log(i,this.timers[i].sec);
        this.timers[i].sec = this.timers[i].sec - 1;

        if (this.timers[i].sec < 0) {

          this.timers[i].func();
          this.timers.splice(i, 1);
          i--;

        }
        else {

          elem.innerHTML = sec_to_string(this.timers[i].sec);
        }
      }
    }
  },

  remove: function (e_timer) {
    for (var i = 0; i < this.timers.length; i++)
    {
      if (this.timers[i].elem == e_timer)
      {
        this.timers.splice(i, 1)
        return;
      }
    }
  },

  add: function (e_timer, t_func) {

    if (document.getElementById(e_timer)) {

      var o_timer = new Object();
      o_timer.elem = e_timer;


      o_timer.sec = document.getElementById(e_timer).getAttribute('sec');
      o_timer.func = t_func;
      for (var i = 0; i < this.timers.length; i++)
      {
        if (this.timers[i].elem == o_timer.elem)
        {
          this.timers[i] = o_timer;
          return;
        }
      }

      this.timers[this.timers.length] = o_timer;
    }
  }
};

setInterval(function () {
  mainTimer.process.call(mainTimer);
}, 1000);




function copyToClipboardEvent(e,elem) {

  if (copyToClipboardById(elem)) {

    sound_click(1);
    return cancelEvent(e);
  }

  return true;
}

function copyToClipboardById(id, text) {

  var temp = $("<textarea>");
  $("body").append(temp);

  if (typeof id === "string") {

    id = document.getElementById(id);
  }

  temp.val($(id).text()).select();

  try {

    document.execCommand("copy");

    if (text && text != '') {

      show_note_hint(id,text);
    }
    else {

      show_copy_hint(id);
    }
  }
  catch(err){

    temp.remove();
    return false;
  }

  temp.remove();
  return true;
}

function copyToClipboardText(text) {
  var temp = $("<textarea>");
  $("body").append(temp);
  temp.val(text).select();
  document.execCommand("copy");
  temp.remove();
}



function button_enable(id, enable)
{
  if (enable)
  {
    $(id).fadeTo(0, 1.0);
    $(id).removeAttr('disabled');
  } else
  {
    $(id).fadeTo(0, 0.5);
    $(id).attr('disabled', 'disabled');
  }
}

function hint_hide()
{
  //console.log('hint_hide()');
  if (!mainHint) mainHint = document.getElementById('divHint');
  mainHint.style.display = 'none';
  if (mainHint.htimeout) {
    clearTimeout(mainHint.htimeout);
  }
  if (mainHint.hhtimeout) {
    clearTimeout(mainHint.hhtimeout);
  }
}

function hint_show(event)
{
  console.log('hint_show()');

  mainHint.htimeout = 0;
  if (!mainHint)  mainHint = document.getElementById('divHint');
  //mainHint.style.display = 'block';

  mainHint.style.width = "auto";
  mainHint.style.height = "auto";



//    var mr = mainHint.getBoundingClientRect();


  /*/
  mainHint.f_mousepos = true;


  if (mainHint.f_mousepos){

  */


  var hsrc_mr = mainHint.hsrc.getBoundingClientRect();

  if (hsrc_mr.left >  dhxWins.mouseX ||  hsrc_mr.right < dhxWins.mouseX || hsrc_mr.top > dhxWins.mouseY ||  hsrc_mr.bottom < dhxWins.mouseY ) {

    hint_hide();
    return;
  }

  mainHint.style.display = 'block';

  mainHint.style.left= dhxWins.mouseX + 16;
  mainHint.style.top= dhxWins.mouseY + 16;

//    }



  var mr = mainHint.getBoundingClientRect();


  if (mr.right >= document.body.clientWidth)
  {
    mainHint.style.left =  dhxWins.mouseX - mr.width - 16;
  }

  if (mr.bottom >= document.body.clientHeight)
  {

    mainHint.style.top =  dhxWins.mouseY - mr.height - 16;
  }

  if (parseInt(mainHint.style.top) <= 0 ) {

    mainHint.style.top = dhxWins.mouseY + 16;
  }

  if (parseInt(mainHint.style.left) <= 0 ) {

    mainHint.style.left = dhxWins.mouseX + 16;
  }

  mainHint.style.left = dhxWins.transform_x(parseInt(mainHint.style.left))+"px";
  mainHint.style.top = dhxWins.transform_y(parseInt(mainHint.style.top))+"px";

}

function url_hint_show()
{
  console.log('url_hint_show()');

  if (!mainHint) {

    mainHint = document.getElementById('divHint');
  }

  mainHint.style.display = 'block';
  mainHint.hsrc.onmouseout = null;

  var mr = mainHint.getBoundingClientRect();

  mainHint.f_mousepos = true;

  if (mainHint.f_mousepos){


    var hsrc_mr = mainHint.hsrc.getBoundingClientRect();

    if (hsrc_mr.left >  dhxWins.mouseX ||  hsrc_mr.right < dhxWins.mouseX || hsrc_mr.top > dhxWins.mouseY ||  hsrc_mr.bottom < dhxWins.mouseY ) {

      hint_hide();
      return;
    }

    mainHint.style.left= dhxWins.mouseX + 16;
    mainHint.style.top= dhxWins.mouseY + 16;
  }

  var mr = mainHint.getBoundingClientRect();


  if (mr.right >= document.body.clientWidth)
  {
    mainHint.style.left = dhxWins.mouseX - mr.width - 16;
  }

  if (mr.bottom >= document.body.clientHeight)
  {

    mainHint.style.top =  dhxWins.mouseY - mr.height - 16;
  }

  if (parseInt(mainHint.style.top) <= 0 ) {

    mainHint.style.top = dhxWins.mouseY + 16;
  }

  if (parseInt(mainHint.style.left) <= 0 ) {

    mainHint.style.left = dhxWins.mouseX + 16;
  }

  mainHint.style.left = dhxWins.transform_x(parseInt(mainHint.style.left))+"px";
  mainHint.style.top = dhxWins.transform_y(parseInt(mainHint.style.top))+"px";

  mainHint.hsrc.onmouseleave = function () {

    mainHint.hhtimeout = setTimeout(hint_hide, 1000);
  }

  ajaxGet(mainHint.url, function (resp) {

    mainHint.innerHTML = resp.html;
    mainHint.style.top = mainHint.sr.top + (mainHint.sr.bottom - mainHint.sr.top) + resp.offset_y;
    mainHint.style.left = mainHint.sr.left + (mainHint.sr.right - mainHint.sr.left) + resp.offset_x;

    var mr = mainHint.getBoundingClientRect();

    if (mainHint.f_mousepos){


      var hsrc_mr = mainHint.hsrc.getBoundingClientRect();

      if (hsrc_mr.left >  dhxWins.mouseX ||  hsrc_mr.right < dhxWins.mouseX || hsrc_mr.top > dhxWins.mouseY ||  hsrc_mr.bottom < dhxWins.mouseY ) {

        hint_hide();
        return;
      }

      mainHint.style.left=  dhxWins.mouseX + 16;
      mainHint.style.top= dhxWins.mouseY + 16;
    }

    var mr = mainHint.getBoundingClientRect();


    if (mr.right >= document.body.clientWidth)
    {
      mainHint.style.left =  dhxWins.mouseX - mr.width - 16;
    }

    if (parseInt(mainHint.style.left) <= 0 ) {

      mainHint.style.left = dhxWins.mouseX + 16;
    }

    if (mr.bottom >= document.body.clientHeight)
    {

      mainHint.style.top = dhxWins.mouseY - mr.height - 16;
    }

    if (parseInt(mainHint.style.top) <= 0 ) {

      mainHint.style.top = dhxWins.mouseY + 16;
    }


    mainHint.style.left = dhxWins.transform_x(parseInt(mainHint.style.left))+"px";
    mainHint.style.top = dhxWins.transform_y(parseInt(mainHint.style.top))+"px";
  });




}


function show_hint(event, src, contentid, offset_x, offset_y)
{

  //console.log('show_hint()');
  //console.log(event);
  //console.log(src);



  offset_x = offset_x || 0
  offset_y = offset_y || 0

  if (!mainHint)
    mainHint = document.getElementById('divHint');

  var e = prepare_event(event);
  var h = document.getElementById(contentid);
  if (h)
  {
    if ( mainHint.style.display == "block"  && ( mainHint.hsrc == src || mainHint.hsrc  == src.parentNode ) ) {

      return;
    }

    hint_hide();
    mainHint.innerHTML = h.innerHTML;

    var hintcss = h.getAttribute('hintcss');

    if ( hintcss ) {

      mainHint.className = 'hintcontent '+hintcss;
    }
    else {

      mainHint.className = 'hintcontent';
    }


    var sr = src.getBoundingClientRect();
    var mr = mainHint.getBoundingClientRect();


    mainHint.style.top = sr.top + (sr.bottom - sr.top) + offset_y;
    mainHint.style.left = sr.left + (sr.right - sr.left) + offset_x;
    mainHint.mouseX = e.clientX;
    mainHint.mouseY = e.clientY;

    mainHint.hsrc = src;
    mainHint.htimeout = setTimeout(hint_show, 500);

    src.onmouseleave = function ()
    {
      if (mainHint.style.display == 'block') {

        mainHint.hhtimeout = setTimeout(hint_hide, 1000);

      } else if (mainHint.htimeout) {

        clearTimeout(mainHint.htimeout);
        mainHint.htimeout = 0;

      }
    }

    mainHint.onmouseenter = function () {

      if (mainHint.hhtimeout) {

        clearTimeout(mainHint.hhtimeout);
      }
    }

    mainHint.onmouseleave = function () {

      if (mainHint.style.display == 'block') {

        mainHint.hhtimeout = setTimeout(hint_hide, 500);

      }
    }
  }


}

function hide_infobox(event){

  if (!mainInfoBox)  mainInfoBox= document.getElementById('divInfoBox');

  let target = event.target;
  while ( target && ( target.tagName != "BODY" && target != mainInfoBox )) {

    target = target.parentNode;
  }

  if (  mainInfoBox != target || mainInfoBox.hideonclick ) {

    $(mainInfoBox).hide();
  }

}

function show_infobox(event, src, contentid, hideonclick, offset_x, offset_y)
{

  //console.log('show_hint()');
  //console.log(event);
  //console.log(src);



  offset_x = offset_x || 0
  offset_y = offset_y || 0

  if (!mainInfoBox)

    mainInfoBox = document.getElementById('divInfoBox');

  var e = prepare_event(event);
  var h = document.getElementById(contentid);


  if ( $(mainInfoBox).is(':visible')   && ( mainInfoBox.hsrc == src || mainInfoBox.hsrc  == src.parentNode ) ) {

    $(mainInfoBox).hide();
    return;
  }


  if ( $(mainInfoBox).is(':visible') ) {

    $(mainInfoBox).hide();
  }

  mainInfoBox.innerHTML = h.innerHTML;
  mainInfoBox.hsrc = src;

  var sr = src.getBoundingClientRect();

  mainInfoBox.style.top = sr.top + (sr.bottom - sr.top) + offset_y;
  mainInfoBox.style.left = sr.left + (sr.right - sr.left) + offset_x;
  mainInfoBox.hideonclick = hideonclick;

  $(mainInfoBox).fadeIn(500);

  mainInfoBox.onclick = function () {

    if (mainInfoBox.hideonclick && $(mainInfoBox).is(':visible') ) {

      $(mainInfoBox).fadeOut(500);
    }
  }
}

function hide_popup_menu() {

  if (!mainPopupMenu) mainPopupMenu = document.getElementById('divPopupMenu');

  mainPopupMenu.style.display = 'none';

}

function show_popup_menu(event, contentid)
{

  //console.log('show_hint()');
  //console.log(event);
  //console.log(src);



  if (!mainPopupMenu)

    mainPopupMenu = document.getElementById('divPopupMenu');

  var e = prepare_event(event);
  var h = document.getElementById(contentid);

  hide_popup_menu();

  mainPopupMenu.innerHTML = h.innerHTML;


  mainPopupMenu.style.width = "auto";
  mainPopupMenu.style.height = "auto";


  if (document.body.clientHeight - dhxWins.mouseY < 32 ) {

    mainPopupMenu.style.top = document.body.clientHeight -32;
  }

  mainPopupMenu.style.display='flex';


  var mr = mainPopupMenu.getBoundingClientRect();

  //mainPopupMenu.oncontextmenu = function(event){console.log('gggggggggggg');return false;}
  mainPopupMenu.style.left= e.clientX + 2;
  mainPopupMenu.style.top= e.clientY + 2;//- parseInt(mr.height)-16;
  mainPopupMenu.style.width = ""+(parseInt(mr.width) )+"px";
  mainPopupMenu.style.height = ""+(parseInt(mr.height) )+"px";

//    console.log(mainPopupMenu.style.left,mainPopupMenu.style.top);

  var mr = mainPopupMenu.getBoundingClientRect();


  //mainPopupMenu.style.display='none';

  if (mr.right >= document.body.clientWidth)
  {
    mainPopupMenu.style.left =  dhxWins.mouseX - mr.width - 16;
  }

  if (mr.bottom >= document.body.clientHeight)
  {

    mainPopupMenu.style.top =  dhxWins.mouseY - mr.height - 16;
  }

  if (parseInt(mainPopupMenu.style.top) <= 0 ) {

    mainPopupMenu.style.top = dhxWins.mouseY + 16;
  }

  if (parseInt(mainPopupMenu.style.left) <= 0 ) {

    mainPopupMenu.style.left = dhxWins.mouseX + 16;
  }

  mainPopupMenu.style.left = dhxWins.transform_x(parseInt(mainPopupMenu.style.left))+"px";
  mainPopupMenu.style.top = dhxWins.transform_y(parseInt(mainPopupMenu.style.top))+"px";

}

function hint_text_hide()
{
  //console.log('hint_text_hide()');
  if (!mainTextHint) mainTextHint = document.getElementById('divTextHint');
  mainTextHint.style.display='none';
}




function hint_text_show()
{
  //console.log('hint_text_show()');

  mainTextHint.htimeout = 0;

  if (!mainTextHint) mainTextHint = document.getElementById('divTextHint');


  mainTextHint.style.width = "auto";
  mainTextHint.style.height = "auto";


  if (document.body.clientHeight - dhxWins.mouseY < 32 ) {

    mainTextHint.style.top = document.body.clientHeight -32;
  }




//    var mr_width = mr.right - mr.left;
//    var mr_height = mr.bottom - mr.top;




//    console.log("1. "+mr.width);

  if (mainTextHint.f_mousepos){


    var hsrc_mr = mainTextHint.hsrc.getBoundingClientRect();


    if (hsrc_mr.left >  dhxWins.mouseX ||  hsrc_mr.right < dhxWins.mouseX || hsrc_mr.top > dhxWins.mouseY ||  hsrc_mr.bottom < dhxWins.mouseY ) {

      hint_text_hide();
      return;
    }

    mainTextHint.style.display = 'flex';


    var mr = mainTextHint.getBoundingClientRect();


    mainTextHint.style.left = parseInt(dhxWins.mouseX + 16)+"px";
    mainTextHint.style.top= parseInt(dhxWins.mouseY - parseInt(mr.height)-16)+"px";
    mainTextHint.style.width = ""+(parseInt(mr.width) )+"px";
    mainTextHint.style.height = ""+(parseInt(mr.height) )+"px";
  }



  var mr = mainTextHint.getBoundingClientRect();


  //mainTextHint.style.display='none';

  if (mr.right >= document.body.clientWidth)
  {
    mainTextHint.style.left =  dhxWins.mouseX - mr.width - 16;
  }

  if (mr.bottom >= document.body.clientHeight)
  {

    mainTextHint.style.top =  dhxWins.mouseY - mr.height - 16;
  }

  if (parseInt(mainTextHint.style.top) <= 0 ) {

    mainTextHint.style.top = dhxWins.mouseY + 16;
  }

  if (parseInt(mainTextHint.style.left) <= 0 ) {

    mainTextHint.style.left = dhxWins.mouseX + 16;
  }

  mainTextHint.style.left = dhxWins.transform_x(parseInt(mainTextHint.style.left))+"px";
  mainTextHint.style.top = dhxWins.transform_y(parseInt(mainTextHint.style.top))+"px";


}

function hint_control_hide() {

  console.log('hint_control_hide()');
  if (mainControlHint) {

    mainControlHint.style.display='none';
    mainControlHint.onmouseout = null;
    mainControlHint.onmouseover = null;
    mainControlHint.hsrc.onmouseleave = null;
    mainControlHint.hsrc =false;
    mainControlHint = false;
  }
}


function hint_control_show()
{
  console.log('hint_control_show()');
  console.log(mainControlHint);
  if (mainControlHint) {

    mainControlHint.htimeout = 0;
    mainControlHint.style.display='block';
  }
}


function show_control_hint(event, src, control, offset_x,  offset_y )
{

  console.log('show_control_hint()');
  //console.log(event);
  //console.log(src);

  offset_x = offset_x || 0
  offset_y = offset_y || 0

  if (mainControlHint) {

    if ( mainControlHint.hsrc.id == src.id ) {

      return;
    }

    hint_control_hide();
  }

  var sr = src.getBoundingClientRect();


  mainControlHint = document.getElementById(control);

  mainControlHint.style.top = dhxWins.transform_y(parseInt(sr.top + (sr.bottom-sr.top) + parseInt(offset_y)))+"px";
  mainControlHint.style.left = dhxWins.transform_x(parseInt(sr.left + (sr.right-sr.left)+ parseInt(offset_x)))+"px";

  //console.log(offset_y);
  //console.log(mainControlHint);

  var e = prepare_event(event);

  mainControlHint.hsrc = src;
  mainControlHint.htimeout = setTimeout(hint_control_show,500);

  src.onmouseleave = function()
  {
    //console.log('src.onmouseout');
    if (mainControlHint.style.display == 'block') {

      mainControlHint.hhtimeout = setTimeout(hint_control_hide,1000);
    }
    else if (mainControlHint.htimeout) {

      clearTimeout(mainControlHint.htimeout);
      mainControlHint.htimeout = 0;
      mainControlHint.style.display='none';
      mainControlHint.onmouseout = null;
      mainControlHint.onmouseover = null;
      mainControlHint.hsrc.onmouseleave = null;
      mainControlHint.hsrc =false;
      mainControlHint = false;

    }
  }

  mainControlHint.onmouseover = function(){

    //console.log('mainControlHint.onmouseover');
    if (mainControlHint.hhtimeout) {

      clearTimeout(mainControlHint.hhtimeout);
    }
  }

  mainControlHint.onmouseout  = function(){

    //console.log('mainControlHint.onmouseout');

    if (mainControlHint.style.display == 'block') {

      mainControlHint.hhtimeout = setTimeout(hint_control_hide,500);

    }
  }




}



function show_note_hint(src, text){

  if (mainNoteHint == null) {

    mainNoteHint = document.getElementById('divNoteHint');
  }


  var sr = src.getBoundingClientRect();


  mainNoteHint.style.top = sr.top;
  mainNoteHint.style.left = sr.left;
  mainNoteHint.style.height = parseInt(sr.bottom-sr.top);
  mainNoteHint.style.width = parseInt(sr.right-sr.left);
  mainNoteHint.innerHTML = "<span>"+text+"</span>";

  mainNoteHint.style.display = 'flex';

  $(mainNoteHint).fadeOut(1000);
}

function show_copy_hint(src){

  if (mainCopyHint == null) {

    mainCopyHint = document.getElementById('divCopyHint');
  }


  var sr = src.getBoundingClientRect();


  mainCopyHint.style.top = sr.top;
  mainCopyHint.style.left = sr.left;
  mainCopyHint.style.height = parseInt(sr.bottom-sr.top);
  mainCopyHint.style.width = parseInt(sr.right-sr.left);

  mainCopyHint.style.display = 'block';

  $(mainCopyHint).fadeOut(1000);

}

function show_text_hint(event, src, html, offset_x, offset_y )
{

  //console.log('show_text_hint()');
  //console.log(event);
  //console.log(src);

  offset_x = offset_x || 0
  offset_y = offset_y || 0

  if (!mainTextHint) mainTextHint = document.getElementById('divTextHint');

  mainTextHint.style.display = "none";

  var e = prepare_event(event);

  if (html)
  {
    hint_text_hide();

    mainTextHint.innerHTML = "<span>"+html+"</span>";



    var sr = src.getBoundingClientRect();

    mainTextHint.style.top = dhxWins.transform_y(sr.top + (sr.bottom-sr.top) + offset_y)+"px";;
    mainTextHint.style.left = dhxWins.transform_x(sr.left + (sr.right-sr.left)+ offset_x)+"px";;

    mainTextHint.f_mousepos = true;
    mainTextHint.hsrc = src;

    mainTextHint.htimeout = setTimeout(hint_text_show,500);

    src.onmouseleave = function()
    {
      if (mainTextHint.style.display === 'flex') {

        mainTextHint.hhtimeout = setTimeout(hint_text_hide,500);

      }
      else if (mainTextHint.htimeout) {

        clearTimeout(mainTextHint.htimeout);
        mainTextHint.htimeout = 0;

      }
    }

    mainTextHint.onmouseenter = function(){

      if (mainTextHint.hhtimeout) {
        clearTimeout(mainTextHint.hhtimeout);
      }
    }

    mainTextHint.onmouseleave = function(){

      if (mainTextHint.style.display === 'flex') {

        mainTextHint.hhtimeout = setTimeout(hint_text_hide,500);

      }
    }


  }
}

function hide_percent_list(){

  if ( !mainPercentList ) {

    mainPercentList = document.getElementById('divPercentList');
  }

  mainPercentList.style.display = "none";
}

function show_percent_list(src)
{
  hide_percent_list();

  mainPercentList.hsrc = src;


  mainPercentList.select = function(p) {

    mainPercentList.style.display = 'none';
    mainPercentList.hsrc.firstChild.value = p;
    mainPercentList.hsrc.firstChild.onchange();
    mainPercentList.hsrc.childNodes[1].innerHTML = ""+p+"%";
    sound_click(2);

  }

  var min = parseInt($(src).attr("min"));
  var max = parseInt($(src).attr("max"));
  var step = parseInt($(src).attr("step"));

//    console.log(min, max, step);

  var html = "";

  for ( var i= min; i <= max; i+=step ) {

    html += "<div class='percent-item' onclick='mainPercentList.select("+i+")' percent='"+i+"'>"+i+"%</div>";
  }


  mainPercentList.style.width = "auto";
  mainPercentList.style.height = "auto";
//    alert(html);
  mainPercentList.innerHTML = html;

  mainPercentList.style.display = 'flex';

  var sr = src.getBoundingClientRect();
  var mr = mainPercentList.getBoundingClientRect();



  mainPercentList.style.top = dhxWins.transform_y(sr.top + (sr.bottom-sr.top)+1)+"px";
  mainPercentList.style.left = dhxWins.transform_x(parseInt(sr.left -  (mr.width -  sr.width ) / 2 ))+"px";

  var sr = src.getBoundingClientRect();
  var mr = mainPercentList.getBoundingClientRect();

  if (mr.right >= document.body.clientWidth)
  {
    mainPercentList.style.left = parseInt( mr.left -  (mr.right -  document.body.clientWidth ))+"px";
  }

  if (mr.bottom >= document.body.clientHeight)
  {

    mainPercentList.style.top =  parseInt( mr.top -  (mr.height + sr.height + 2))+"px";
  }

  if (parseInt(mainPercentList.style.top) <= 0 ) {

    mainPercentList.style.top = dhxWins.mouseY + 16;
  }

  if (parseInt(mainPercentList.style.left) <= 0 ) {

    mainPercentList.style.left = dhxWins.mouseX + 16;
  }
}

function load_hint(event, src, hint_url, offset_x, offset_y){

  offset_x = offset_x || 0
  offset_y = offset_y || 0

  //console.log('load_hint()');

  if (!mainHint)

    mainHint = document.getElementById('divHint');

  var e = prepare_event(event);

  if (hint_url)
  {
    if ( mainHint.style.display == "block"  && ( mainHint.hsrc == src || mainHint.hsrc  == src.parentNode ) ) {

      return;
    }

    hint_hide();

    mainHint.sr = src.getBoundingClientRect();
    mainHint.innerHTML = "<div style='width:32px;height:32px'><img src='/images/ui/flat/loader_32.png'></div>";
    mainHint.hsrc = src;


    var sr = src.getBoundingClientRect();


    mainHint.style.top = sr.top + (sr.bottom - sr.top) + offset_y;
    mainHint.style.left = sr.left + (sr.right - sr.left) + offset_x;
    mainHint.mouseX = e.clientX;
    mainHint.mouseY = e.clientY;

    mainHint.url = hint_url;
    mainHint.hsrc = src;
    mainHint.htimeout = setTimeout(url_hint_show, 500);


    src.onmouseleave = function ()
    {
      if (mainHint.style.display == 'block') {

        mainHint.hhtimeout = setTimeout(hint_hide, 1000);

      } else if (mainHint.htimeout) {

        clearTimeout(mainHint.htimeout);
        mainHint.htimeout = 0;

      }
    }

    mainHint.onmouseenter = function () {

      if (mainHint.hhtimeout) {

        clearTimeout(mainHint.hhtimeout);
      }
    }

    mainHint.onmouseleave = function () {

      if (mainHint.style.display == 'block') {

        mainHint.hhtimeout = setTimeout(hint_hide, 500);

      }
    }
  }


}

function show_hint_mouse(event, src, contentid)
{

  if (!mainHint)
    mainHint = document.getElementById('divHint');

  var e = prepare_event(event);
  var h = document.getElementById(contentid);
  if (h)
  {
    hint_hide();
    mainHint.innerHTML = h.innerHTML;
    var sr = src.getBoundingClientRect();
    var mr = mainHint.getBoundingClientRect();


    //mainHint.style.top = sr.top + (sr.bottom-sr.top);
    //mainHint.style.left = sr.left + (sr.right-sr.left);

    mainHint.style.top = sr.top;
    mainHint.style.left = sr.left;

    mainHint.hsrc = src;
    mainHint.htimeout = setTimeout(hint_show, 500);

    src.onmouseout = function ()
    {
      this.onmouseout = null;
      clearTimeout(mainHint.htimeout);
    }
  }
}

function getWindow(id)
{
  if ( dhxWins) {

    var win = dhxWins.window(id);
    if (!win)
    {
      alert("Window [" + id + "] not found!");
      return null;
    }

    return win.owner;
  }

  return false;
}

function showMessageS(caption, html, w, h, icon, closeaction)
{
  var resp = new Object();
  resp.caption = caption;
  resp.html = html;
  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/i_message_12.png";
  resp.closeaction = closeaction;

  resp.html = "<table style='width:100%;height:100%'>\
                <tr>\
                <td class='text12' align=center valign=middle>"
    + html +
    "</td>\
        </tr>\
        </table>";

  showMessage(resp);
}

function showConfirm(caption, html, action, icon, w, h, cancelaction)
{
  var resp = new Object();
  resp.caption = caption;
  resp.html = "<table style='width:100%;height:100%'>\
                <tr>\
                <td class='text_n text12' align=center valign=middle>"
    + html +
    "</td>\
        </tr>\
        </table>";

  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/i_warning_red_16.png";

  var mw_name = "dhxWins_mw_" + dhxWins_mw_counter++;
  var mw = dhxWins.createWindow(
    mw_name,
    parseInt(0), parseInt(0), parseInt(resp.w + 40-16), parseInt(resp.h + 110-18));

  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);
  mw.denyResize();
  mw.center();
  mw.setModal(true);
  mw.denyMove();
  mw.bringToTop();

  var html = "<div class='textcontainer-g' style='position:absolute;top:0px;left:0px;width:" + (resp.w) + "px;height:" + (resp.h) + "px;height:" + (resp.h) + "px!ie;overflow:auto;'>" + resp.html + "</div>" +
    "<div style='position:absolute;top:" + (resp.h + 15) + "px;left:0px;width:" + (300) + "px;height:80px;overflow:hidden;font-size:12px;'>" +
    "<table align=center><tr><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + action + "); else window.eval(" + action + "); \">OK</button>" +
    "</td><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + cancelaction + "); else window.eval(" + cancelaction + ");\">"+js_lang.getString(js_lang.CANCEL)+"</button>" +
    "</td></tr></table></div>";
  mw.attachHTMLString(html);
}

function showConfirmAccessCode(caption, html, action, icon, w, h, cancelaction)
{
  var resp = new Object();
  resp.caption = caption;

  resp.html = "<table style='width:100%;height:100%'>\
                <tr>\
                <td class='center text_n text12' align=center valign=middle>"
    + html +
    "</td>\
        </tr>\
        <tr>\
        <td class='center' align=center valign=middle>\
        <input type='text' class='inputText' style='text-align:center;height:24px;width:200px;background-size:6px 8px, 6px 6px, 194px 6px, 6px 8px,6px 6px, 194px 6px, 188px 8px'  id='confirmaccesscode' value=''/>\
        </td>\
        </tr>\
        </table>";

  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/i_warning_red_16.png";

  var mw_name = "dhxWins_mw_" + dhxWins_mw_counter++;
  var mw = dhxWins.createWindow(
    mw_name,
    parseInt(0), parseInt(0), parseInt(resp.w + 40-16), parseInt(resp.h + 110-18));

  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);
  mw.denyResize();
  mw.center();
  mw.setModal(true);
  mw.denyMove();
  mw.bringToTop();


  var html = "<div class='textcontainer-g' style='position:absolute;top:0px;left:0px;width:" + (resp.w) + "px;height:" + (resp.h) + "px;height:" + (resp.h) + "px!ie;overflow:auto;'>" + resp.html + "</div>" +
    "<div style='position:absolute;top:" + (resp.h + 15) + "px;left:0px;width:" + (300) + "px;height:80px;overflow:hidden;font-size:12px;'>" +
    "<table align=center><tr><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);accesscode = $('#confirmaccesscode').val();dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + action + "); else window.eval(" + action + "); \">OK</button>" +
    "</td><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + cancelaction + "); else window.eval(" + cancelaction + ");\">"+js_lang.getString(js_lang.CANCEL)+"</button>" +
    "</td></tr></table></div>";
  mw.attachHTMLString(html);
}

function showConfirm(caption, html, action, icon, w, h, cancelaction)
{
  var resp = new Object();
  resp.caption = caption;
  resp.html = "<table style='width:100%;height:100%'>\
                <tr>\
                <td class='text_n text12' align=center valign=middle>"
    + html +
    "</td>\
        </tr>\
        </table>";

  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/i_warning_red_16.png";

  var mw_name = "dhxWins_mw_" + dhxWins_mw_counter++;
  var mw = dhxWins.createWindow(
    mw_name,
    parseInt(0), parseInt(0), parseInt(resp.w + 40-16), parseInt(resp.h + 110-18));

  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);
  mw.denyResize();
  mw.center();
  mw.setModal(true);
  mw.denyMove();
  mw.bringToTop();

  var html = "<div class='textcontainer-g' style='position:absolute;top:0px;left:0px;right:0px;height:" + (resp.h) + "px;height:" + (resp.h) + "px!ie;overflow:auto;'>" + resp.html + "</div>" +
    "<div style='position:absolute;top:" + (resp.h + 15) + "px;left:0px;width:" + (300) + "px;height:80px;overflow:hidden;font-size:12px;'>" +
    "<table align=center><tr><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + action + "); else window.eval(" + action + "); \">OK</button>" +
    "</td><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + cancelaction + "); else window.eval(" + cancelaction + ");\">"+js_lang.getString(js_lang.CANCEL)+"</button>" +
    "</td></tr></table></div>";
  mw.attachHTMLString(html);
}

function showInputText(caption, label, action, icon,  w, h, f_modal)
{
  var resp = new Object();
  resp.caption = caption;
  resp.html = "<textarea style='position:absolute:left:5px;right:5px bottom:5px;top:5px'></textarea>";

  f_modal = typeof f_modal === 'undefined' ? false : f_modal;

  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/flat/i-copy-16.png";

  var mw_name = "dhxWins_inputext";

  var mw = dhxWins.window(mw_name);

  if (!mw) {


    mw = dhxWins.createWindow(
      mw_name,
      parseInt(0), parseInt(0), parseInt(resp.w + 40-16), parseInt(resp.h + 110-18));

  }
  else {

    mw.setDimension(resp.w + 40-16, resp.h + 110-18);
  }

  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);

  mw.denyPark();
  mw.denyResize();

  if (f_modal) {

    mw.setModal(true);
    mw.denyMove();
    mw.center();
    mw.denyResize();
  }

  mw.center();


  mw.bringToTop();

  var html = "<div class='titlebox' style='position:absolute;top:0px;left:0px;right:0px;height:28px;'>"+label+"</div>" +
    "<form id='it_form' class='m0'>" +
    "<div style='position:absolute;bottom:38px;left:0px;right:0px;top:30px;overflow:hidden;padding:0px'>" +
    "<textarea class='inputText pa w100p h100p m0 p0' name='text'></textarea>"+
    "</div>"+
    "</form>"+
    "<div class='controls-center-row' style='position:absolute;bottom:0px;px;left:0px;right:0px;height:34px;overflow:hidden;'>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);if (window.execScript) window.execScript(" + action + "); else window.eval(" + action + ");dhxWins.window('" + mw_name + "').close();  \">OK</button>" +
    "</div>";
  mw.attachHTMLString(html);
}

function showConfirmIG( defaction, actionig, actioncert, caption, html, icon, w, h, cancelaction)
{
  var mw_name = "dhxWins_mw_" + dhxWins_mw_counter++;

  var resp = new Object();
  resp.caption = caption;
  resp.html = "<table style='width:100%;height:100%'>\
                <tr>\
                <td class='text_n text12' align=center valign=middle>"
    + html +

    "<table align=center class='textbox-d mt10'>" +
    "<tr class='h20'><td class='w22'><span class='inputCheckBox "+( defaction == 0 ? 'inputCheckBoxChecked' : '')+"' onmousedown='sound_click(1);radio_action(this)'><input name='src' id='"+mw_name+"_src_ig' value='0' type='radio' "+ ( defaction == 0 ? 'checked' : '' )+"></span></td><td class='w22'><img class='w20 h20'src='/images/icons/i_trade_24.png'></td><td class='text_n text12'>"+(js_lang.getString(js_lang.FROMMAINACCOUNTIG))+"</td></tr>" +
    "<tr class='h20'><td class='w22'><span class='inputCheckBox "+( defaction == 1 ? 'inputCheckBoxChecked' : '')+"' onmousedown='sound_click(1);radio_action(this)'><input name='src' id='"+mw_name+"_src_cert' value='1' type='radio' "+ ( defaction == 1 ? 'checked' : '')+"></span></td><td class='w22'><img class='w20 h20' src='/images/icons/i-bonuse-24.png'></td><td class='text_n text12'>"+(js_lang.getString(js_lang.FROMBONUSECERTACCOUNT))+"</td></tr>" +
    "</table></td>"+

    "</td>\
        </tr>\
        </table>";

  resp.w = w || 300;
  resp.h = h || 200;
  resp.icon = icon || "/images/icons/i_warning_red_16.png";


  var mw = dhxWins.createWindow(
    mw_name,
    parseInt(0), parseInt(0), parseInt(resp.w + 40 - 16), parseInt(resp.h + 110 + 48 -18));

  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);
  mw.denyResize();
  mw.center();
  mw.setModal(true);
  mw.denyMove();
  mw.bringToTop();
//( $("#"+mw_name+"_src_ig").prop('cheched') ? actionig : actioncert )
  var html = "<div class='textcontainer-g' style='position:absolute;top:0px;left:0px;right:0px;height:" + (resp.h + 48) + "px;height:" + (resp.h) + "px!ie;overflow:auto;'>" + resp.html +
    "</div>" +
    "<div style='position:absolute;top:" + (resp.h + 15 + 48) + "px;left:0px;width:" + (300) + "px;height:80px;overflow:hidden;font-size:12px;'>" +
    "<table align=center><tr><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);if ($('#"+mw_name+"_src_ig').prop('checked')) {  if (window.execScript) window.execScript( "+ actionig +" ) ; else window.eval( "+ actionig + ");} else {if (window.execScript) window.execScript( "+ actioncert +" )  ; else window.eval( "+ actioncert + ");} dhxWins.window('" + mw_name + "').close();\">OK</button>" +
    "</td><td>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close(); if (window.execScript) window.execScript(" + cancelaction + "); else window.eval(" + cancelaction + ");\">"+js_lang.getString(js_lang.CANCEL)+"</button>" +
    "</td></tr></table></div>";
  mw.attachHTMLString(html);
}

function showMessage(resp, winid)
{
  var mw_name = winid ? winid : "dhxWins_mw_" + dhxWins_mw_counter++;

  var mw = dhxWins.createWindow(
    mw_name,
    parseInt(0), parseInt(0), parseInt(resp.w + 40 - 16), parseInt(resp.h + 90 - 18));
  if (resp.closeaction)
  {
    mw.closeaction = resp.closeaction;
    mw.attachEvent("onClose", function (win) {
      if (window.execScript)
        window.execScript(mw.closeaction);
      else
        window.eval(mw.closeaction)
      return true;//win.hide();
    });
  }
  mw.setText(resp.caption);
  mw.setIcon("../../../.." + resp.icon, "../../../.." + resp.icon);
  mw.denyResize();
  mw.center();
  mw.setModal(true);
  mw.denyMove();
  mw.bringToTop();
  var html = "<div class='textcontainer-g' style='position:absolute;top:0px;left:0px;right:0px;bottom:40px;overflow:auto;'>" + resp.html + "</div>" +
    "<div class='controls-center' style='position:absolute;bottom:0px;left:0px;right:0px;height:40px;overflow:hidden;font-size:12px;'>" +
    "<button class='text_btn' style='font-size:13;width:100px;height:24px;' onclick=\"sound_click(2);dhxWins.window('" + mw_name + "').close();;\">OK</button>" +
    "</div>";
  mw.attachHTMLString(html);
}

function Window(p)
{
  this.urlp = "";
  this.p = p;

  Object.defineProperty (this, "loadcontent", {value: function (urlp,form) {

      this.urlp = urlp;
      this.form = form;

      var url = "?m=windows&w=" + this.p.name + (urlp ? "&" + urlp : "");

      if ( typeof form === 'undefined' || !form ) {

        ajaxGet(url, this.on_loadcontent, (this.start_load).bind(this));
      }
      else {

        this.start_load();
        ajaxPostForm(url, form, this.on_loadcontent);
      }

    }, writable:false, configurable:false});


  this.loading_counter = 0;

  Object.defineProperty (this, "start_load", {value: function (dest) {

      if (dest == "none")

        return;

      if (this.loading_counter <= 0)
      {
        this.win.progressOn();
        this.loading_counter = 0;
        this.modal.style.display = 'block';
      }

      this.loading_counter++;

    }, writable:false, configurable:false});


  Object.defineProperty (this, "end_load", {value: function (dest) {

      this.loading_counter--;
      if (this.loading_counter <= 0)
      {
        this.win.progressOff();
        this.loading_counter = 0;
        this.modal.style.display = 'none';
        userScripts.process('wnd_end_load',this);
      }


    }, writable:false, configurable:false});

  Object.defineProperty (this, "get", {value: function (action, dest, urlp, f_blocked) {

      if (f_blocked == undefined) {

        f_blocked = true;
      }


      if (!dest)

        dest = 'window';

      if (f_blocked) {

        this.start_load(dest);
      }

      var url = "?m=windows&w=" + this.p.name + '&a=' + action + '&dest=' + dest + (urlp ? "&" + urlp : "");

      ajaxGet(url, this.on_loadcontent);


    }, writable:false, configurable:false});


  Object.defineProperty (this, "post", {value: function (action, form, dest, params, f_blocked) {

      if (f_blocked == undefined) {
        f_blocked = true;
      }

      if (!dest)
        dest = 'window';

      if (f_blocked) {

        this.start_load(dest);
      }

      var url = "?m=windows&w=" + this.p.name + '&a=' + action + (params ? '&' + params : '') + '&dest=' + dest;

      ajaxPostForm(url, form, this.on_loadcontent);

    }, writable:false, configurable:false});


  Object.defineProperty (this, "on_loadcontent", {value: function(resp) {

      if (resp.wnd)
      {
        resp.wnd.end_load(resp.dest);
      }

      if (resp.RESULT !== "OK")
      {
        return false;
      }

      if (resp.dest === "window")
      {
        getWindow(resp.win).container.innerHTML = resp.html;
        return true;
      }
      else if (resp.dest === "infobox")
      {
        getWindow(resp.win).infobox.innerHTML = resp.html;
        getWindow(resp.win).infobox.style.display = 'block';
        userScripts.process('wnd_infobox_show',this);
        return true;
      }
      else if (resp.dest)
      {
        var el = document.getElementById(resp.dest);
        if (el)
        {
          el.innerHTML = resp.html;
          return true;
        }
      }


      return false;

    }, writable:false, configurable:false});



  if (this.p.name == 'WndHelp' || this.p.name == 'WndStarMapB' || this.p.name == 'WndAdversting' ) {

    this.onshow = function (urlp,form)
    {
      this.loadcontent(urlp,form);
      this.savePosition();
    };
  }
  else {

    Object.defineProperty (this, "onshow", {value: function(urlp,form) {

        this.loadcontent(urlp,form);
        this.savePosition();

        if (typeof this.on_show === 'function' ) {

          this.on_show();
        }

      }, writable:false, configurable:false});
  }

  this.isshow = function ()
  {
    return !this.win.isHidden();
  };




  this.setIcon = function (icon)
  {
    this.win.setIcon("../../../.." + icon, "../../../.." + icon);
  }

  this.setSize = function (w, h)
  {
    w = w - 16;
    h = h - 18;

    var pos = this.win.getPosition();
    if (pos[0] + w > dhxWins.vp.clientWidth)
    {
      pos[0] = dhxWins.vp.clientWidth - w;
      if (pos[0] < 0)
      {
        pos[0] = 0;
      }
    }

    if (pos[1] + h > dhxWins.vp.clientHeight)
    {
      pos[1] = dhxWins.vp.clientHeight - h;
      if (pos[1] < 0)
      {
        pos[1] = 0;
      }
    }
    this.win.setPosition(pos[0], pos[1]);

    this.win.setDimension(w, h);
  }

  Object.defineProperty (this, "show", {value: function (urlp, form) {

      if (this.p.active)
      {
        sound_click(3);
        this.win.show();
        this.win.bringToTop();

        if (this.win.isParked())
          this.win.park();

        if (this.p.flags & WF_NOHEADER)
        {
          this.win.hideHeader();
        }

        if (this.p.flags & WF_MODAL)
        {
          this.win.setModal(true);
        }

        this.savePosition();
        this.onshow(urlp,form);
      }

    }, writable:false, configurable:false});


  var save_bounds = localStorage.getItem(p.name + '_bounds');

  if (save_bounds) {

    save_bounds = JSON.parse(save_bounds);

    p.settings_visible = (!save_bounds[0]);

//        console.log("settings_v:"+p.settings_visible);

    p.bounds[0] = parseInt(save_bounds[1]);
    p.bounds[1] = parseInt(save_bounds[2]);

    if (!(p.flags & WF_FIXED))
    {
      p.bounds[2] = parseInt(save_bounds[3]);
      p.bounds[3] = parseInt(save_bounds[4]);
    }

  }

  p.visible = (p.start_visible && p.settings_visible) || p.always_visible;



  if (parseInt(p.bounds[0]) + parseInt(p.bounds[2]) > parseInt(dhxWins.vp.clientWidth))
  {
    p.bounds[0] = parseInt(dhxWins.vp.clientWidth) - parseInt(p.bounds[2]);

    if (p.bounds[0] < 0)
    {
      p.bounds[0] = 0;
    }
  }

  if (parseInt(p.bounds[1]) + parseInt(p.bounds[3]) > parseInt(dhxWins.vp.clientHeight))
  {
    p.bounds[1] = parseInt(dhxWins.vp.clientHeight) - parseInt(p.bounds[3]);

    if (p.bounds[1] < 0)
    {
      p.bounds[1] = 0;
    }
  }




  this.win = dhxWins.createWindow(this.p.name, Math.max(0,parseInt(this.p.bounds[0])), Math.max(0,parseInt(this.p.bounds[1])), Math.max(100,parseInt(this.p.bounds[2] - 16)), Math.max(100,parseInt(this.p.bounds[3] - 18)));
  this.win.owner = this;




  if (this.p.name == 'WndHelp' || this.p.name == 'WndStarMapB' || this.p.name == 'WndAdversting' ) {

    this.onclose = function ()
    {
      this.container.innerHTML = "";
      this.get('hide','none',"");
    }
  }
  else {

    Object.defineProperty (this, "onclose", {value: function () {

        this.container.innerHTML = "";
        this.get('hide','none',"");

      }, writable:false, configurable:false});
  }




  this.win.attachEvent("onClose", function (win) {

    win.hide();
    sound_click(3);

    win.owner.savePosition();

    if (win.owner.onclose)
    {
      win.owner.onclose();
    }

    if (win.owner.p.flags & WF_MODAL)
    {
      win.setModal(false);
    }
  });


  Object.defineProperty (this, "close", {value: function() {

      this.win.close();
      this.onclose();

      if ( typeof this.on_close  === 'function' ) {

        this.on_close();
      }

    }, writable:false, configurable:false});

  Object.defineProperty (this, "hideInfoBox", {value: function(delay) {

      if (typeof delay != "undefined") {

        $(this.infobox).fadeOut(delay);
      }
      else {

        this.infobox.style.display= 'none';
      }

    }, writable:false, configurable:false});

  this.win.attachEvent("onMoveFinish", function (win) {

    win.owner.savePosition();
  });

  this.savePosition = function () {

    var pos = this.win.getPosition();
    var dim = this.win.getDimension();
    var bounds = [this.win.isHidden(), parseInt(pos[0]), parseInt(pos[1]), parseInt(dim[0])+16, parseInt(dim[1])+18];
    localStorage.setItem(this.p.name + '_bounds', JSON.stringify(bounds));
  };


  if (this.p.name == 'WndStarMapB') {

    this.refresh = function (f_url)
    {
      if (typeof f_url === 'undefined') {

        f_url = ( this.p.flags & WF_REFRESH_WITH_URL) == WF_REFRESH_WITH_URL;
      }

      this.loadcontent(f_url ? this.urlp : "", f_url && this.form  ? this.form : null);
    }
  }
  else {

    Object.defineProperty (this, "refresh", {value: function (f_url) {

        if (typeof f_url === 'undefined') {

          f_url = ( this.p.flags & WF_REFRESH_WITH_URL) == WF_REFRESH_WITH_URL;
        }

        this.loadcontent(f_url ? this.urlp : "", f_url && this.form  ? this.form : null);

      }, writable:false, configurable:false});
  }

  /*
      this.refresh = function (f_url)
      {
          if (typeof f_url == 'undefined') {

              f_url = true;
          }

          this.loadcontent(f_url ? this.urlp : "");
      }
  */

  this.win.button("stick").attachEvent("onClick", function (win) {
    sound_click(2);

    win.owner.infobox.style.display = 'none';
    win.owner.infobox.innerHTML = "";
    win.progressOff();
    win.owner.loading_counter = 0;
    win.owner.modal.style.display = 'none';
    win.owner.refresh();
  });

  this.win.button("park").attachEvent("onClick", function (win) {
    sound_click(2);
    win.park();
  });

  this.win.button("close").attachEvent("onClick", function (win) {
    sound_click(2);
    win.close();
  });

  this.win.attachEvent("onResizeFinish", function (win) {


    var pos = win.getPosition();
    var dim = win.getDimension();
    if (win.owner.onresize)
    {
      win.owner.onresize(pos, dim);
    }

    win.owner.savePosition();

  });

  this.win.attachEvent("onMaximize", function (win) {
    sound_click(2);
    if (win.owner.onresize)
    {
      var pos = win.getPosition();
      var dim = win.getDimension();
      win.owner.onresize(pos, dim);
    }
  });

  this.win.attachEvent("onMinimize", function (win) {
    sound_click(2);


    console.log(win.owner.p.bounds[2],win.owner.p.bounds[3]);

    win.setDimension(0,0);

    if (win.owner.onresize)
    {
      var pos = win.getPosition();
      var dim = win.getDimension();
      win.owner.onresize(pos, dim);
    }
  });

  var modaldiv = "<div id='" + this.p.name + "_modal' style='background:rgba(0,0,0,0.75);position:absolute;display:none;z-index:10001;top:0px;left:0px;right:0px;bottom:0px;'></div>";
//    var layout = "<div id='" + this.p.name + "_container' onclick=\"this.owner.infobox.style.display='none'\" style='position:absolute;top:0px;left:0px;right:0px;bottom:0px;" + p.background + "'></div>";
//    var layout = "<div id='" + this.p.name + "_container' onclick=\"$(this.owner.infobox).style.display='none'\" style='position:absolute;top:0px;left:0px;right:0px;bottom:0px;" + p.background + "'></div>";
  var layout = "<div id='" + this.p.name + "_container' onclick=\" if (this.owner.infobox.close_on_wnd_click) { $(this.owner.infobox).fadeOut(500) } \" style='position:absolute;top:0px;left:0px;right:0px;bottom:0px;" + p.background + "'></div>";
  var infobox = "<div id='" + this.p.name + "_infobox' class='win-infobox' style='position:absolute;z-index:10001;display:none;max-width:"+(p.bounds[2])+"px;max-height:"+(p.bounds[3])+"px'></div>";

  this.win.attachHTMLString(modaldiv + layout +infobox);
  this.modal = document.getElementById(this.p.name + '_modal');
  this.container = document.getElementById(this.p.name + '_container');
  this.container.owner = this;
  this.infobox = document.getElementById(this.p.name + '_infobox');

  this.win.hide();

  this.win.keepInViewport(true);
  this.win.setText(this.p.caption);
  this.win.setIcon("../../../.." + this.p.icon, "../../../.." + this.p.icon);

  if (!(this.p.flags & WF_NORELOAD))
  {
    this.win.button('stick').show();
  }

  if (this.p.flags & WF_FIXED)
  {
    this.win.denyResize();
    this.win.button('minmax1').hide();

  }

  if (this.p.flags & WF_CENTER)
  {
    this.win.center();
    this.win.denyMove();
  }

  if (this.p.flags & WF_NOCLOSE)
  {
    this.win.button('close').hide();
  }

  if (this.p.flags & WF_NOPARK)
  {
    this.win.button('park').hide();
  }

  if (this.p.flags & WF_STAYONTOP)
  {
    this.win.stick();
  }

//console.log(this.p.name,this.p);

  if (this.p.visible)
  {
    this.show();
  }




}

var loading_counter = 0;
function loading_show()
{
  if (document.getElementById('modal'))
  {
    if (loading_counter == 0)
    {
      document.getElementById('modal').style.display = 'block';
    }
    loading_counter++;
  }
}

function loading_hide()
{
  if (document.getElementById('modal'))
  {
    loading_counter--;
    if (loading_counter <= 0)
    {
      document.getElementById('modal').style.display = 'none';
      loading_counter = 0;
    }
  }
}

window._dhtmlXCombo = window.dhtmlXCombo;
window.dhtmlXCombo = function (parent, name, width, type, index, filter, xml, readonly)
{
  var base = new window._dhtmlXCombo(parent, name, width, type, index, filter, xml, readonly);
  //console.debug('combo: '+name);
  var interval = setInterval(function () {
    var exists = document.body.contains(base.DOMelem);
    if (!exists) {
      base.destructor();
      clearInterval(interval);
    }

  }, 4000);

  return base;
}

function initWindows(vpId)
{
  dhtmlx.skin = "dhx_web";
  dhtmlx.image_path = "/common/js/dhtmlx/imgs/";

  dhxWins = new dhtmlXWindows();
  dhxWins.enableAutoViewport(false);
  dhxWins.attachViewportTo(vpId);
  dhxWins.setImagePath("/common/js/dhtmlx/imgs/");
  dhxWins.setSkin("dhx_web");

  ajaxGetSync("?m=windows", function (resp) {
    for (var i = 0; i < resp.windows.length; i++)
    {
      var wndp = resp.windows[i];

      switch (wndp.jsclass)
      {
        case "Window":
        {
          new Window(wndp);
          break;
        }
      }
    }
  });


  dhxWins.save_positions = function () {

    var params = "";
    for (var name in dhxWins.wins) {

      var win = this.window(name)
      var pos = win.getPosition();
      var dim = win.getDimension();

      if (params !== "") {

        params = params + '&';
      }

      params = params + 'windows[' + name + ']=' + (win.isHidden() ? "0" : "1") + "," + pos[0] + "," + pos[1] + "," + dim[0] + "," + dim[1];
    }
    ;

    return params;
  }



  document.body.onclick = function (event) {

    hint_hide();
    hint_text_hide();
    hide_popup_menu();
    hide_percent_list();

  }

  dhxWins.transform_y = function (y) {

    var dbr = document.documentElement.getBoundingClientRect();

    return parseInt(y) - parseInt(dbr.top)
  }

  dhxWins.transform_x = function (x) {

    var dbr = document.documentElement.getBoundingClientRect();

    return parseInt(x) - parseInt(dbr.left)
  }

  window.onmousemove = function (event) {

    var e = prepare_event(event);
    dhxWins.mouseX = parseInt(e.clientX);
    dhxWins.mouseY = parseInt(e.clientY);
  }
  /*
      window.onmouseover = function (event) {

          event = prepare_event(event);
          if (event.target) {

                  if (event.target.dataset.hint !== undefined && event.target.parentNode.dataset.hint === undefined && event.target.parentNode.getAttribute("disabled") == null ) {

                      console.log('window.event.target.dataset.hint.onmouseover ('+event.target.dataset.hint+', '+event.target+')');
                      show_text_hint(event, event.target, event.target.dataset.hint);
                      event.stopPropagation();
                  } else if (event.target.dataset.hintid !== undefined) {

                      show_hint(event, event.target, event.target.dataset.hintid, event.target.dataset.hintx || 0, event.target.dataset.hinty || 0);
                      event.stopPropagation();

                  } else if (event.target.dataset.hintcontrolid !== undefined) {

                      show_control_hint(event, event.target, event.target.dataset.hintcontrolid, event.target.dataset.hintx || 0, event.target.dataset.hinty || 0);
                      event.stopPropagation();

                  } else if (event.target.dataset.hinturl !== undefined) {

                      load_hint(event, event.target, event.target.dataset.hinturl);
                      event.stopPropagation();
                  }
              }
      }
  */
  /*
       window.onmouseover = function(event) {

          //event = prepare_event(event);
          if (event.target) {


              while (target)
              if (event.target.dataset.hint) {

                  show_text_hint(event,event.target,event.target.dataset.hint);

              }
              else if (event.target.dataset.hintid) {

                  console.log(event.target.dataset.hintid);
                  show_hint(event,event.target,event.target.dataset.hintid, event.target.dataset.hintx || 0, event.target.dataset.hinty || 0);
              }
              else if (event.target.dataset.hintcontrolid) {

                  show_control_hint(event,event.target,event.target.dataset.hintcontrolid, event.target.dataset.hintx || 0, event.target.dataset.hinty || 0);
              }
              else if (event.target.dataset.hinturl) {

                  load_hint(event,event.target,event.target.dataset.hinturl);
              }
              else if (event.target.parentNode && event.target.parentNode.dataset){

                  if (event.target.parentNode.dataset.hint) {

                      show_text_hint(event,event.target.parentNode,event.target.parentNode.dataset.hint);
                  }
                  else if (event.target.dataset.hintcontrolid) {

                      show_control_hint(event,event.target.parentNode,event.target.parentNode.dataset.hintcontrolid,event.target.parentNode.dataset.hintx || 0, event.target.parentNode.dataset.hinty || 0);
                  }
                  else if (event.target.parentNode.dataset.hintid) {

                      show_hint(event,event.target.parentNode,event.target.parentNode.dataset.hintid, event.target.parentNode.dataset.hintx || 0, event.target.parentNode.dataset.hinty || 0);
                  }
                  else if (event.target.parentNode.dataset.hinturl) {

                       load_hint(event,event.target.parentNode,event.target.parentNode.dataset.hinturl);
                  }
                  else {

                      hint_text_hide();
                  }
              }
              else {

                  hint_text_hide();
              }
          }
          else {

              hint_text_hide();
          }

          return cancelEvent(event);
      }
      */
  window.onmouseover = function(event) {

    //event = prepare_event(event);
    let target = event.target;
    //let i = 0;

    while (target && target.tagName != "BODY") {

      //console.log((++i)+'. ' +target.tagName);

      if (target.dataset) {

        if (target.dataset.hint) {

          show_text_hint(event,target,target.dataset.hint);
          break;

        }
        else if (target.dataset.hintid) {

          show_hint(event,target,target.dataset.hintid, target.dataset.hintx || 0, target.dataset.hinty || 0);
          break;
        }
        else if (target.dataset.hintcontrolid) {

          show_control_hint(event,target,target.dataset.hintcontrolid, target.dataset.hintx || 0,target.dataset.hinty || 0);
          break;
        }
        else if (target.dataset.hinturl) {

          load_hint(event,target,target.dataset.hinturl);
          break;
        }
      }


      target = target.parentNode;
    }

    if (!target || target.tagName == "BODY") {

      hint_text_hide();
      return true;
    }

    return cancelEvent(event);
  }

}

function show_help(section, id, race, level) {

  var urlp = 'id=' + section + '-' + id;

  if (race) {

    urlp = uplp + ':' + race;
  }

  if (level) {

    urlp = uplp + '&level=' + level;
  }

  getWindow('WndHelp').show(urlp);

}