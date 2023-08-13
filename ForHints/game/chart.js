sfChart = {

  clear: function(container) {
    $('#' + container).html('');
    var el = document.getElementById(container),
      elClone = el.cloneNode(true);

    el.parentNode.replaceChild(elClone, el);
  },

  showmsg: function(container, message){
    $('#' + container).append("<div class='textcontainer' style='text-align:center'><span class='text_n'>" + message + "</span></div>");
  },

  drawChart: function(container, data){

    this.clear(container);

    function procItems(vix){

      var items = [];
      items.xAxisF = [];
      items.yAxisF = [];

      for(var i in vix) {

        n = parseInt(i);
        param = vix[i];

        if (param.type != 'xaxis' && param.data)
        {
          for(var i in param.data) {
            var val = parseFloat(param.data[i][1]);
            if (val)
              param.data[i][1] = parseFloat(val.toFixed(1));
          }
        }


        if (param.type == 'xaxis'){
          items.xAxisF = param.data;
        }
        else if (param.type == 'line') {

          var line;
          var color = param.color;

          if (param.fill == true) {
            line = {
              data: param.data,
              label: param.label ,
              lines: {
                show: true,
                fill: true,
                color: param.color,
                lineWidth: 1,
                fillOpacity: 0.1
              }
            }
          } else {
            line = {
              data: param.data,
              label: param.label,
              color: color,
              mouse:{track:true},
              yaxis: param.yaxis,
              lines: {
                show: true,
                lineWidth: 2,
                color: color,
                fillOpacity: 1
              },
              points: {
                show: true,
                color: color
              }
            }
          }

          items.yAxisF.push(line);
        }

      }

      return items;
    }

    var vix = data ? data.items : undefined;
    var items = procItems(vix);
    var xAxisF = items.xAxisF;
    var yaxisMax = data.yaxisMax;
    var y2axisMax = data.y2axisMax;
    var container = document.getElementById(container);
    var graph;


    var options = {
      selection: {
        mode: 'x',
        fps: 30
      },
      xaxis: {
        noTicks: xAxisF.length,
        tickFormatter: function(x) {
          var x = parseInt(x);
          return xAxisF[(x) % xAxisF.length];
        }
      },
      yaxis: {
        color: '#00ADC3',
        min: 0,
        max: yaxisMax
      },
      y2axis: {
        min: 0,
        max: y2axisMax,
        color: '#00d000'
      },
      mouse: {
        trackFormatter: function(obj)
        {
          return obj.y + ' IG';
        },
        relative: true
      },
      grid: {
        verticalLines: false,
        color: '#288196',
        tickColor: '#288196',
        backgroundColor: ['#021018', '#0F323A'],
        horizontalLines: true
      },
      legend: {
        position: 'nw',
        backgroundColor: 'rgba(16, 52, 61, 0.8)',
        labelBoxBorderColor: '#20697a'
      },
      title: data.title,
      subtitle: data.subtitle


    };

    function drawGraph(opts) {

      // Clone the options keeps intact.
      var o = Flotr._.extend(Flotr._.clone(options), opts || {});

      return Flotr.draw(
        container, items.yAxisF, o
      );
    }


    graph = drawGraph();


    function select(area) {

      var axisMax = function(axis, x1, x2){

        var max = (axis == 1 ? yaxisMax : y2axisMax);
        var lmax = 0;

        for(var i in items.yAxisF) {
          var item = items.yAxisF[i];
          if ((item.yaxis == axis) || (!item.yaxis && axis == 1))  {
            item.data.forEach(function(entry) {
              if (entry[0] > x1 && entry[0] < x2)
              {
                var num = parseFloat(entry[1]);
                lmax = num > lmax ? num : lmax;
              }

            })
          }
        }

        max = (lmax != 0 ? lmax * 1.15 : max);

        return max;
      }


      graph = drawGraph({
        xaxis: {
          noTicks: area.x2 - area.x1,
          tickFormatter: function(x) {
            var x = parseInt(x);
            return xAxisF[(x) % xAxisF.length];
          },
          min: area.x1,
          max: area.x2
        },
        yaxis: {
          color: '#00ADC3',
          min: 0,
          max: axisMax(1, area.x1, area.x2)
        },
        y2axis: {
          color: '#00d000',
          min: 0,
          max: axisMax(2, area.x1, area.x2)
        }
      });
    }

    //selected area
    Flotr.EventAdapter.observe(container, 'flotr:select', select);

    //default area
    Flotr.EventAdapter.observe(container, 'flotr:click', drawGraph);
  }

}
