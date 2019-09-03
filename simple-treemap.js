function makeTreeMap() {

const data1 = {"name":"Liberty Mutual","health":0.674,"children":[{"name":"GRM","health":0.521,"children":[{"name":"GRM US","health":0.614,"children":[{"name":"Digital","health":0.666,"children":[{"name":"eSales","health":0.8,"children":[{"name":"Auto","health":0.7,"value":12},{"name":"Property","health":0.9,"value":8}]},{"name":"eService","health":0.5,"children":[{"name":"Billing","health":0.4,"value":10},{"name":"MMA","health":0.5,"value":8},{"name":"Policy","health":0.6,"value":10}]},{"name":"LM.com","value":10,"health":0.7}]},{"name":"DocSol","health":0.45,"children":[{"name":"Products","value":10,"health":0.8},{"name":"Solutions","value":14,"health":0.1}]},{"name":"Claims","health":0.64,"children":[{"name":"Financial","value":10,"health":0.8},{"name":"Personal","value":12,"health":0.2},{"name":"Business","value":7,"health":0.7},{"name":"Intake","value":9,"health":0.9},{"name":"Handling","value":5,"health":0.6}]},{"name":"IM","value":2,"health":0.7}]},{"name":"GRM East","health":0.45,"children":[{"name":"City State","health":0.45,"value":22}]},{"name":"GRM West","health":0.5,"children":[{"name":"Something","health":0.5,"value":20}]}]},{"name":"GRS","health":0.7,"children":[{"name":"Specialty","health":0.8,"value":20},{"name":"LSM","health":0.7,"value":42},{"name":"Surety","health":0.4,"value":34},{"name":"Data","health":0.9,"value":27}]},{"name":"Corporate","health":0.65,"children":[{"name":"Legal","health":0.9,"value":17},{"name":"T&ES","health":0.2,"value":12},{"name":"Finance","health":0.7,"value":22},{"name":"Workgrid","health":0.9,"value":7}]},{"name":"Hosting","health":0.825,"children":[{"name":"End User","health":0.7,"value":12},{"name":"AE","health":1,"value":33},{"name":"Network","health":0.7,"value":22},{"name":"SecDevOps","health":0.9,"value":21}]}]}
const data2 = {"name":"Digital","health":0.666,"children":[{"name":"eSales","health":0.8,"children":[{"name":"Auto","health":0.7,"value":12},{"name":"Property","health":0.9,"value":8}]},{"name":"eService","health":0.5,"children":[{"name":"Billing","health":0.4,"value":10},{"name":"MMA","health":0.5,"value":8},{"name":"Policy","health":0.6,"value":10}]},{"name":"LM.com","value":10,"health":0.7}]}




  let height = 800
  let width  = 1000

  let treemapLayout = d3.treemap()
    .size([width, height])
    .paddingOuter(16);

    //d3.json("health.json").then(function(data) {

    let update = (d) => {


    let rootNode = d3.hierarchy(d)

    // sum and sort the root node values
    rootNode
      .sum(function(d) {
        return d.value;
      })
      .sort(function(a, b) {
        return b.height - a.height || b.value - a.value;
      });

    treemapLayout(rootNode);

    // bind the data to the nodes
    let nodes = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .selectAll('g')
      .data(rootNode.descendants(), function(d) {
        console.log(d)
        return d.data.name;
      })

    nodes
      .exit()
      .remove()

    let newNodes = nodes
      .enter()
      .append('g')
      //.merge(nodes)
      // define how many levels to show of the treemap
      .filter(function(d) {
        return d.depth < 5;
      })
      //.transition(t)
      .attr('transform', function(d) {
        return 'translate(' + [d.x0, d.y0] + ')'
      })

    newNodes
      .append('rect')
      .attr('width', function(d) {
        return d.x1 - d.x0;
      })
      .attr('height', function(d) {
        return d.y1 - d.y0;
      })
      .attr('style', function(d) {
        return ('fill:' + d3.interpolateRdYlGn(d.data.health))
      })
      // drill in on click
      .on('click', function(d) {
        update(data2)
      })

    // lable the rectangles
    newNodes
      .append('text')
      .attr('dx', 4)
      .attr('dy', 14)
      .text(function(d) {
        return d.data.name;
      })

    nodes
      .merge(newNodes)
      .transition()
      .duration(750)
      .attr('transform', function(d) {
        return 'translate(' + [d.x0, d.y0] + ')'
      })
      .select('rect')
      .attr('width', function(d) {
        return d.x1 - d.x0;
      })
      .attr('height', function(d) {
        return d.y1 - d.y0;
      })
      .attr('style', function(d) {
        return ('fill:' + d3.interpolateRdYlGn(d.data.health))
      })

    }

    update(data1);

  //});

}
