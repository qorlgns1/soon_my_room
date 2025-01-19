'use client';

import React, { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p>
    </div>
  );
}
