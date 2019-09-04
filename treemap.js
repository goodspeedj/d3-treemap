function makeTreeMap() {

  let height = 800
  let width  = 1000

  let treemapLayout = d3.treemap()
    .size([width, height])
    .paddingOuter(16);

    d3.json("health.json").then(function(data) {

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
            return d.data.name;
          })

        nodes
          .exit()
          .remove()

        let newNodes = nodes
          .enter()
          .filter(function(d) {
            return d.depth < 4;
          })
          .append('g')
          .attr('transform', function(d) {
            return 'translate(' + [d.x0, d.y0] + ')'
          })


        newNodes
          .append('rect')
          .transition()
          .duration(750)
          .attr('width', function(d) {
            return d.x1 - d.x0;
          })
          .attr('height', function(d) {
            return d.y1 - d.y0;
          })
          .attr('style', function(d) {
            return ('fill:' + d3.interpolateRdYlGn(d.data.health))
          })

        newNodes
          // drill in on click
          .on('click', function(d) {
            update(d.data)
          })

        // lable the rectangles
        newNodes
          .append('text')
          .attr('dx', 4)
          .attr('dy', 14)
          .attr('opacity',0)
          .transition()
          .duration(750)
          .attr('opacity',1)

          .text(function(d) {
            return d.data.name;
          })

        nodes
          .merge(newNodes)
          .filter(function(d) {
            return d.depth < 5;
          })
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

    update(data);

  });

}
