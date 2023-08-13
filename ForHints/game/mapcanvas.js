/*
function getWindow(){return null;}
var mainTimer = null;
function hide_quest(){}
function loading_hide(){}
*/

function mapcanvas_fleets_timer()
{


  var wnd = getWindow('WndStarMapB');
  if (!wnd || !wnd.map)  return;

  var mapFleets = wnd.map.fleets;
  var f_redraw = false;
  for(var id in mapFleets)
  {

    var fleet = mapFleets[id];
    //if (!fleet.isshow) continue;

    if (fleet.timeleft > 0)
    {
      fleet.timeleft--;
      //console.log(fleet.timeleft);
      if (fleet.timeleft <= 0)
      {
        //getWindow('WndStarMapB').map.reload_fleet(id);
        //f_redraw = true;
      }
      else if (fleet.speed > 0)
      {

        var d = (parseFloat(fleet.speed) * parseFloat((parseInt(fleet.time) - parseInt(fleet.timeleft)))) / 3600.0;

        var a = parseFloat(fleet.nx)-parseFloat(fleet.sx);
        var b = parseFloat(fleet.ny)-parseFloat(fleet.sy);
        var c = Math.sqrt(a*a + b*b);
        //console.log(d,a,b,c);
        var x = parseFloat(fleet.sx) + d * (a / c);
        var y = parseFloat(fleet.sy) + d * (b / c);
        //console.log(x,y);
        if (x != fleet.x || y != fleet.y)
        {
          fleet.x = x;
          fleet.y = y;
          f_redraw = fleet.isshow;
        }
      }
    }
  }

  if ( this.flt_fleets && f_redraw )
  {
    getWindow('WndStarMapB').map.redraw(true);
  }
}

function mapcanvas_mouse_weelb(e)
{
  e = e ? e : window.event;
  // Получить элемент, на котором произошло событие
  var wheelElem = e.target ? e.target : e.srcElement;
  // Получить значение поворота колесика мыши
  var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
  // В движке WebKit возвращается значение в 100 раз больше
  if (Math.abs(wheelData) > 100) { wheelData=Math.round(wheelData/100); }

  var wnd = getWindow('WndStarMapB');
  var map = wnd.map;
  var scale = map.scale;



  map.weelscale = parseInt(Math.ceil(map.scale * 64.0));//wnd.slider.getValue();// Math.round(scale > 1.0 ? scale : (scale < 1.0 ? -1 / scale : 0.0 ));
  //console.log(map.weelscale);

  var step = Math.ceil(map.weelscale / 64);

  if (map.weelscale > 2048)
  {
    step = Math.ceil(map.weelscale / 2);
  }
  else if (map.weelscale > 1024)
  {
    step = Math.ceil(map.weelscale / 4);
  }
  else if (map.weelscale > 512)
  {
    step = Math.ceil(map.weelscale / 8);
  }
  else if (map.weelscale > 256)
  {
    step = Math.ceil(map.weelscale / 12);
  }
  else if (map.weelscale > 128)
  {
    step = Math.ceil(map.weelscale / 16);
  }
  else if (map.weelscale > 64)
  {
    step = Math.ceil(map.weelscale / 32);
  }
  else
  {
    step = Math.ceil(map.weelscale / 48);
  }
  //console.log(map.weelscale,step);
  if ( wheelData > 0 )
  {
    map.weelscale = map.weelscale + step;
  }
  else if ( wheelData < 0 )
  {
    map.weelscale = map.weelscale - step;
  }

  if (map.weelscale < 1 ) map.weelscale = 1;
  if (map.weelscale > 4096 ) map.weelscale = 4096;

  //console.log(wheelData,map.weelscale);

  wnd.slider.setValue(wnd.slider.scale_to_value(map.weelscale / 64.0));



  var scale = map.weelscale / 64.0;
  map.refresh(scale,map.cx,map.cy);

  return cancelEvent(e);
}

