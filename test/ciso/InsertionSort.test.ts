import {SortTest} from "./SortTest";
import {InsertionSort} from "../../ts/ciso/impl/InsertionSort";

const sortTest = new SortTest(InsertionSort);
sortTest.runTests([
    [0, 0],
    [1, 1],
    [2, 2, 2, 2, 2, 2],
    [
        3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3,
    ],
]);