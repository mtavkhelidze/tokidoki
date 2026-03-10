import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { tokidoki } from "./index";
import { beforeEach } from "node:test";

describe("tokidoki", () => {

    beforeAll(() => vi.spyOn(console, "log").mockImplementation(() => { }));
    afterAll(() => vi.restoreAllMocks());

    describe("logging side effect", () => {

        it("logs tag and value on eager call", () => {
            vi.clearAllMocks();
            tokidoki("mytag", 99);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith("mytag", JSON.stringify(99));
        });

        it("logs on curried application", () => {
            vi.clearAllMocks();
            tokidoki("mytag")(99);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith("mytag", JSON.stringify(99));
        });

        it("does not log on partial application", () => {
            vi.clearAllMocks();
            tokidoki("mytag");
            expect(console.log).toHaveBeenCalledTimes(0);
        });

        it("logs once per element in map", () => {
            vi.clearAllMocks();
            const xs = [1, 2, 3];
            xs.forEach(tokidoki("tag"));
            expect(console.log).toHaveBeenCalledTimes(3);
            expect(console.log).toHaveBeenNthCalledWith(1, "tag", JSON.stringify(1));
            expect(console.log).toHaveBeenNthCalledWith(2, "tag", JSON.stringify(2));
            expect(console.log).toHaveBeenNthCalledWith(3, "tag", JSON.stringify(3));
        });
    });
    describe("eager form :: (tag, a) -> a", () => {
        it("identity law — number", () => {
            expect(tokidoki("tag", 42)).toBe(42);
        });

        it("identity law — string", () => {
            expect(tokidoki("tag", "hello")).toBe("hello");
        });

        it("identity law — object", () => {
            const obj = { x: 1 };
            expect(tokidoki("tag", obj)).toBe(obj);
        });

        it("identity law — zero", () => {
            expect(tokidoki("tag", 0)).toBe(0);
        });

        it("identity law — empty string", () => {
            expect(tokidoki("tag", "")).toBe("");
        });

        it("identity law — false", () => {
            expect(tokidoki("tag", false)).toBe(false);
        });
    });

    describe("curried form :: tag -> (a -> a)", () => {
        it("returns a function", () => {
            expect(typeof tokidoki("tag")).toBe("function");
        });

        it("curried identity law — number", () => {
            expect(tokidoki("tag")(42)).toBe(42);
        });

        it("curried identity law — falsy zero", () => {
            expect(tokidoki("tag")(0)).toBe(0);
        });

        it("curried application is consistent with eager", () => {
            const a = tokidoki("tag", 42);
            const b = tokidoki("tag")(42);
            expect(a).toBe(b);
        });
    });

    describe("logging side effect", () => {
        it("logs tag and value on eager call", () => {
            const spy = vi.spyOn(console, "log").mockImplementation(() => { });
            tokidoki("mytag", 99);
            expect(spy).toHaveBeenCalledWith("mytag", JSON.stringify(99));
            spy.mockRestore();
        });

        it("logs on curried application", () => {
            const spy = vi.spyOn(console, "log").mockImplementation(() => { });
            tokidoki("mytag")(99);
            expect(spy).toHaveBeenCalledWith("mytag", JSON.stringify(99));
            spy.mockRestore();
        });

        it("does not log on partial application", () => {
            const spy = vi.spyOn(console, "log").mockImplementation(() => { });
            tokidoki("mytag");
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe("parametricity", () => {
        it("works over arbitrary types", () => {
            const arr = [1, 2, 3];
            expect(tokidoki("tag", arr)).toBe(arr);

            const fn = (x: number) => x + 1;
            expect(tokidoki("tag", fn)).toBe(fn);
        });
    });
    describe("functor composition", () => {
        it("does not mutate elements through pipeline", () => {
            const xs = [{ v: 1 }, { v: 2 }];
            const result = xs.map(tokidoki("tag"));
            expect(result[0]).toBe(xs[0]); // same reference, not a copy
        });

        it("can be used as a mapping function via curried form", () => {
            const xs = [1, 2, 3];
            const result = xs.map(tokidoki("tag"));
            expect(result).toEqual([1, 2, 3]);
        });

        it("composes with downstream map — naturality", () => {
            const xs = [1, 2, 3];
            const result = xs
                .map(tokidoki("before"))
                .map(x => x * 2)
                .map(tokidoki("after"));
            expect(result).toEqual([2, 4, 6]);
        });

        it("naturality law — map(f) . map(tokidoki(t)) = map(f . tokidoki(t))", () => {
            const xs = [1, 2, 3];
            const f = (x: number) => x * 2;

            const lhs = xs.map(tokidoki("tag")).map(f);
            const rhs = xs.map(x => f(tokidoki("tag", x)));

            expect(lhs).toEqual(rhs);
        });
    });
});
