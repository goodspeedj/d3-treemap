function makeTreeMap() {

  let height = 700
  let width  = 900
  let mapDepth = 3
  let rootNode


  let treemapLayout = d3.treemap()
    .size([width, height])
    .paddingOuter(16)

    d3.json('health.json').then(function(data) {

      let ancestors = [data.name]

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



      let update = (d, topNode) => {

        // if name gets passed the user clicked on the top level node
        if (topNode && data.children !== null) {
          let oldNodes = d3.selectAll('g')

          // remove all nodes and start over
          oldNodes
            .remove()

          // the new root node is the 2nd to last in the ancestors array
          rootNode = d3.hierarchy(deepSearch(data, ancestors[ancestors.length - 2]))
          ancestors.pop()
        } else {
          rootNode = d3.hierarchy(d)
        }


        // sum and sort the root node values
        rootNode
          .sum(d => d.value)
          .sort((a,b) => b.height - a.height || b.value - a.value)

        treemapLayout(rootNode)

        // bind the data to the nodes
        let nodes = d3.select('svg')
          .attr('width', width)
          .attr('height', height)
          //.attr('viewBox', `0 0 1700 1900`)
          .selectAll('g')
          .data(rootNode.descendants(), d => d.data.name)


        nodes
          .exit()
          .remove()

        let newNodes = nodes
          .enter()
          .filter(d => d.depth < mapDepth)
          .append('g')
          .attr('transform', d => 'translate(' + [d.x0, d.y0] + ')')


        newNodes
          .append('rect')
          .transition()
          .duration(750)
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .attr('style', d => ('fill:' + d3.interpolateRdYlGn(d.data.health)))


        newNodes
          // drill in on click
          .on('click', d => {

            if(d.depth === 0) { update(data, true) }

            if(ancestors.indexOf(d.parent.data.name) === -1) { ancestors.push(d.parent.data.name) }

            update(d.parent.data)

          })
          .on('mouseover', d => {
            d3.select(this)
              .attr('fill-opacity', '0.5')
              .attr('style', 'cursor: pointer')
          })
          .on('mouseout', d => {
            d3.select(this).attr('fill-opacity', '1')
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
          .text(d => d.data.name)

        nodes
          .merge(newNodes)
          // how many layers to show at once
          .filter(d => d.depth < mapDepth)
          .transition()
          .duration(750)
          .attr('transform', d => 'translate(' + [d.x0, d.y0] + ')')
          .select('rect')
          .attr('width', d=> d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .attr('style', d => ('fill:' + d3.interpolateRdYlGn(d.data.health)))

      }

    update(data)

  })
}
