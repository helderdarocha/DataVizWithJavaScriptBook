const dvj = {

    /**
     * Adjacency Matrix layout generator function
     * Default size is 1x1
     *
     * To create a layout function in a 800x600 view space:
     *
     * const matrixLayout = dvj.adjacencyMatrix()
     *                         .size([800,600]);
     *
     * To generate an array of matrix-positioned objects:
     *
     * const matrix = matrixLayout(node, edges);
     *
     * Where nodes and edges have the following minimum structure:
     *
     * nodes: [{node: obj1}, {node: obj2}, ...]
     * edges: [{source: obj1, target: obj2}, ...]
     *
     * Result is array with (nodes x nodes) elements. Each element contains:
     *   x - x position of rectangle
     *   y - x position of rectangle
     *   w - width of rectangle
     *   h - height of rectangle
     *
     * If element is an adjacency, it additionally contains properties from corresponding edge element.
     *
     * @returns layout function
     */

    adjacencyMatrix: function() {
        let w = 1;
        let h = 1;

        function layout(n, e) {

            const nodes = n.map(a => Object.assign({}, a));
            const edges = e.map(a => Object.assign({}, a));

            const matrix = [];
            const len = nodes.length;

            const groups = d3.nest()
                             .key(d => d.source)
                             .key(d => d.target)
                             .rollup(d => d[0])
                             .map(edges);

            nodes.forEach(function(source, i) {
                const t = groups.get(source.node);
                nodes.forEach(function(target, j) {
                    const rect = {x: i * w/len, y: j * h/len, w: w/len, h: h/len};
                    if(t) {
                        const value = t.get(target.node);
                        if(value) {
                            Object.assign(value, rect);
                            matrix.push(value);
                        } else {
                            matrix.push(rect);
                        }
                    } else {
                        matrix.push(rect);
                    }
                });
            });
            return matrix;
        }

        layout.size = function(array) {
            return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
        }

        return layout;
    }

};
