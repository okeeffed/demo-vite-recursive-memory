import { useState, useCallback } from "react";
import "./App.css";

type Result =
  | null
  | {
      count: number;
      time: number;
    }
  | {
      error: string;
    };

// Dummy async function that resolves immediately
const dummyAsyncOperation = () => Promise.resolve();

// Hook using recursive approach
const useRecursiveApproach = () => {
  const [recursiveResult, setRecursiveResult] = useState<Result>(null);

  const runRecursive = useCallback(async () => {
    const startTime = performance.now();
    let count = 0;

    const recursive = async (n: number) => {
      if (n === 0) return;
      await dummyAsyncOperation();
      count++;
      await recursive(n - 1);
    };

    try {
      await recursive(100000);
      const endTime = performance.now();
      setRecursiveResult({
        count,
        time: endTime - startTime,
      });
    } catch (error) {
      if (error instanceof Error) {
        setRecursiveResult({ error: error.message });
      }
    }
  }, []);

  return { recursiveResult, runRecursive };
};

// Hook using async iterator approach
const useAsyncIteratorApproach = () => {
  const [iteratorResult, setIteratorResult] = useState<Result>(null);

  const runIterator = useCallback(async () => {
    const startTime = performance.now();
    let count = 0;

    const asyncGenerator = async function* () {
      for (let i = 0; i < 100000; i++) {
        await dummyAsyncOperation();
        yield i;
      }
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of asyncGenerator()) {
        count++;
      }
      const endTime = performance.now();
      setIteratorResult({
        count,
        time: endTime - startTime,
      });
    } catch (error) {
      if (error instanceof Error) {
        setIteratorResult({ error: error.message });
      }
    }
  }, []);

  return { iteratorResult, runIterator };
};

function App() {
  const { recursiveResult, runRecursive } = useRecursiveApproach();
  const { iteratorResult, runIterator } = useAsyncIteratorApproach();

  return (
    <>
      <div>
        <button onClick={runRecursive}>Recusively calls 100k</button>
        <button onClick={runIterator}>Async iterators call 100k</button>
      </div>
      <div>
        <h2>Recursive approach</h2>
        {recursiveResult && "count" in recursiveResult ? (
          <p>
            Count: {recursiveResult.count}, Time: {recursiveResult.time}ms
          </p>
        ) : recursiveResult && "error" in recursiveResult ? (
          <p>Error: {recursiveResult.error}</p>
        ) : null}
      </div>
      <div>
        <h2>Async iterator approach</h2>
        {iteratorResult && "count" in iteratorResult ? (
          <p>
            Count: {iteratorResult.count}, Time: {iteratorResult.time}ms
          </p>
        ) : iteratorResult && "error" in iteratorResult ? (
          <p>Error: {iteratorResult.error}</p>
        ) : null}
      </div>
    </>
  );
}

export default App;