function SpaceMapCanvasB(wnd, canvas, filters, cx, cy,scale, bgimage, btn_back_id, btn_forward_id)
{

  if (typeof canvas === "string")
  {
    canvas = document.getElementById(canvas);
  }

  this.wnd = wnd;
  this.loaded = false;
  this.stack = new UndoStack();
  this.stack.enable();

  this.btn_forward_id = '#'+btn_forward_id;
  this.btn_back_id = '#'+btn_back_id;


  button_enable(this.btn_forward_id,false);
  button_enable(this.btn_back_id,false);

  this.rect = new Object();
  this.rect.active = false;
  this.rect_data = false;
  this.rect.top = this.rect.left = this.rect.width = this.rect.height = 0;

  this.touch_x = this.touch_y = 0;

  this.bgimage = new Image();
  this.bgimage.src = '/images/backgrounds/'+bgimage;

  this.icon_noob = new Image();
  this.icon_noob.src = '/images/icons/i_noob_32.png';

  this.icon_ts = new Image();
  this.icon_ts.src = '/images/icons/i_tradestation_2.png';


  this.icon_center = new Image();
  this.icon_center.src = '/images/icons/i-map-center-128.png';


  this.canvas = canvas.getContext('2d');

  if (!this.canvas)
  {
    getWindow('WndStarMapB').show('mode=1');
  }

  this.star_types = new Array();
  this.stars = new Array();

  this.ranges = new Array();
  this.traderanges = new Array();
  this.otherranges = new Array();
  this.vstars = new Array();
  this.valainces = new Array();
  this.fleets = new Array();
  this.vfleets = new Array();
  this.unloadQuadrants = new Array();

  this.runTimeQLoad = {
    map: this,
    time: Date.now(),
    loadCounter : 0,
    lastLoadIndex: 0,
    qcount:0,
    centerQuad: null,
    posMatrix: new Array(),
    list : new Array(),
    newLoad: function(center) {

      this.time = Date.now();
      this.loadCounter++;
      this.lastLoadIndex = 0;
      this.list = new Array();
      this.centerQuad = center;
    },
    calcMatrix: function(w, h) {

      this.posMatrix = Map.pos_matrix(w, h);

    },
    fillLoadList: function() {

      var part = this.lastLoadIndex == 0 ? 9 : 32;

      for (var lastIdx = this.lastLoadIndex; lastIdx < this.posMatrix.length; lastIdx++) {

        var pos = this.posMatrix[lastIdx];

        var lq = Map.pointToQuadrant(this.centerQuad.x + 64 * pos[0], this.centerQuad.y + 64 * pos[1]);

        var eq = this.map.getExistUnloadQuandrant(lq.x, lq.y);

        if (eq /*&& !eq.isLoad*/) {
          this.list.push(lq);
        }

        if (this.list.length >= part) {
          this.lastLoadIndex = lastIdx;
          break;
        }
      }

    },
    startProgress: function() {

      this.qcount = this.posMatrix.length;
      $('#maploadprogress').css('display','block');
      $('#maploadprogress_text')[0].innerText = '0%';

    },
    showProgress: function() {

      var p = Math.floor(this.lastLoadIndex * 100 / this.qcount);
      if (!isNaN(p)) {
        $('#maploadprogress_text')[0].innerText = p + '%';
      }

    },
    stopProgress: function() {

      this.qcount = 0;
      $('#maploadprogress').css('display','none');
      $('#maploadprogress_text')[0].innerText = '0%';

    }
  };

  this.owner = canvas;
  canvas.map = this;

  //this.stars = null;
  this.star_types = null;
  this.galaxies = null;

  this.idaliancemap = 0;



  this.contextMenuBind = $('#' + canvas.id).bind('contextmenu', contextMenuHandler);

  hookEvent(this.owner, 'mousewheel', mapcanvas_mouse_weelb);

  //filters

  this.flt_back = filters.flt_back;
  this.flt_stars = filters.flt_stars;
  this.flt_aliances = filters.flt_aliances;
  this.flt_grid = filters.flt_grid;
  this.flt_q_grid = filters.flt_q_grid;
  this.flt_fleets = filters.flt_fleets;

  setInterval(mapcanvas_fleets_timer,1000);

  this.reload_fleet = function(id)
  {
    ajaxGet('/?m=windows&w=WndStarMapB&a=reloadfleet&id='+id,function(resp){

      if (resp.RESULT == 'OK')
      {
        //console.log(resp);
        var spacemap = resp.wnd.map;
        var id = resp.id;
        spacemap.fleets[resp.id] = resp.fleet;
        if (resp.wnd.map.fleets[resp.id].isshow)
        {
          spacemap.fleets[id].img = new Image();
          spacemap.fleets[id].img.src = spacemap.fleets[id].imgfile;
          spacemap.fleets[id].img.onload =function()
          {
            getWindow('WndStarMapB').map.redraw();
          }
        }
        resp.wnd.map.redraw();
      }
    });
  }

  this.move = function(text)
  {
    getWindow('WndStarMapB').start_load();
    ajaxGet('/?m=windows&w=WndStarMapB&a=getpos&t='+text,function(resp){

//            console.log(resp);
      if (resp.RESULT == 'OK')
      {
        var map = resp.wnd.map;
        map.refresh(parseFloat(resp.scale),parseFloat(resp.cx),parseFloat(resp.cy));

        map.push_undo();
      }

      getWindow('WndStarMapB').end_load();
    });
  };


  this.owner[isIPad()?"ontouchend":"onmouseup"] = function(event)
  {
    e = prepare_event(event);




    var time = (new Date()).getTime() - this.map.mpresstime;

    if ( isIPad() ){

      this.map.touch_x = this.map.touch_y = 0;
      return true;
    }
    else if ( e.which === 1 && time > 200 && this.map.mpressbutton === 1)
    {
      /*
      if (this.map.udata)
      {
          this.map.push_undo();
          this.map.udata = null;
      }
      */
      this.map.push_undo();
      sound_click(1);
      this.style.cursor = 'default';
      ajaxGet('/?m=windows&w=WndStarMapB&a=setmap&cx='+this.map.cx+'&cy='+this.map.cy+'&scale='+this.map.scale,function(resp){});
    }
    else if (e.which === 3 && time >= 200 && this.map.mpressbutton == 3)
    {
      sound_click(1);
      if (this.map.rect.active && this.map.rect.width > 10 && this.map.rect.height > 10)
      {
        var wk = parseFloat(  parseFloat(this.map.owner.clientWidth) / parseFloat(this.map.rect.width) );
        var hk = parseFloat( parseFloat(this.map.owner.clientHeight) / parseFloat(this.map.rect.height) );

        var k = parseFloat(Math.min(wk,hk));



        var wcx = this.map.cx + (parseInt(this.map.rect.left) + (this.map.rect.width/2) - (this.map.owner.width/2)) / this.map.scale;
        var wcy = this.map.cy + (parseInt(this.map.rect.top) + (this.map.rect.height/2) - (this.map.owner.height/2)) / this.map.scale;

        if (parseInt(this.map.mpressX ) > parseInt(this.map.rect.left))
        {
          k = 1.0/k;
        }
        this.map.rect.active = false;
        this.map.rect_data = false;




        this.map.refresh(this.map.scale*k,wcx,wcy);
        this.map.push_undo();

        ajaxGet('/?m=windows&w=WndStarMapB&a=setmap&cx='+this.map.cx+'&cy='+this.map.cy+'&scale='+this.map.scale,function(resp){});
      }
      else
      {
        this.map.rect.active = false;
        this.map.rect_data = false;
        this.map.redraw();
      }



    }
    else if (e.which === 3 && time < 200 && this.map.mpressbutton == 3) {

      var mr = this.getBoundingClientRect();
      var e_clientX = parseInt(isIPad() ? e.targetTouches[0].clientX : e.clientX );
      var e_clientY = parseInt(isIPad() ? e.targetTouches[0].clientY : e.clientY );

      var clientX = e_clientX - mr.left;
      var clientY = e_clientY  - mr.top;

      var wcx = this.map.cx + (clientX - this.clientWidth /2 ) / this.map.scale;
      var wcy = this.map.cy + (clientY - this.clientHeight /2) / this.map.scale;
      var center_distance = (Math.sqrt(Math.pow(wcx - this.map.cx,2) +  Math.pow(wcy - this.map.cy,2)));

      this.map.pm_wcx = parseInt(wcx);
      this.map.pm_wcy = parseInt(wcy);
      this.map.pm_qcx = parseInt((Math.floor(wcx / 64) * 64  + 32));
      this.map.pm_qcy = parseInt((Math.floor(wcy / 64) * 64  + 32));
      this.map.pm_c_distance =  (Math.sqrt(Math.pow(wcx - this.map.cx,2) +  Math.pow(wcy - this.map.cy,2)));


      show_popup_menu(event,'WndStarMapB_rm_menu');
      document.getElementById('WndStarMapB_rm_menu_coord').innerHTML = '' + parseInt(wcx) + '-' + parseInt(wcy);
    }



    this.map.mpresstime = 0;
    return cancelEvent(event);
  };


  this.owner[isIPad()?"ontouchmove":"onmousemove"] = function(e)
  {
    e = prepare_event(e);

    var mr = this.getBoundingClientRect();
    var e_clientX = parseInt(isIPad() ? e.targetTouches[0].clientX : e.clientX );
    var e_clientY = parseInt(isIPad() ? e.targetTouches[0].clientY : e.clientY );

    var clientX = e_clientX - mr.left;
    var clientY = e_clientY  - mr.top;

    var wcx = this.map.cx + (clientX - this.clientWidth /2 ) / this.map.scale;
    var wcy = this.map.cy + (clientY - this.clientHeight /2) / this.map.scale;
    var center_distance = (Math.sqrt(Math.pow(wcx - this.map.cx,2) +  Math.pow(wcy - this.map.cy,2)));

    this.map.wcx = parseInt(wcx);
    this.map.wcy = parseInt(wcy);
    this.map.qcx = parseInt((Math.floor(wcx / 64) * 64  + 32));
    this.map.qcy = parseInt((Math.floor(wcy / 64) * 64  + 32));
    this.map.c_distance =  (Math.sqrt(Math.pow(wcx - this.map.cx,2) +  Math.pow(wcy - this.map.cy,2)));

    document.getElementById('WndStarMapB_mousexy').innerHTML = parseInt(wcx)+" - "+parseInt(wcy);
    document.getElementById('WndStarMapB_moused').innerHTML = center_distance.format(2);
    document.getElementById('WndStarMapB_quadrantp').innerHTML = (Math.floor(wcx / 64) * 64  + 32) +  " - " + ((Math.floor(wcy / 64) * 64  + 32));

    var time = (new Date()).getTime() - this.map.mpresstime;

    if (isIPad() ) {

      if (e.targetTouches.length > 1){

        var s_clientX = parseInt(e.targetTouches[1].clientX);
        var s_clientY = parseInt(e.targetTouches[1].clientY);

        if (this.map.touch_x === 0 && this.map.touch_y === 0){

          this.map.touch_x = s_clientX;
          this.map.touch_y = s_clientY;

        }
        else {

          var last_width = Math.abs(this.map.touch_x - this.map.mpressX);
          var last_height = Math.abs(this.map.touch_y - this.map.mpressY);
          this.map.touch_x = s_clientX;
          this.map.touch_y = s_clientY;
          this.map.lastX = this.map.mpressX = e_clientX;
          this.map.lastY = this.map.mpressY = e_clientY;
          var new_width = Math.abs(this.map.touch_x - this.map.mpressX);
          var new_height = Math.abs(this.map.touch_y - this.map.mpressY);
          //alert(new_width+','+last_width);
          if (Math.abs(last_width - new_width) >= 1 && Math.abs(last_height - new_height) >= 1  ){

            var kw = last_width / new_width;
            var kh = last_height / new_height;
            var kleft = parseInt(s_clientX);
            var ktop = parseInt(s_clientY);

            var k = 1 / Math.max(kw,kh) ;

            if (clientX < s_clientX)
            {
              kleft = parseInt(clientX);//  - parseInt(this.map.owner.style.left));
            }

            if (clientY < s_clientY)
            {
              ktop = parseInt(clientY);
            }

            var wcx = this.map.cx + (parseInt(kleft) + (new_width/2) - (this.map.owner.width/2)) / this.map.scale;
            var wcy = this.map.cy + (parseInt(ktop) + (new_height/2) - (this.map.owner.height/2)) / this.map.scale;

            this.map.refresh(this.map.scale*k,this.map.cx,this.map.cy);
          }

        }

        if (this.map.is_min_scale){
          return true;
        }


      }
      else {

        this.map.touch_x = this.map.touch_y = 0;

        var mr = this.getBoundingClientRect();
        var dx = -e_clientX + this.map.lastX;
        var dy = -e_clientY + this.map.lastY;

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0 )
        {
          //this.style.left = parseInt(this.style.left)+dx;
          //this.style.top = parseInt(this.style.top)+dy;

          this.map.lastX = e_clientX;
          this.map.lastY = e_clientY;

          var wcx = Math.round(this.map.cx + dx / this.map.scale);
          var wcy = Math.round(this.map.cy + dy / this.map.scale);

          if (wcx !== this.cx || wcy !== this.cy)
          {
            this.map.refresh(this.map.scale,wcx,wcy);
          }

        }


        var mr = this.getBoundingClientRect();
        var dx = -e_clientX + this.map.lastX;
        var dy = -e_clientY + this.map.lastY;

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0 )
        {
          //this.style.left = parseInt(this.style.left)+dx;
          //this.style.top = parseInt(this.style.top)+dy;

          this.map.lastX = e_clientX;
          this.map.lastY = e_clientY;

          var wcx = Math.round(this.map.cx + dx / this.map.scale);
          var wcy = Math.round(this.map.cy + dy / this.map.scale);

          if (wcx != this.cx || wcy != this.cy)
          {
            this.map.refresh(this.map.scale,wcx,wcy);
          }

        }
      }
    }
    else if (time > 200 && this.map.mpresstime !== 0)
    {
      if (this.map.mpressbutton === 1)
      {
        this.style.cursor = 'all-scroll';

        var mr = this.getBoundingClientRect();
        var dx = -e_clientX + this.map.lastX;
        var dy = -e_clientY + this.map.lastY;

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0 )
        {
          //this.style.left = parseInt(this.style.left)+dx;
          //this.style.top = parseInt(this.style.top)+dy;

          this.map.lastX = e_clientX;
          this.map.lastY = e_clientY;

          var wcx = Math.round(this.map.cx + dx / this.map.scale);
          var wcy = Math.round(this.map.cy + dy / this.map.scale);

          if (wcx != this.cx || wcy != this.cy)
          {

            this.map.refresh(this.map.scale,wcx,wcy);

          }

        }

      }
      else if (this.map.mpressbutton === 3)
      {

        this.map.rect.active = true;


        this.map.rect.width = parseInt(Math.abs(clientX - this.map.mpressX));
        this.map.rect.height = parseInt(Math.abs(clientY - this.map.mpressY));

        if (clientX < this.map.mpressX)
        {
          this.map.rect.left = parseInt(clientX);//  - parseInt(this.map.owner.style.left));
        }
        else
        {
          this.map.rect.left = parseInt(this.map.mpressX);//  - parseInt(this.map.owner.style.left));
        }

        if (clientY < this.map.mpressY)
        {
          this.map.rect.top = parseInt(clientY);// - parseInt(this.map.owner.style.top));
        }
        else
        {
          this.map.rect.top = parseInt(this.map.mpressY);// - parseInt(this.map.owner.style.top));
        }

//                console.log('start redraw');

//                console.log( this.map.rect.width, this.map.rect.height);
        //this.map.redraw();


        if (this.map.rect_data) {

          this.map.canvas.putImageData(this.map.rect_data,0,0);
        }
        else {

          this.map.rect_data = this.map.canvas.getImageData(0,0, this.clientWidth,this.clientHeight);
        }

        this.map.draw_select_rect();


        //console.log('end redraw');
      }
    }
    else
    {
      var idstar = this.map.isvstar(clientX,clientY);
      if (idstar !== 0)
      {
        this.style.cursor = 'pointer';
      }
      else
      {
        var idfleet = this.map.isvfleet(clientX,clientY);
        if (idfleet != 0)
        {
          this.style.cursor = 'pointer';
        }
        else
        {
          this.style.cursor = 'default';

          var idaliancemap = this.map.isvaliance(clientX,clientY);

          if (idaliancemap != this.map.idaliancemap)
          {
            this.map.idaliancemap  = idaliancemap;

            clearTimeout(this.map.timeout);
            this.map.timeout = setTimeout(
              (function(){this.map.showQuadrantInfo()}).bind(this)
              , 500);

            this.map.redraw(true);
          }
        }
      }
    }

    return cancelEvent(e);
  };


  this.showQuadrantInfo = function(){

    if (this.idaliancemap != 0)
    {
      getWindow('WndStarMapB').load_quadrant_info(this.idaliancemap);
    }
    else
    {
      getWindow('WndStarMapB').cancel_quadrant_info();
    }
  }

  this.owner.onmouseout = function(e)
  {
    if (this.map.rect.active)
    {
      this.map.rect.active = false;
      this.map.rect_data = false;
      this.map.redraw();
    }
  }

  this.isvstar = function(x,y)
  {
    for (var id in this.vstars)
    {
      var vs = this.vstars[id];
      if (x >= vs.l && x <= vs.r && y >= vs.t && y <= vs.b)
      {
        return id;
      }
    }

    return 0;
  }

  this.isvfleet = function(x,y)
  {
    for (var id in this.vfleets)
    {
      var vs = this.vfleets[id];
      if (x >= vs.l && x <= vs.r && y >= vs.t && y <= vs.b)
      {
        return id;
      }
    }

    return 0;
  }

  this.isvaliance = function(x,y)
  {
    for (var id in this.valiances)
    {
      var vs = this.valiances[id];
      if (x >= vs.l && x <= vs.r && y >= vs.t && y <= vs.b)
      {
        return id;
      }
    }

    return 0;
  }

  this.owner.onclick = function(e)
  {
    e = prepare_event(e);

    var mr = this.getBoundingClientRect();
    var clientX = e.clientX - mr.left;// - (mr.right-mr.left) / 2 ;
    var clientY = e.clientY  - mr.top;// + 32 - (mr.bottom - mr.top) /2;
    if (isIPad()){
      //alert('click');
    }

    if (e.which === 1)
    {
      var idstar = this.map.isvstar(clientX,clientY);
//            console.log(idstar);
      var idfleet = 0; //this.map.isvfleet(clientX,clientY);

      if (idstar == 0) {

        idfleet = this.map.isvfleet(clientX,clientY);
      }

      if (idstar !== 0 || idfleet!==0)
      {
        sound_click(1);
        getWindow('WndStarMapB').get('so','none','s='+idstar+'&f='+idfleet);//show('id='+idstar);
        return cancelEvent(e);
      }
      else
      {
        getWindow('WndStarMapB').win.bringToTop();
      }
    }

    return true;//cancelEvent(e);
  };

  this.owner[isIPad()?"ontouchstart":"onmousedown"] = function(e)
  {
    //console.log('onmousedown');
    e = prepare_event(e);

    var e_clientX = parseInt(isIPad()  ? e.targetTouches[0].clientX : e.clientX );
    var e_clientY = parseInt(isIPad() ? e.targetTouches[0].clientY : e.clientY );

    var mr = this.getBoundingClientRect();

    var clientX = e_clientX - mr.left;// - (mr.right-mr.left) / 2 ;
    var clientY = e_clientY  - mr.top;// + 32 - (mr.bottom - mr.top) /2;

    if (isIPad()){
      // alert(parseInt(e_clientX)+" - "+parseInt(e_clientY));
      this.map.udata = new Object();
      this.map.udata.cx = this.map.cx;
      this.map.udata.cy = this.map.cy;
      this.map.udata.scale = this.map.scale;
      this.map.mpresstime = (new Date()).getTime();
      this.map.lastX = this.map.mpressX = e_clientX;
      this.map.lastY = this.map.mpressY = e_clientY;
      this.map.touch_x = this.map.touch_y = 0;

      return true;
    }
    else  if (e.which === 1 )
    {
      this.map.udata = new Object();
      this.map.udata.cx = this.map.cx;
      this.map.udata.cy = this.map.cy;
      this.map.udata.scale = this.map.scale;

      this.map.mpressbutton = 1;
      this.map.mpresstime = (new Date()).getTime();
      this.map.lastX = this.map.mpressX = e_clientX;
      this.map.lastY = this.map.mpressY = e_clientY;
    }
    else if (e.which === 3)
    {
      sound_click(1);
      this.map.mpressbutton = 3;
      this.map.mpresstime = (new Date()).getTime();
      this.map.mpressX = clientX;
      this.map.mpressY = clientY;
    }


    return cancelEvent(e);

  };

  this.apply_filters = function (form)
  {
    if (typeof form === "string")
    {
      form = document.getElementById(form);
    }
    this.flt_back = form.flt_back.checked;
    this.flt_stars = form.flt_stars.checked;
    this.flt_aliances = form.flt_aliances.checked;
    this.flt_grid = form.flt_grid.checked;
    this.flt_q_grid = form.flt_q_grid.checked;
    this.flt_fleets = form.flt_fleets.checked;

    this.redraw();
  }

  this.reload = function()
  {
    var _self = this;

    getWindow('WndStarMapB').maploading.style.display = 'flex';
    this.loaded = false;
    this.redraw();

    var qcenter = Map.pointToQuadrant(this.cx,this.cy);

    var durl = '/?m=windows&w=WndStarMapB&a=gmdata';

    ajaxGet(durl, function(resp){
      var spacemap = resp.wnd.map;
      spacemap.stars = resp.stars;
      spacemap.CLR_ALLIANCE = resp.CLR_ALLIANCE;
      spacemap.CLR_SELF = resp.CLR_SELF;
      spacemap.CLR_FLEET = resp.CLR_FLEET;
      spacemap.CLR_FEDERATION = resp.CLR_FEDERATION;
      spacemap.CLR_BORG = resp.CLR_BORG;
      spacemap.ranges = resp.mapranges;
      spacemap.anomalies = resp.anomalies;
      spacemap.alliances = resp.alliances;

      for (var part in resp.qs) {
        for (var x in resp.qs[part]) {
          for (var y in resp.qs[part][x]) {
            var q = Map.pointToQuadrant(x, y);
            _self.unloadQuadrants.push(q);
          }
        }
      }

      var imgStarLoad = false;
      var imgGalaxyLoad = false;
      var imgFleetLoad = false;

      if (!spacemap.star_types) {
        spacemap.star_types = resp.star_types;
        for (var id in spacemap.star_types) {
          spacemap.star_types[id].img = new Array();
          for (var i in spacemap.star_types[id].imgs) {
            spacemap.star_types[id].img[i] = new Image();
            spacemap.star_types[id].img[i].src = spacemap.star_types[id].imgs[i];
            spacemap.star_types[id].img[i].onload = function (map) {
              if (!imgStarLoad) {
                getWindow('WndStarMapB').map.redraw();
                imgStarLoad = true;
                //_self.loadQuadrants(qcenter);
              }
            }
          }
        }
      }

      if (!spacemap.galaxies) {


        spacemap.galaxies = resp.galaxies;

        for (var id in spacemap.galaxies) {

          spacemap.galaxies[id].img = new Image();
          spacemap.galaxies[id].img.src = spacemap.galaxies[id].bgimage;

          if (!imgGalaxyLoad) {
            getWindow('WndStarMapB').map.redraw();
            imgGalaxyLoad = true;
          }
        }
      }

      for (var id in spacemap.fleets) {
        spacemap.fleets[id].img = new Image();
        spacemap.fleets[id].img.src = spacemap.fleets[id].imgfile;
        spacemap.fleets[id].img.onload = function () {
          if (!imgFleetLoad) {
            getWindow('WndStarMapB').map.redraw();
            imgFleetLoad = true;
          }
        }

      }

      spacemap.loaded = true;
      if (spacemap.onload)
      {
        spacemap.onload();
      }
      spacemap.redraw();
      getWindow('WndStarMapB').maploading.style.display = 'none';


    });


  }

  this.load_and_draw = function() {

    var _self = this;

    _self.draw_stars();
    _self.draw_center();

    if (this.scale < 0.1)
      return;

    clearTimeout(this.quadLoadTimeout);
    _self.quadLoadTimeout = setTimeout(
      function() {
        _self.doLoadQuadrants();
      }
      , 1500);

  }

  this.doLoadQuadrants = function() {

    var _self = this;

    if (!_self.runTimeQLoad.time || Date.now() - _self.runTimeQLoad.time > 2000) {

      var qcenter = Map.pointToQuadrant(_self.cx, _self.cy);

      _self.runTimeQLoad.newLoad(qcenter);

      _self.loadQuadrants(qcenter);
    }

  }

  this.loadQuadrants = function(qcenter) {

    var _self = this;

    var eqc = _self.getExistUnloadQuandrant(qcenter.x, qcenter.y);
    if (eqc) {
      if (!eqc.isLoad) {
        _self.runTimeQLoad.list.push(qcenter);
      }
    }

    var range = Math.round(64 * this.scale);
    var qc_w = Math.ceil(this.owner.clientWidth/range) + 1;
    var qc_h = Math.ceil(this.owner.clientHeight/range) + 1;

    _self.runTimeQLoad.calcMatrix(qc_w, qc_h);

    _self.runTimeQLoad.startProgress();

    _self.loadQuadrantData(_self.runTimeQLoad.loadCounter);

  }

  this.loadQuadrantData = function(lnum) {

    var _self = this;
    var loadList = _self.runTimeQLoad.list;

    if (_self.runTimeQLoad.loadCounter == lnum) {

      _self.runTimeQLoad.fillLoadList();

      if (!loadList || loadList.length == 0) {
        _self.runTimeQLoad.stopProgress();
        return;
      }

      var durl = '/?m=windows&w=WndStarMapB&a=qdata';


      for (var i=0; i < loadList.length; ++i) {
        if (loadList[i]) {
          durl += '&qs[]=' + loadList[i].x + '-' + loadList[i].y;
        }
      }

      ajaxGet(durl, function(resp) {

        // console.log(resp.quandrants);

        for (var q in resp.quandrants.qs) {

          var rqx = resp.quandrants.qs[q].x;
          var rqy = resp.quandrants.qs[q].y;

          var quad = _self.getExistUnloadQuandrant(rqx, rqy);
          if (quad) {

            _self.eraseExistUnloadQuandrant(quad.x, quad.y);
          }

          for (var i in loadList) {

            var lq = loadList[i];
            if (lq.x == rqx && lq.y == rqy) {
              loadList.splice(i, 1);
              continue;
            }
          }


          for (var prop in resp.quandrants.stars) {
            if (!_self.stars.hasOwnProperty(prop)) {
              _self.stars[prop] = resp.quandrants.stars[prop];
            }
          }


          for (var prop in resp.quandrants.anomalies) {

            if (!_self.anomalies.hasOwnProperty(prop)) {
              _self.anomalies[prop] = resp.quandrants.anomalies[prop];
            }

          }

          var imgFleetLoad = false;
          for (var prop in resp.quandrants.fleets) {
            if (!_self.fleets.hasOwnProperty(prop)) {
              _self.fleets[prop] = resp.quandrants.fleets[prop];
              var fleet = _self.fleets[prop];
              fleet.img = new Image();
              fleet.img.src = fleet.imgfile;
              fleet.img.onload = function () {
                if (!imgFleetLoad) {
                  _self.draw_fleets();
                  imgFleetLoad = true;
                }
              }
            }
          }

        }

        _self.runTimeQLoad.showProgress();

        _self.loadQuadrantData(lnum);

        _self.draw_stars();

        _self.draw_center();
      });

    }

  }

  this.getExistUnloadQuandrant = function(x, y) {
    var _self = this;

    for (iq in _self.unloadQuadrants) {
      if (_self.unloadQuadrants[iq].x == x && _self.unloadQuadrants[iq].y == y) {
        return _self.unloadQuadrants[iq];
      }
    }

    return null;
  },

    this.eraseExistUnloadQuandrant = function(x, y) {
      var _self = this;

      for (iq in _self.unloadQuadrants) {
        if (_self.unloadQuadrants[iq].x == x && _self.unloadQuadrants[iq].y == y) {
          _self.unloadQuadrants.splice(iq, 1);
          return;
        }
      }

      return;
    },

    this.quandrantInRange = function(q) {
      var _self = this;

      for (var i in _self.ranges) {
        var range = _self.ranges[i];
        var circle = Math.pow(range.r, 2);
        if (
          (Math.pow(range.x - q.x - 32, 2) + Math.pow(range.y - q.y + 32, 2)) <= circle ||
          (Math.pow(range.x - q.x + 32, 2) + Math.pow(range.y - q.y + 32, 2)) <= circle ||
          (Math.pow(range.x - q.x - 32, 2) + Math.pow(range.y - q.y - 32, 2)) <= circle ||
          (Math.pow(range.x - q.x + 32, 2) + Math.pow(range.y - q.y - 32, 2)) <= circle) {
          return true;
        }
      }

      return false;
    },

    this.forward = function()
    {
      if (this.stack.can_forward())
      {
        var data = this.stack.forward();
        if (data)
        {
          this.load(data.scale,data.cx,data.cy);
        }
      }
      button_enable(this.btn_back_id,this.stack.can_back());
      button_enable(this.btn_forward_id,this.stack.can_forward());

    }

  this.back = function()
  {
    //console.log(this.stack);
    if (this.stack.can_back())
    {
      var data = this.stack.back();
//            console.log(this.stack);
      if (data)
      {
        //this.stack.push( {"cx" : this.cx, "cy" : this.cy, "scale" : this.scale});

        this.refresh(data.scale,data.cx,data.cy);
      }
    }


    button_enable(this.btn_back_id,this.stack.can_back());
    button_enable(this.btn_forward_id,this.stack.can_forward());
  }

  this.push_undo = function() {

    this.stack.push( {"cx" : this.cx, "cy" : this.cy, "scale" : this.scale});
    button_enable(this.btn_forward_id,this.stack.can_forward());
    button_enable(this.btn_back_id,this.stack.can_back());
  }

  this.forward = function()
  {
    // (this.stack);
    if (this.stack.can_forward())
    {

      var data = this.stack.forward();

      if (data)
      {
//                this.stack.push( {"cx" : this.cx, "cy" : this.cy, "scale" : this.scale});

        this.refresh(data.scale,data.cx,data.cy);
      }
    }

    button_enable(this.btn_forward_id,this.stack.can_forward());
  }

  this.draw_ranges = function()
  {
    if (this.scale < 0.1 || !this.flt_stars) return;

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;
    /*
            var dashList = [2, 5];
            var dashList = [1];

            if (this.canvas.setLineDash)
            {
                this.canvas.setLineDash(dashList);
            }
    */

    for (var id in this.ranges)
    {
      var range = this.ranges[id];
      var x = Math.round( (range.x - this.cx) * this.scale + (win_w / 2));
      var y = Math.round( (range.y - this.cy) * this.scale + (win_h / 2));
      var r = Math.round( range.r * this.scale);
      var tr = Math.round( range.tr * this.scale);
      var ssr = Math.round( range.ssr * this.scale);
      var ar = Math.round( range.ar * this.scale);
      var hdr = Math.round( range.hdr * this.scale);

      if (r > 5)
      {
        this.canvas.strokeStyle ='#080';
        this.canvas.lineWidth = 0.5;
        this.canvas.beginPath();
        this.canvas.arc(x,y,r,0,2*Math.PI,true);
        this.canvas.stroke();
      }

      if (tr > 5)
      {
        this.canvas.strokeStyle ='#f7b03a';
        this.canvas.lineWidth = 0.5;
        this.canvas.beginPath();
        this.canvas.arc(x,y,tr,0,2*Math.PI,true);
        this.canvas.stroke();
      }

      if (ssr > 5)
      {
        this.canvas.strokeStyle ='#f02a0f';
        this.canvas.lineWidth = 0.5;
        this.canvas.beginPath();
        this.canvas.arc(x,y,ssr,0,2*Math.PI,true);
        this.canvas.stroke();
      }

      if (ar > 5)
      {
        this.canvas.strokeStyle ='#fbc3b2';
        this.canvas.lineWidth = 0.5;
        this.canvas.beginPath();
        this.canvas.arc(x,y,ar,0,2*Math.PI,true);
        this.canvas.stroke();
      }

      if (hdr > 5)
      {
        this.canvas.strokeStyle ='#00FFFF';
        this.canvas.lineWidth = 0.5;
        this.canvas.beginPath();
        this.canvas.arc(x,y, hdr,0, 2 * Math.PI, true);
        this.canvas.stroke();
      }

    }
    /*
    this.canvas.strokeStyle = '#'+this.CLR_ALLIANCE;
    for (var id in this.otherranges)
    {
        for (var irange in this.otherranges[id])
        {
            var range = this.otherranges[id][irange];//[0]
            var x = Math.round( (range.x - this.cx) * this.scale + (win_w / 2));
            var y = Math.round( (range.y - this.cy) * this.scale + (win_h / 2));
            var r = Math.round( range.r * this.scale);

            if (r > 5)
            {
                this.canvas.lineWidth = 0.5;
                this.canvas.beginPath();
                this.canvas.arc(x,y,r,0,2*Math.PI,true);
                this.canvas.stroke();
            }
        }
    }
    */

    this.canvas.strokeStyle ='#f7b03a';
    for (var id in this.traderanges)
    {
      //console(id);
      for (var irange in this.traderanges[id])
      {
        var range = this.traderanges[id][irange]
        var x = Math.round( (range.x - this.cx) * this.scale + (win_w / 2));
        var y = Math.round( (range.y - this.cy) * this.scale + (win_h / 2));
        var r = Math.round( range.r * this.scale);
        if (r > 5)
        {
          this.canvas.lineWidth = 0.5;
          this.canvas.beginPath();
          this.canvas.arc(x,y,r,0,2*Math.PI,true);
          this.canvas.stroke();
        }
      }
    }

  }

  this.draw_anomalies = function()
  {
    if (this.scale < 1) return;

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    if (this.canvas.setLineDash)
    {
      this.canvas.setLineDash([]);
    }

    this.canvas.strokeStyle ='#bea4ff';


    //console.log(this.anomalies);

    for (var id in this.anomalies)
    {
      var range = this.anomalies[id]
      var x = Math.round( (range.x - this.cx) * this.scale + (win_w / 2));
      var y = Math.round( (range.y - this.cy) * this.scale + (win_h / 2));
      var r = Math.round( range.r * this.scale);

      if ( range.isbh ) {

        this.canvas.lineWidth = 3.0;
        this.canvas.strokeStyle ='#2f2940';
        this.canvas.beginPath();
        this.canvas.arc(x,y,r,0,2*Math.PI,true);
        this.canvas.stroke();
      }
      this.canvas.strokeStyle ='#bea4ff';
      this.canvas.lineWidth = range.isbh ? 1.5 : 0.5;
      this.canvas.beginPath();
      this.canvas.arc(x,y,r,0,2*Math.PI,true);
      this.canvas.stroke();

    }

  }

  this.draw_center = function()
  {
//        if (this.scale < 1) return;

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;
    var i_center_size = Math.min(128,Math.max(16,Math.round(this.scale * 6)));
    var i_center_cross_size = Math.max(4,Math.min(16,Math.round(i_center_size / 8)));
    var i_center_cross_size = Math.max(4,Math.min(16,Math.round(i_center_size / 8)));

    var cx = Math.round( (win_w / 2));
    var cy = Math.round( (win_h / 2));



    if (this.canvas.setLineDash)
    {
      this.canvas.setLineDash([]);
    }

    this.canvas.fillStyle = "rgba(0,0,0,0.5)";
    this.canvas.fillRect(cx - 2, cy - ( i_center_cross_size + 1 ), 4, 2 * i_center_cross_size + 2 );
    this.canvas.fillRect(cx  - ( i_center_cross_size + 1 ), cy - 2,  2 * i_center_cross_size + 2, 4 );


    this.canvas.strokeStyle = "#59ecff";
    this.canvas.lineWidth = 1.5;

    this.canvas.beginPath();
    this.canvas.moveTo(cx,cy-i_center_cross_size );
    this.canvas.lineTo(cx,cy+i_center_cross_size);
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx-i_center_cross_size,cy);
    this.canvas.lineTo(cx+i_center_cross_size,cy);
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx - i_center_size / 2 ,cy - i_center_size /2);
    this.canvas.lineTo(cx - i_center_size / 4, cy - i_center_size /2 );
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx - i_center_size / 2 ,cy + i_center_size /2);
    this.canvas.lineTo(cx - i_center_size / 4, cy + i_center_size /2 );
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx + i_center_size / 2 ,cy - i_center_size /2);
    this.canvas.lineTo(cx + i_center_size / 4, cy - i_center_size /2 );
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx + i_center_size / 2 ,cy + i_center_size /2);
    this.canvas.lineTo(cx +  i_center_size / 4, cy + i_center_size /2 );
    this.canvas.stroke();


    this.canvas.beginPath();
    this.canvas.moveTo(cx - i_center_size / 2 ,cy - i_center_size / 2 );
    this.canvas.lineTo(cx - i_center_size / 2, cy - i_center_size / 4 );
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx + i_center_size / 2 ,cy - i_center_size / 2 );
    this.canvas.lineTo(cx + i_center_size / 2, cy - i_center_size / 4 );
    this.canvas.stroke();


    this.canvas.beginPath();
    this.canvas.moveTo(cx - i_center_size / 2 ,cy + i_center_size / 2 );
    this.canvas.lineTo(cx - i_center_size / 2, cy + i_center_size / 4 );
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.moveTo(cx + i_center_size / 2 ,cy + i_center_size / 2 );
    this.canvas.lineTo(cx + i_center_size / 2, cy + i_center_size / 4 );
    this.canvas.stroke();
