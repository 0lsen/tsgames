import {SortTest} from "./SortTest";
import {SelectionSort} from "../../ts/ciso/impl/SelectionSort";

const sortTest = new SortTest(SelectionSort);
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