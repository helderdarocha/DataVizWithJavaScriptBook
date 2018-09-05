let bgPlugin = {
    id: 'chartback',
    beforeDraw: function(chart, steps, options) {
        let ctx = chart.ctx;
        if(options.backgroundColor) {
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, chart.width, chart.height);
        }
        if(options.backgroundImage) {
            let image = new Image(chart.width, chart.height);
            image.src = options.backgroundImage;
            ctx.drawImage(image, 0,0,chart.width, chart.height);
        }
    }
}

Chart.plugins.register(bgPlugin);