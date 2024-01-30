interface IRepeater<T> {
    children: T;
    repetitions: number;
}

// Component.
const Repeater = <T,>(props: IRepeater<T>) => {
    const repetitionsArray = setRepeaterArray(props.repetitions);
    return <>{repetitionsArray.map((value: number, key: number) => props.children)}</>;
};
export default Repeater;

// Creates the array with a number of elements corresponding to "repetitions".
function setRepeaterArray(repetitions: number): Array<number> {
    let repetitionsArray: Array<number> = [];
    for (let i = 0; i < repetitions; i++) {
        repetitionsArray.push(i);
    }
    return repetitionsArray;
}
