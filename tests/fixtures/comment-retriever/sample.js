
// should appear1

/*
text
should appear2
 * text
*/

/*
 * should appear3
 */

/** should appear4 */

var t = 4; // should appear5

var t = 4; /* should appear6 */

"\"// should not appear1";

"/** should not appear2 */";

'\'// should not appear3';

'/** should not appear4 */';

`
// should not appear5
`;

`
/*
 * should not appear6
 */
`;

$t = 4; /* should 'appear7' */
