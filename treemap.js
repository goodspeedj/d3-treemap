function makeTreeMap() {

  let height = 800
  let width  = 1000

  let treemapLayout = d3.treemap()
    .size([width, height])
    .paddingOuter(16);

  d3.json('health.json')
    .then(function(data) {

        let rootNode = d3.hierarchy(data)

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
          .data(rootNode.descendants(), d => d ? d.data.name : 'root')  // not sure we need the if here

        nodes = nodes
          .enter()
          .append('g')
          .merge(nodes)
          // define how many levels to show of the treemap
          .filter(function(d) {
            return d.depth < 3;
          })
          //.transition(t)
          .attr('transform', function(d) {
            return 'translate(' + [d.x0, d.y0] + ')'
          })

        nodes
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
            //update(d.data)
          })

          // lable the rectangles
          nodes
            .append('text')
            .attr('dx', 4)
            .attr('dy', 14)
            .text(function(d) {
              return d.data.name;
            })

  })

}
