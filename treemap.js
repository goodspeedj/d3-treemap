function makeTreeMap() {

  let height = 700
  let width  = 900
  let mapDepth = 3
  let rootNode
  let parent
  let grandparent
  let oldies = ['Liberty Mutual']

  let treemapLayout = d3.treemap()
    .size([width, height])
    .paddingOuter(16);

    d3.json("health.json").then(function(data) {

      // Do a deep search on the data object by node name
      let deepSearch = (object, name) => {
        if (object.name === name) {
          return object
        }

        let result, p

        for (p in object) {
          if (object.hasOwnProperty(p) && typeof object[p] === 'object') {
            result = deepSearch(object[p], name)
            if (result) {
              return result
            }
          }
        }
        return result
      }



      let update = (d, ancestors) => {

        // if name gets passed the user clicked on the top level node
        if (ancestors && data.children !== null) {
          let oldNodes = d3.selectAll('g')

          // remove all nodes and start over
          oldNodes
            .remove()

          rootNode = d3.hierarchy(deepSearch(data, oldies[oldies.length - 2]))
          oldies.pop()
        } else {
          rootNode = d3.hierarchy(d)
        }


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
            return d.depth < mapDepth;
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
            if(d.depth === 0) { update(data, 'dummy') }

            oldies.indexOf(d.parent.data.name) === -1 ? oldies.push(d.parent.data.name) : console.log("This item already exists");
            update(d.parent.data)

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
            return d.depth < mapDepth;
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
