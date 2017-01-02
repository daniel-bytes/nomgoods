export function remove(arr, pred) {
    let i = 0;
    let count = 0;

    while (i < arr.length) {
        if (pred(arr[i])) {
            arr.splice(i, 1);
            i = 0;
            count++;
        }
        else {
            i++;
        }
    }

    return count;
}