//        this.msImageSmoothingEnabled = true;

//        this.canvas.drawImage(this.icon_center, x, y, i_center_size, i_center_size);

  }


  this.redraw = function(diableLoad)
  {

    this.draw_background();

    if (!this.loaded)
    {
      this.draw_grid();
      this.draw_loading();
    }
    else
    {
      this.draw_alliances();
      this.draw_grid();
      this.draw_ranges();
      this.draw_anomalies();

      if (diableLoad)
        this.draw_stars();
      else
        this.load_and_draw();

      this.draw_fleets();

      this.draw_center();
    }

    this.draw_select_rect();
  }

  this.draw_fleets = function()
  {
    this.vfleets = new Array();

    if (!this.flt_fleets) return;
    if (this.scale < 1.0) return;

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;


    this.sw = 16;

    for (var id in this.fleets)
    {
      var fleet = this.fleets[id];

      if (!fleet.isshow) continue;

      var sx = Math.round( (fleet.x - this.cx) * this.scale + (win_w / 2));
      var sy = Math.round( (fleet.y - this.cy) * this.scale + (win_h / 2));
      var sw = this.sw;
      var fs = 12;


      if (fleet.nx != fleet.px || fleet.py != fleet.ny)
      {
        var snx = Math.round( (fleet.nx - this.cx) * this.scale + (win_w / 2));
        var sny = Math.round( (fleet.ny - this.cy) * this.scale + (win_h / 2));
        var spx = Math.round( (fleet.px - this.cx) * this.scale + (win_w / 2));
        var spy = Math.round( (fleet.py - this.cy) * this.scale + (win_h / 2));

        if (this.canvas.setLineDash)
        {
          this.canvas.setLineDash([2,2]);
        }


        this.canvas.strokeStyle = "#"+fleet.stateclr;
        this.canvas.beginPath();
        this.canvas.moveTo(spx,spy);
        this.canvas.lineTo(snx,sny);
        this.canvas.stroke();
      }

      if (this.scale < 2)
      {
        continue;
      }

      if ( (sx + sw < 0) || (sy + sw < 0) || (sy - sw > win_h) || (sx - sw > win_w))
      {
        continue;
      }

      this.msImageSmoothingEnabled = true;

      this.canvas.drawImage(fleet.img,sx - sw / 2,sy - sw / 2, sw, sw);

      this.vfleets[id] = new Object();

      this.vfleets[id].l = sx -  sw / 2;
      this.vfleets[id].t = sy -  sw / 2;
      this.vfleets[id].r = sx +  sw / 2;
      this.vfleets[id].b = sy +  sw / 2;

      this.canvas.font = 'normal 11px Tahoma';
      this.canvas.fillStyle = "#"+this.CLR_FLEET;
      this.canvas.textBaseline = 'top';
      this.canvas.textAlign = "center";
      this.canvas.fillText(fleet.name ,sx, sy + sw / 2 + 1);
      this.canvas.font = 'normal 10px Tahoma';
      this.canvas.fillStyle = "#"+fleet.stateclr;
      this.canvas.fillText(fleet.state ,sx, sy + sw / 2 + 13);

    }
  }

  this.draw_stars = function()
  {
    this.vstars = new Array();

    if (!this.flt_stars) return;

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    var map_l = Math.round(this.cx - (win_w / 2 ) / this.scale);
    var map_t = Math.round(this.cy - (win_h / 2 ) / this.scale);
    var map_r = map_l + Math.round(win_w / this.scale);
    var map_b = map_t + Math.round(win_h / this.scale);

    this.canvas.lineWidth = 1;
    this.canvas.setLineDash([]);

    if (this.canvas.setLineDash)
    {
      this.canvas.setLineDash([]);
    }

    this.sw = Math.round(this.scale * 2);

    for (var id in this.stars)
    {

      var star = this.stars[id];
      var isbh = this.stars[id].isbh;
      var isnbl = this.stars[id].isnbl;
      var issps = this.stars[id].issps;

      var sx = Math.round( (star.x - this.cx) * this.scale + (win_w / 2));
      var sy = Math.round( (star.y - this.cy) * this.scale + (win_h / 2));
      var sw = this.sw;
      var fs = 12;

      if ( ((sx + sw < 0) || (sy + sw < 0) || (sy - sw > win_h) || (sx - sw > win_w)) && (!isbh || !isnbl || !issps))
      {
        continue;
      }

      var si = Math.round(this.scale / 2) - 1;
      var isbh = this.stars[id].isbh;
      var isnbl = this.stars[id].isnbl;
      var nblr = this.stars[id].nblr;
      var nblru = this.stars[id].nblru;

      if (si < 0) si = 0;
      if (si > 7) si = 7;

      if (isbh)
      {
        sw *= 4;
        if (sw < 16)
        {
          sw = 16;
        }
        else if (sw >128)
        {
          sw = 128;
        }
      }

      if (isnbl) {
        sw *= 3;
        if (sw < 8) {
          sw = 8;
        }
        else if (sw > 96) {
          sw = 96;
        }
      }

      if (this.scale > 2 || isbh || isnbl || issps )
      {
        this.vstars[id] = new Object();

        this.vstars[id].l = sx -  sw / 2;
        this.vstars[id].t = sy -  sw / 2;
        this.vstars[id].r = sx +  sw / 2;
        this.vstars[id].b = sy +  sw / 2;

        if (typeof this.star_types[star.typeid].img[si] == 'object')
        {
          this.msImageSmoothingEnabled = true;

          //console.log(this.star_types[star.typeid].img[si]);
          this.canvas.drawImage(this.star_types[star.typeid].img[si],sx - sw / 2,sy - sw / 2, sw, sw);

          console.log(nblru);

          if (isnbl || isbh){
            //console.log(this.star_types[star.typeid].clr);
            //console.log(nblr);
            this.canvas.strokeStyle ='#'+this.star_types[star.typeid].clr;
            this.canvas.lineWidth = 1.5;
            this.canvas.beginPath();
            this.canvas.arc(sx,sy,Math.round(nblr * this.scale),0,2*Math.PI,true);
            this.canvas.stroke();
          }

          if (nblru > 0 ) {

            this.canvas.strokeStyle ='#'+this.star_types[star.typeid].clr;
            this.canvas.lineWidth = 0.75;
            this.canvas.beginPath();
            this.canvas.arc(sx,sy,Math.round(nblru * this.scale),0,2*Math.PI,true);
            this.canvas.stroke();

          }
        }

        if (star.isgg)
        {
          if (star.isgga)
          {
            this.canvas.strokeStyle = "#00f";
          }
          else
          {
            this.canvas.strokeStyle = "#f00";
          }

          this.canvas.strokeRect(sx - sw / 2,sy - sw / 2, sw, sw);
        }

        if (this.scale > 2) {

          var start_x = sx - sw / 2;
          var start_y = sy - sw / 2 - sw / 4 - 2;
          var iw = sw / 4;


          if (star.isnb)
          {
            if (iw <= 2) {
              this.canvas.fillStyle = "#ffd52b";
              this.canvas.fillRect(start_x ,start_y , iw, iw);
              start_x = start_x + iw + 1;
            }
            else {

              this.canvas.drawImage(this.icon_noob,start_x, start_y, iw, iw);

            }

            start_x = start_x + iw + 1;
          }

          if (star.ists)
          {
            if (iw <= 2) {
              this.canvas.fillStyle = "#d19956";
              this.canvas.fillRect(start_x ,start_y , iw, iw);
            }
            else {

              this.canvas.drawImage(this.icon_ts,start_x, start_y, iw, iw);

            }

            start_x = start_x + iw + 1;
          }


        }

        if (this.scale > 3 || isbh || isnbl || issps)
        {

          if (isbh)
          {
            this.canvas.font = 'bold 12px Tahoma';
            this.canvas.fillStyle = '#'+this.star_types[star.typeid].clr;
          } else if (isnbl || issps) {
            this.canvas.font = 'bold 10px Tahoma';
            this.canvas.fillStyle = '#' + this.star_types[star.typeid].clr;
          }
          else
          {

            this.canvas.font = 'normal '+( fs - (7-si))+'px Tahoma';
            if (star.isself)
            {
              this.canvas.fillStyle = '#'+this.CLR_SELF;
            }
            else if (star.isal)
            {
              this.canvas.fillStyle = '#'+this.CLR_ALLIANCE;
            }
            else if (star.isborg)
            {
              this.canvas.fillStyle = '#'+this.CLR_BORG;
            }
            else if (star.isfed)
            {
              this.canvas.fillStyle = '#'+this.CLR_FEDERATION;
            }
            else
            {
              this.canvas.fillStyle = '#d0d0d0';
            }

          }

          this.canvas.textBaseline = 'top';
          this.canvas.textAlign = "center";

          this.canvas.fillText(star.name ,sx, sy + sw / 2 + 1);

        }
      }
      else if (this.scale > 1)
      {

        this.canvas.fillStyle = "#"+ this.star_types[star.typeid].clr;
        this.canvas.fillRect(sx - 1 ,sy - 1 , 2, 2);
      }
      else if (this.scale > 0.1)
      {
        this.canvas.fillStyle = "#"+ this.star_types[star.typeid].clr;
        this.canvas.fillRect(sx - sw / 2 ,sy - sw / 2 , 1, 1);
      }
    }

    //console.log(this.vstars);
  }

  //Для совместимости со старой картой
  this.load = function(scale, cx, cy)
  {
    this.refresh(scale, cx, cy)
  }

  this.refresh = function(scale, cx, cy)
  {
    if (scale > 64) scale = 64;

    var wscale = scale;
    var hscale = scale;
    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    this.is_min_scale = false;



    if (scale <= 0 || win_w / scale > 65536)
    {
      wscale = win_w / 65536 ;
      this.is_min_scale = true;
    }

    if (scale <= 0 || win_h  / scale > 65536)
    {
      hscale = win_h / 65536 ;
      this.is_min_scale = true;
    }

    this.scale = Math.max(wscale,hscale);

    if ( ( win_w / 2 ) / this.scale + cx > 65536)
    {
      cx = 65536 - ( win_w / 2 ) / this.scale;
    }

    if ( cx - (win_w / 2 ) / this.scale  < 0)
    {
      cx =  (win_w / 2 ) / this.scale;
    }

    if ( (win_h / 2 ) / this.scale + cy > 65536 )
    {
      cy = 65536 - (win_h / 2 ) / this.scale;
    }

    if ( cy - (win_h / 2 ) / this.scale  < 0 )
    {
      cy =  (win_h / 2 ) / this.scale;
    }

    this.cx =  Math.round(cx);
    this.cy = Math.round(cy);


    this.redraw();

    if (this.onload)
    {
      this.onload();
    }
  }

  this.draw_select_rect = function()
  {
    //return;
    if (this.rect.active)
    {
      /*
      if (this.canvas.setLineDash)
      {
          this.canvas.setLineDash([12,3,3,3]);
      }
      */

      this.canvas.lineWidth = 1;
      this.canvas.strokeStyle='#0FF';
      this.canvas.strokeRect(this.rect.left,this.rect.top,this.rect.width,this.rect.height);

      this.canvas.beginPath();

      this.canvas.moveTo(this.rect.left + Math.floor(this.rect.width / 2)+0.5 , this.rect.top + this.rect.height / 2 - 5 );
      this.canvas.lineTo(this.rect.left + Math.floor(this.rect.width / 2)+0.5 , this.rect.top + this.rect.height / 2 + 5 );

      this.canvas.moveTo(this.rect.left + this.rect.width / 2 - 5 , this.rect.top + Math.floor(this.rect.height / 2 ));
      this.canvas.lineTo(this.rect.left + this.rect.width / 2 + 5 , this.rect.top + Math.floor(this.rect.height / 2 ));

      this.canvas.stroke();
    }
  }

  this.draw_grid = function()
  {
    if (this.flt_grid) {

      /*
      if ( Math.round(64 * this.scale) >= 16 )  {

          this.draw_q_grid();
          return;
      }*/

//        if ( Math.round(64 * this.scale) < 16 || Math.round(64 * this.scale) >= 64) {

      var win_w = this.owner.clientWidth;
      var win_h = this.owner.clientHeight;

      var g_x = (win_w / 2 ) - Math.round(win_w / 2 / 64.0) * 64;
      var g_y = (win_h / 2 ) - Math.round(win_h / 2 / 64.0) * 64;



      if (this.canvas.setLineDash)
      {
        this.canvas.setLineDash([]);
      }
      this.canvas.lineWidth = 0.5;
      this.canvas.strokeStyle = 'rgba(44,211,237,0.2)';

      this.canvas.beginPath();

      for (var ix = g_x; ix < win_w; ix += 64)
      {
        this.canvas.moveTo(ix+0.5,0);
        this.canvas.lineTo(ix+0.5,win_h);
      }

      for (var iy = g_y; iy < win_h; iy += 64)
      {
        this.canvas.moveTo(0,iy+0.5);
        this.canvas.lineTo(win_w,iy+0.5);
      }
      this.canvas.stroke();
//        }

    }


    if ( Math.round(64 * this.scale) >= 16 )  {

      this.draw_q_grid();
    }

  }

  this.draw_q_grid = function()
  {
    if (!this.flt_q_grid) return;



    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;


    var map_l = this.cx - (win_w / 2 ) / this.scale;
    var map_t =this.cy - (win_h / 2 ) / this.scale;
    var map_r = this.cx + (win_w / 2 ) / this.scale;
    var map_b = this.cy + (win_h / 2 ) / this.scale;



    var map_g_x = Math.floor(map_l / 64.0) * 64.0;
    var map_g_y = Math.floor(map_t / 64.0) * 64.0;

    if (this.canvas.setLineDash)
    {
      this.canvas.setLineDash([]);
    }


    this.canvas.lineWidth = 1.0;
    this.canvas.strokeStyle = 'rgba(241,203,49,0.15)';

//        console.log(map_g_x,map_r);

    this.canvas.beginPath();

    for (var ix = map_g_x; ix < map_r; ix += 64)
    {

      var gx  = Math.round( ( ix - map_l)  * this.scale);
      this.canvas.moveTo( gx + 0.5, 0);
      this.canvas.lineTo( gx  + 0.5, win_h);
    }

    for (var iy = map_g_y; iy < map_b; iy += 64)
    {

      var gy  = Math.round( ( iy - map_t)  * this.scale);
      this.canvas.moveTo( 0, gy + 0.5);
      this.canvas.lineTo( win_w, gy  + 0.5);
    }

    this.canvas.stroke();
  }

  this.draw_alliances = function()
  {
    this.valiances = new Array();

    if (!this.flt_aliances) return;

    if (this.scale < 0.1) return;


    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    var map_x = this.cx - (win_w / 2 ) / this.scale;
    var map_y = this.cy - (win_h / 2 ) / this.scale;
    var map_w = this.win_w / this.scale;
    var map_h = this.win_h / this.scale;

    if (this.canvas.setLineDash)
    {
      this.canvas.setLineDash([]);
    }

//        this.canvas.strokeStyle = '#202020';

//        this.canvas.beginPath();

    for (var id in this.alliances)
    {
      var aliance = this.alliances[id];

      var x = Math.round((aliance.x - map_x) * this.scale);
      var y = Math.round((aliance.y - map_y) * this.scale);
      var range = Math.round(64 * this.scale);
      if (range >= 16)
      {
        var a = 0.15;

        if (id == this.idaliancemap)
        {
          a = 0.25;
        }

        this.canvas.fillStyle = HTMLtoRGBA('#'+aliance.clr,a);
        this.canvas.fillRect(x,y,Math.round(range),Math.round(range));

        if (aliance.isnb) {

          var iw = Math.round(8 * this.scale);
          this.canvas.drawImage(this.icon_noob,x,y, iw, iw);
        }
        this.valiances[id] = new Object();

        this.valiances[id].l = x;
        this.valiances[id].t = y;
        this.valiances[id].r = x + range;
        this.valiances[id].b = y + range;
      }
    }
  }

  this.draw_background = function()
  {


    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    this.canvas.fillStyle = '#000203'
    this.canvas.fillRect(0,0,win_w,win_h);

    if (!this.flt_back) return;

    var mapr = this.scale * 65536;

    var imaxr = 2 * this.bgimage.width;

    var hminscale = win_h / 65536;
    var wminscale = win_w / 65536;
    var minscale = Math.max(hminscale, wminscale);
    var bgmin = hminscale > wminscale ? win_h : win_w;
    var bgr = intervals_value(this.scale,minscale,64,bgmin,imaxr);

    var mk = bgr / mapr;


    var bcx = intervals_value(this.cx,0,65536,0,imaxr);
    var bcy = intervals_value(this.cy,0,65536,0,imaxr);
    //console.log(this.scale,mk,this.cx,this.cy,bcx,bcy,ix,iy,bgr)
    var wbcx = intervals_value(bcx,0,imaxr,0,bgr);
    var wbcy = intervals_value(bcy,0,imaxr,0,bgr);

    //console.log(this.scale,mk,this.cx,this.cy,wbcx,wbcy,ix,iy,bgr)

    if ( ( win_w / 2 ) + wbcx > bgr)
    {
      wbcx = bgr - ( win_w / 2 );
    }

    if ( wbcx - (win_w / 2 )  < 0)
    {
      wbcx =  (win_w / 2 );
    }

    if ( (win_h / 2 )  + wbcy > bgr )
    {
      wbcy = bgr - (win_h / 2 ) ;
    }

    if ( wbcy - (win_h / 2 ) < 0)
    {
      wbcy =  (win_h / 2 );
    }

    var ix = win_w / 2 - wbcx;
    var iy = win_h / 2 - wbcy;







    //console.log(this.scale,mk,this.cx,this.cy,bcx,bcy,ix,iy,bgr)

    this.msImageSmoothingEnabled = true;
    this.canvas.drawImage(this.bgimage, ix, iy, bgr, bgr);
    //console.log(this.galaxies);

    for (var id in this.galaxies) {


      if (typeof this.galaxies[id].img == 'object') {

        var sx = Math.round( (this.galaxies[id].x - this.cx) * this.scale + (win_w / 2));
        var sy = Math.round( (this.galaxies[id].y - this.cy) * this.scale + (win_h / 2));
        var sr = Math.round(1.25 * this.galaxies[id].r * this.scale) ;

//                this.canvas.fillStyle = '#f00203'
//                this.canvas.fillRect(sx - sr, sy - sr , 2 * sr, 2 * sr);
        this.msImageSmoothingEnabled = true;
        this.canvas.drawImage(this.galaxies[id].img, sx - sr, sy - sr , 2 * sr, 2 * sr);

      }

    }



    /*
            this.canvas.setLineDash([]);
            this.canvas.strokeStyle = '#f00'
            this.canvas.strokeRect( ix, iy, bgr, bgr);

            this.canvas.font = 'normal 12px Tahoma';
            this.canvas.textBaseline = 'top';
            this.canvas.fillStyle = '#fff'
            this.canvas.fillText(this.cx + ' - '+this.cy+' , '+this.scale ,150,50);
    */
  }

  this.draw_loading = function()
  {

    var win_w = this.owner.clientWidth;
    var win_h = this.owner.clientHeight;

    this.canvas.font = 'bold 16px Tahoma';
    this.canvas.textBaseline = 'middle';
    this.canvas.textAlign = 'center';
    this.canvas.fillStyle = '#1f8fce'
    this.canvas.fillText('Loading data ...',win_w /2 ,win_h / 2 - 64);
  }

  this.refresh(scale,cx,cy);
  this.reload();
  this.push_undo();
}

