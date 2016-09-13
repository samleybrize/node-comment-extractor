<?php

// TODO should appear1

# TODO should appear2

/*
text
TODO should appear3
 * text
*/

/*
 * TODO should appear8
 */

/** TODO should appear4 */

$t = 4; // TODO should appear5

$t = 4; # TODO should appear6

$t = 4; /* TODO should appear7 */

"
\"
// TODO should not appear3
";

"
/*
 * TODO should not appear4
 */
";

"
# TODO should not appear6
";

'
\'
// TODO should not appear7
';

'
/*
 * TODO should not appear8
 */
';

'
# TODO should not appear9
';

<<<STR
// TODO should not appear5
STR TEXT
STR;

<<<'STR'
/*
 * TODO should not appear10
 */
STR;

<<<"STR"
# TODO should not appear11
STR;

$t = 4; /* TODO should 'appear9' */
