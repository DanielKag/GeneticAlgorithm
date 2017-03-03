// Only executed our code once the DOM is ready.
	window.onload = function() {
		// Get a reference to the canvas object
		var canvas = document.getElementById('myCanvas');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
		// Create a Paper.js Path to draw a line into it:
		
        let pop = initPopulation(parameters)
        
        let paths = [];
        let creature = getFittestCreature(pop).creature;
        console.log(creature)
        for(let i=0;i<creature.length;i++) {
            let path = new paper.Path();

            path.strokeColor = 'black';
            let start = new paper.Point(((i+1) * 20), 0 + canvas.height);
            path.moveTo(start);
            path.lineTo(start.add([ 0, -(creature[i])  ]));
            paths.push(path);
        }

        setTimeout(function() {
            paper.clear();
            paper.view.draw();
            
        }, 2000);
        
		paper.view.draw();
	}