var contextMenuHandler = function () {
  return false;
}

Map = {
  Quadrant : function(x, y) {
    return {
      "x" : x,
      "y" : y,
      isLoad : false
    };
  },

  pointToQuadrant : function(x, y) {

    this.x = Math.floor(x / 64 ) * 64 + 32;
    this.y = Math.floor(y / 64 ) * 64 + 32;

    return this.Quadrant(this.x, this.y);
  },

  get_quadrant_pos : function(n) {
    // given n an index in the squared spiral
    // p the sum of point in inner square
    // a the position on the current square
    // n = p + a

    var q = n & 1;

    var r = Math.floor((Math.sqrt(n + 1) - 1) / 2) + 1;


    // compute radius : inverse arithmetic sum of 8+16+24+...=
    //var p = (8 * r * (r - 1)) / 2;
    var p = 16*(q-1)/2;
    // compute total point on radius -1 : arithmetic sum of 8+16+24+...

    var en = r * 2;
    // points by face

    var a = (1 + n - p) % (r * 8);
    // compute de position and shift it so the first is (-r,-r) but (-r+1,-r)
    // so square can connect

    var pos = [0, 0, r];
    switch (Math.floor(a / (r * 2))) {
      // find the face : 0 top, 1 right, 2, bottom, 3 left
      case 0:
      {
        pos[0] = a - r;
        pos[1] = -r;
      }
        break;
      case 1:
      {
        pos[0] = r;
        pos[1] = (a % en) - r;

      }
        break;
      case 2:
      {
        pos[0] = r - (a % en);
        pos[1] = r;
      }
        break;
      case 3:
      {
        pos[0] = -r;
        pos[1] = r - (a % en);
      }
        break;
    }
    return pos;
  },

  pos_matrix: function(w, h) {

    var iy = ix = 0;
    var hr = (w - 1) / 2;
    var vr = (h - 1) / 2;
    var tt = w * h;
    var matrix = [];
    var step = 1;
    var dx = 1;
    var dy = 0;


    var i = 0;
    while(matrix.length < tt && matrix.length < 6192) {

      i++;

      if (step > hr)
        break;

      if((ix <= hr && ix >= (hr * -1)) && (iy <= vr && (iy >= (vr * -1)))) {

        if (!(ix == 0 && iy == 0)) {
          matrix.push([ix, iy]);
        }
      }

      ix += dx;
      iy += dy;

      // check direction
      if(dx !== 0) {
        // increase step
        if(ix === step && iy === (step * -1)) step++;

        // horizontal range reached
        if(ix === step || (ix === step * -1)) {
          dy = (ix === iy)? (dx * -1) : dx;
          dx = 0;
        }
      } else {
        // vertical range reached
        if(iy === step || (iy === step * -1)) {
          dx = (ix === iy)? (dy * -1) : dy;
          dy = 0;
        }
      }
    }

    return matrix;

  }

}