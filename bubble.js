const bubbleSort = (nums, n) =>
    R.gte(n, nums.length - 1 ) ? 
    swapWithNext   
    


 const modifyArr = R.curry((i, newValue, arr) => 
                        Object.assign([], arr, {[i]: newValue}))
const swap = (arr, a, b) => R.pipe(modifyArr(a, arr[b]), modifyArr(b, arr[a]))(arr);




