var charts = [];
var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

var updateConfigAsNewObject = function(chart, options) {
    chart.options.plugins.title.text = 'new title';
    //chart[chart].options = options;
    chart[chart].update();
    console.log('update');
}
var updateConfigByMutating = function(chart) {
    chart.options.plugins.title.text = 'new title';
    chart.update();
}
function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    throw new Error('Bad Hex');
}

// function destroyCharts(){
//     // for(chart in charts){
//     //   charts[chart].destroy();
//     // }
// }
var getPercentage = function(num, arr){
    var total = 0;
    var result;
    for(var i=0; i<arr.length; i++){
        total += Number(arr[i]);
    }
    result = Math.round((num/total)*100);
    
    //(num/100)*per
    return result+'%';
}
var getNode = function(obj, key){
    var result = {};
    for(var i=0;i<obj.length;i++){
       if(obj[key] == key){
           
       } 
    }
    return result;
}

var buildChart = function(id){
    
    // Get chart attributes
    // console.log($('#'+id).attr('data-attr'));
    var obj = JSON.parse($('#'+id).attr('data-attr'));
    // console.log(obj);
     // Add uId to id attribute
    // obj.id = id;
    var url = obj.url;
    var type = obj.type;
    var style = obj.style;
    var legend = obj.legend;
    var legend_pos = obj.legend_pos;
    var currency = obj.currency;
    // var schemaMapping = obj.schema;
    // var step = Number(obj.step);
    var options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
              display: legend,
              position: legend_pos
            }
        }
      };
    if(style==='stacked'){
        options.scales = {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
    }
    if(style==='horizontal'){
        options.indexAxis = 'y';
    }
    // console.log(options);
    //console.log(JSON.stringify(obj));
    // Set all values with id in canvas obj
    // making sure the id is allways the same
    // $('#'+id).attr('data-attr', JSON.stringify(obj))
    
    
    if(url!=''){
        // Build loader
        $('#card-'+obj.id+' .card-body').append('<div id="loader-'+obj.id+'" class="loader-container d-flex justify-content-center align-items-center"><div class="loader"></div></div>');
           
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
             if (xhr.status === 200) {
                //console.log(JSON.parse(xhr.responseText));
                var data = JSON.parse(xhr.responseText);
                var labels;
                var datasets;
                console.log(obj.remote);
                if(obj.remote == "true"){
                    // Temporary/not reliable
                    data = data[0];
                    // If schema mapping is set 
                    // define which json node name we will grab its content
                    if(obj.map1 != ""){
                        labels = data[obj.map1];
                    }else{
                        labels = data.labels;
                    }
                    if(obj.map2 != ""){
                        datasets = data[obj.map2];
                    }else{
                        datasets = data.datasets;
                    }
                    
                }else{
                    labels = data.labels;
                    datasets = data.datasets;
                }
                
                console.log(datasets.length);
                if(!labels || !datasets){
                    console.error('Wrong data structure');
                }else{
                    // console.log(data.datasets);
                    // // Add colors to graph
                    var colorIndex = 0;
                    if(type==='bar'){
                        colorIndex = 0;
                        for(var i=0; i<datasets.length; i++){
                            datasets[i].backgroundColor = defaultGraphsColors[colorIndex];
                            datasets[i].borderColor = defaultGraphsColors[colorIndex];
                            datasets[i].hoverBackgroundColor = defaultGraphsColors[colorIndex];
                            datasets[i].hoverBorderColor = defaultGraphsColors[colorIndex];
                            datasets[i].barPercentage = barChartPercentage;
                            datasets[i].categoryPercentage = barChartCatPercentage;
                            colorIndex++;
                        }
                    }
                    if(type==='line'){
                        colorIndex = 0;
                        for(var i=0; i<datasets.length; i++){
                            datasets[i].backgroundColor = defaultGraphsColors[colorIndex];
                            datasets[i].borderColor = defaultGraphsColors[colorIndex];
                            colorIndex++;
                        }
                    }
                    if(type === 'doughnut'){
                        colorIndex = 0;
                        datasets[0].backgroundColor = [];
                        for(var i=0; i<data.datasets[0].data.length; i++){
                            datasets[0].backgroundColor.push(defaultGraphsColors[colorIndex]);
                            // data.datasets[i].borderColor = defaultGraphsColors[colorIndex];
                            colorIndex++;
                        }
                        datasets[0].hoverOffset = 4;
                    }
                    if(type==='radar'){
                        colorIndex = 0;
                        for(var i=0; i<datasets.length; i++){
                            datasets[i].backgroundColor = hexToRgbA(defaultGraphsColors[colorIndex], 0.2);
                            datasets[i].borderColor = defaultGraphsColors[colorIndex];
                            colorIndex++;
                        }
                    }
                    if(type==='pie'){
                        colorIndex = 0;
                        var colors = [];
                        if(datasets.length>1){
                            // If there are more than one data set
                            // remove others
                            alert('Please verify your data source. Pie charts should have only a single dataset: Ex. "datasets": {"data": [2602,1253,541,1465]}');
                            
                        }
                        for(var i=0; i<data.datasets[0].data.length; i++){
                            colors.push(defaultGraphsColors[colorIndex]);
                            // datasets[i].borderColor = defaultGraphsColors[colorIndex];
                            // datasets[i].hoverBackgroundColor = defaultGraphsColors[colorIndex];
                            // datasets[i].hoverBorderColor = defaultGraphsColors[colorIndex];
                            
                            colorIndex++;
                        }
                        datasets[0].backgroundColor = colors;
                        
                        
                    }
                    // console.log(data.datasets[0]);
                    
                }
                
                if(!charts.hasOwnProperty(id)){
                  charts[id] = new Chart(document.getElementById(id), {
                      type: type,
                      data: data,
                      options: options,
                  });
                  // Generate table for pie charts
                  if(type==='pie'){
                      colorIndex = 0;
                      var colors = [];
                      for(var i=0; i<labels.length; i++){
                          var hex = defaultGraphsColors[colorIndex];
                          var val = datasets[0].data[i];
                          if(currency){
                              val = formatter.format(val);
                          }else{
                              val = val.toLocaleString();
                          }
                          $('#'+id+'-tbl tbody').append('<tr><td><i class="fas fa-square-full" style="color: '+hex+' !important"></i> '+data.labels[i]+'</td><td class="text-right">'+val+'</td><td class="text-right text-success">'+getPercentage(data.datasets[0].data[i], data.datasets[0].data)+'</td></tr>');
                          colorIndex++;
                      }
                      
                  }
                 
                }
                
               
                // Hide loader
                $('#loader-'+obj.id).remove();
              
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }
}
var getChartOptions = function(chart){
    console.log(chart + " chart");
    //console.log($('#'+chart).attr('data-attr'));
      return;
    var obj = JSON.parse($('#'+chart).attr('data-attr'));
  
    var options = {
            maintainAspectRatio: false,
            cornerRadius: 0,
            legend: {
              display: obj.legend,
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                  stacked: false,
                  ticks: {
                    stepSize: obj.step,
                  },
                  stacked: obj.stacked,
                },
              ],
              xAxes: [
                {
                  stacked: false,
                  gridLines: {
                    color: 'transparent',
                  },
                  stacked: obj.stacked,
                },
              ],
            },
          };
//   console.log(options);
    return options;
}
var initCharts = function(){
    $('.chart-canvas').each(function(){
        buildChart($(this).attr('id'));
    });
    // $('canvas').each(function(){
    //     if(!$(this).attr('id')){
    //       // Generate an is for dropped canvas then build the graph
    //       var id = ID();
    //       $(this).attr('id', 'canvas-'+id);
    //       console.log(id);
    //       buildChart('canvas-'+id);
    //     }else{
    //       // Update chart options
    //       for(chart in charts){
    //         updateConfigAsNewObject(charts[chart], getChartOptions(chart));
    //       }
    //     }
    // });
    //console.log("initCharts");
}

$(function () {
    initCharts();
});