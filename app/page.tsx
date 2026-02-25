"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [epsilon, setEpsilon] = useState(0.1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAttack = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("epsilon", epsilon.toString());

    setLoading(true);

    try {
      const res = await fetch("http://13.61.10.213:8000/attack", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">FGSM Attack Demo</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mb-4">
        <label className="mr-2">Epsilon:</label>
        <input
          type="number"
          step="0.05"
          value={epsilon}
          onChange={(e) => setEpsilon(parseFloat(e.target.value))}
          className="border p-1"
        />
      </div>

      <button
        onClick={handleAttack}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Running..." : "Run Attack"}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results</h2>

          <p>Clean Prediction: {result.clean_prediction}</p>
          <p>Adversarial Prediction: {result.adversarial_prediction}</p>

          <p>
            Attack Success:{" "}
            <span
              className={
                result.attack_success ? "text-red-600" : "text-green-600"
              }
            >
              {result.attack_success ? "Yes" : "No"}
            </span>
          </p>

          <div className="mt-4">
            <h3 className="font-medium">Adversarial Image:</h3>
            <img
              src={`data:image/png;base64,${result.adversarial_image_base64}`}
              alt="Adversarial"
              className="border mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}