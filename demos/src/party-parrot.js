/**
 * @file
 * This is a simple Preact component that displays a gif of a parrot.
 * It is a trivial proof-of-concept. Preact is loaded via SystemJS.
 */

import preact from "preact"; // eslint-disable-line no-unused-vars

// Tell Babel to transform JSX into h() calls:
/** @jsx preact.h */

const gif =
	"https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcultofthepartyparrot.com%2Fparrots%2Fhd%2Fdealwithitparrot.gif?source=ig";

export default el => preact.render(<img alt="party parrot" src={gif} />, el);
