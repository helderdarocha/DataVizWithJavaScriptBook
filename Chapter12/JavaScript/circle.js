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

    circleDiagram: function() {
        let w = 1;
        let h = 1;

        const points = [];
        const curves = [];

        function layout(n, e) {

            const nodes = n.map(a => Object.assign({}, a));
            const edges = e.map(a => Object.assign({}, a));

            const circ = 2 * Math.PI;

            nodes.forEach(function(node, i) {
                node.angle = i * circ/nodes.length;
                node.radius = Math.min(w,h)/2;
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

            return {points: () => points, links: () => curves};
        }

        layout.size = function(array) {
            return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
        }

        return layout;
    }

};
