const absurd = () => { throw new Error("unreachable") };

/**
 * A tagged logging identity function for debugging pipelines.
 * 
 * tokidoki :: String -> a -> a
 * 
 * Call `tokidoki("Koko", something);` or curried
 * ```
 * xs.map(tokidoki("Soko")).map(x => x + 1);
 * ```
 */
export const tokidoki: {
    <A extends {}>(tag: string, obj: A): A;
    <A extends {}>(tag: string): (obj: A) => A;
} = function <A extends {}>(tag: string, obj?: A): A | ((_: A) => A) {
    if (arguments.length < 2) {
        return (o: A) => tokidoki(tag, o);
    }
    console.log(tag, JSON.stringify(obj));
    return obj ?? absurd();
};
