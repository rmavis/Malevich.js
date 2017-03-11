/*
  let GFD = greatest frame dimension
  let ME = maximum number of elements

  Steps:
  1. pick a random shape (circle, square)
  2. pick a random size (for circles, up to a ~quarter of the greatest frame dimension (GFD), for squares, up to GFD less some)
  3. if size is greater than ~50% of GFD, divide ME by 2
  4. decrement ME by 1
  5. while ME > 0, repeat steps 1-4
  6. pick a random color for the background
  7. pick a random non-background color for each element
  8. add each element to the background at random locations
*/

function Malevich(args) {


    /*
     * Init & config.
     */

    var $frame = document.body;

    var $frame_pad = 10;

    var $max_elems = 10;

    var $max_dim = 100;
    var $min_dim = 5;

    var $dim_unit_x = 'vw';
    var $dim_unit_y = 'vh';

    var $colors = [
        {
            base: [0, 0, 0, 1],  // black
            variants: [
                [[0, 330], 100, 50, [0.1, 0.9]],
                [[0, 180], 100, 50, [0.1, 0.9]],
                [[180, 360], 100, 50, [0.1, 0.9]],
                [[160, 180], 100, 50, [0.1, 0.9]],
                [0, 0, [10, 100], [0.1, 0.9]],
                [0, 0, [10, 100], [0.4, 0.6]],
                [0, 0, [10, 100], 1],
                [getRandomInt(0, 330), 100, [10, 100], 1]
            ]
        },
        {
            base: [0, 0, 100, 1],  // white
            variants: [
                [[0, 330], 100, 50, [0.1, 0.9]],
                [[0, 180], 100, 50, [0.1, 0.9]],
                [[180, 360], 100, 50, [0.1, 0.9]],
                [[160, 180], 100, 50, [0.1, 0.9]],
                [0, 0, [0, 90], [0.1, 0.9]],
                [0, 0, [0, 90], [0.4, 0.6]],
                [0, 0, [0, 90], 1],
                [getRandomInt(0, 330), 100, [0, 90], 1]
            ]
        },
        {
            base: [0, 100, 50, 1],  // red
            variants: [
                [[30, 330], 100, 50, [0.1, 0.9]],
                [[30, 90], 100, 50, [0.1, 0.9]],
                [180, 100, [0, 100], [0.1, 0.9]],
                [0, [0, 50], 100, [0.1, 0.9]],
                [getRandomInt(30, 330), 100, [0, 100], [0.1, 0.9]],
            ]
        },
    ];


    var $shapes = [
        makeCircle,
        makeSquare,
        makeRectangle,
    ];



    function init(args) {
        var max_elems = (args.max_elems || $max_elems),
            frame = (args.frame || $frame);

        var shapes = makeShapes(max_elems),
            colors = getColors(shapes.length);

        shapes = giveShapesColors(shapes, colors.fgs);
        shapes = giveShapesPositions(shapes);

        var elems = makeElements(shapes);

        frame.style.backgroundColor = colors.bg;
        compileImage(frame, elems);
    }



    /*
     * Shape functions.
     */

    function makeSquare() {
        var shape = makeShape(),
            dim = getRandomInt($min_dim, ($max_dim - ($frame_pad * 2)));

        shape.width = dim + $dim_unit_x;
        shape.height = dim + $dim_unit_x;

        return shape;
    }



    function makeRectangle() {
        var shape = makeShape();

        shape.width = getRandomInt($min_dim, ($max_dim - ($frame_pad * 2))) + $dim_unit_x;
        shape.height = getRandomInt($min_dim, ($max_dim - ($frame_pad * 2))) + $dim_unit_y;

        return shape;
    }



    function makeCircle() {
        var shape = makeSquare();

        shape.borderRadius = shape.height;
        shape.borderWidth = '1px';

        return shape;
    }



    function makeShapes(max) {
        max = (max || $max_elems);

        var shapes = [ ];

        for (var o = 0; o < max; o++) {
            var shape = $shapes[getRandomInt(0, $shapes.length)]();
            shapes.push(shape);

            if (Math.max(shape.width, shape.height) > 50) {
                max = Math.floor(max / 2);
            }

            max -= 1;
        }

        return shapes;
    }



    function makeShape() {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderWidth: 0,
            borderRadius: 0,
            borderColor: null,
            backgroundColor: null,
            transform: null,
        };
    }



    function giveShapesColors(shapes, colors) {
        for (var o = 0, m = shapes.length; o < m; o++) {
            shapes[o].backgroundColor = colors[o];
        }

        return shapes;
    }



    function giveShapesPositions(shapes) {
        for (var o = 0, m = shapes.length; o < m; o++) {
            shapes[o].top = getRandomInt(
                $frame_pad,
                Math.max(
                    (100 - $frame_pad - parseInt(shapes[o].height)),
                    $frame_pad
                )
            ) + $dim_unit_y;
            shapes[o].left = getRandomInt(
                $frame_pad,
                Math.max(
                    (100 - $frame_pad - parseInt(shapes[o].width)),
                    $frame_pad
                )
            ) + $dim_unit_x;
            console.log(shapes[o].top + ', ' + shapes[o].left);
        }

        return shapes;
    }





    /*
     * Color functions.
     */

    function getColors(n) {
        var color = $colors[getRandomInt(0, $colors.length)],
            variant = color.variants[getRandomInt(0, color.variants.length)],
            fgs = [ ];

        // console.log(variant);

        for (var o = 0; o < n; o++) {
            fgs.push(makeColorString(varyColor(color.base, variant)));
        }

        // console.log(fgs);

        return {
            bg: makeColorString(color.base),
            fgs: fgs
        };
    }



    // color = [int, int, int]
    // lims = [[int, int], [int, int], [int, int], [float, float]]
    function varyColor(color, lims) {
        var variant = [ ];

        for (var o = 0, m = lims.length; o < m; o++) {
            if ((lims[o] === false) || (lims[o] === null)) {
                variant.push(color[o]);
            }
            else if (lims[o].constructor == Array) {
                // This presumes the array only has two values.
                // Are there use cases for more?
                var f = ((lims[o][0] % 1 === 0) &&
                         (lims[o][1] % 1 === 0))
                    ? getRandomInt
                    : getRandomArbitrary;
                variant.push(f(lims[o][0], lims[o][1]));
            }
            else {
                variant.push(lims[o]);
            }
        }

        return variant;
    }



    function makeColorString(color) {
        return 'hsla('+color[0]+', '+color[1]+'%, '+color[2]+'%, '+color[3]+')';
    }





    /*
     * Element functions.
     */

    function makeElements(shapes) {
        var elems = [ ];

        for (var o = 0, m = shapes.length; o < m; o++) {
            var elem = document.createElement('div');

            for (key in shapes[o]) {
                elem.style[key] = shapes[o][key];
            }

            elems.push(elem);
        }

        return elems;
    }



    function compileImage(frame, elems) {
        for (var o = 0, m = elems.length; o < m; o++) {
            frame.appendChild(elems[o]);
        }

        return frame;
    }





    /*
     * Utility functions.
     */

    // via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // max is not inclusive
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }



    // via same as above
    // max is not inclusive
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }



    return init(args)
};
