const dvj = {

    /**
     * Arc diagram layout generator function
     * Default size is 1x1
     *
     * To create a layout function in a 800x600 view space:
     *
     * const arcDiagLayout = dvj.arcDiagram()
     *                          .width(800);
     *
     * To generate an array of arc-positioned objects:
     *
     * const layout = arcDiagLayout(node, edges);
     *
     * Where nodes and edges have the following minimum structure:
     *
     * nodes: [{node: obj1}, {node: obj2}, ...]
     * edges: [{source: obj1, target: obj2}, ...]
     *
     * Results:
     *
     * layout.points(): adds x coordinate for each node
     * layout.curves(): replaces references for links to source and target for each edge
     *
     * @returns layout function
     */

    arcDiagram: function() {
        let w = 1;

        const points = [];
        const curves = [];

        function layout(n, e) {

            const nodes = n.map(a => Object.assign({}, a));
            const edges = e.map(a => Object.assign({}, a));

            const len = nodes.length;

            nodes.forEach(function(node, i) {
                node.x = i * w/len;
                node.i = i;
                points.push(node);
            });

            const groups = d3.nest()
                .key(d => d.node)
                .rollup(d => d[0])
                .map(nodes);

            edges.forEach(function(edge, j) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.weight > 0) {
                    curves.push(edge);
                }
            });

            return {points: () => points, curves: () => curves};
        }

        layout.width = function(width) {
            return arguments.length ? (w = +width, layout) : w;
        }

        return layout;
    },

    /**
     *
     */
    curve: function() {

        let h = 2;
        let w = 1;

        let source = d => d.source.x;
        let target = d => d.target.x;
        let midY   = d => d.source.x - d.target.x;

        function layout(d) {
            const line = d3.line().curve(d3.curveBundle.beta(0.75));
            const height = d3.scaleLinear().range([0,h/2]).domain([0,w])
            return line([ [source(d),0],[(source(d)+target(d))/2,height(midY(d))],[target(d),0] ]);
        }

        layout.source = (func) => arguments.length ? (source = func, layout) : source;
        layout.target = (func) => arguments.length ? (target = func, layout) : target;
        layout.midY   = (func) => arguments.length ? (midY = func, layout) : midY;

        layout.size = function(array) {
            return arguments.length ? (w = +array[0], h = +array[1] * 2, layout) : [w, h];
        }

        return layout;
    }

};
