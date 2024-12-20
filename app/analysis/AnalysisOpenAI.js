import React, { useState, useEffect } from "react";

export default function AnalysisOpenAI({ data }) {
  const [response, setResponse] = useState(null); // başlangıçta response null olarak set ediyoruz.
 
  useEffect(() => {
      // localStoragede response var mı ?
      const savedData = localStorage.getItem("analysisOpenai");
  
      if (savedData) {
        setResponse(JSON.parse(savedData)); // localStoragedan alınan veriyi state'e set et
      } else {
        setResponse(data);
        localStorage.setItem("analysisOpenai", JSON.stringify(data));
      }
    }, [data]);
  
    if (!response) {
      return <div>Yükleniyor...</div>;
    }
    console.log(response.errors)
  
  return (
    <div>
      <h3 className="text-3xl font-bold text-center mb-6 mt-10 text-gray-800">OpenAI Hata Analizi</h3>

      <div className="mx-auto bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Transkripte:</strong> <span
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: highlightAndRemoveBraces(response.text),
            }}
          />
        </p>

        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Açıklama:</strong> <span className="text-gray-700 whitespace-pre-line block">{response.description}</span>
        </p>

        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Okuma Hızı:</strong> <span className="text-gray-700">{response.reading_speed} WPM (Dakikadaki Kelime Sayısı)</span>
        </p>
      </div>
      <h3 className="text-3xl font-bold text-center mb-6 mt-10 text-gray-800">Hata Tipleri</h3>
      <table className="min-w-full table-auto border-collapse mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b text-left">Ekleme (Addition Errors)</th>
              <th className="px-4 py-2 border-b text-left">Eksik (Omission Errors)</th>
              <th className="px-4 py-2 border-b text-left">Tekrar (Repetition Errors)</th>
              <th className="px-4 py-2 border-b text-left">Tersine Çevirme (Reversal Errors)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b">{response.errors?.addition_errors}</td>
              <td className="px-4 py-2 border-b">{response.errors?.omission_errors}</td>
              <td className="px-4 py-2 border-b">{response.errors?.repetition_errors}</td>
              <td className="px-4 py-2 border-b">{response.errors?.reversal_errors}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}


// Metindeki {} içindeki kelimeleri kırmızı yapmak ve {} işaretlerini silmek için
const highlightAndRemoveBraces = (text) => {
  const regex = /{([^}]+)}/g; // {ve} arasındaki metinleri yakalamak için regex
  return text.replace(regex, (match, p1) => {
    // p1: {} içindeki kelime kırmızı renkte span ekler.
    return `<span class="text-red-600">${p1}</span>`;
  });
};
