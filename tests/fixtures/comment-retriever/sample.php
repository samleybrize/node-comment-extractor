<?php

// should appear1

# should appear2

/*
text
should appear3
 * text
*/

/*
 * should appear8
 */

/** should appear4 */

$t = 4; // should appear5

$t = 4; # should appear6

$t = 4; /* should appear7 */

"
\"
// should not appear3
";

"
/*
 * should not appear4
 */
";

"
# should not appear6
";

'
\'
// should not appear7
';

'
/*
 * should not appear8
 */
';

'
# should not appear9
';

<<<STR
// should not appear5
STR TEXT
STR;

<<<'STR'
/*
 * should not appear10
 */
STR;

<<<"STR"
# should not appear11
STR;

$t = 4; /* should 'appear9' */
