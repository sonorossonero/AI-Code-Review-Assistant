// src/App.jsx
import React from "react";
import Layout from "./components/layout/Layout";
import CodeInput from "./components/code-editor/CodeInput"; // Import CodeInput

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Code Review Assistant
          </h1>
          <p className="text-muted-foreground">
            Submit your code for AI-powered review and receive detailed
            feedback.
          </p>
        </div>
        <CodeInput />
      </div>
    </Layout>
  );
}

export default App;
