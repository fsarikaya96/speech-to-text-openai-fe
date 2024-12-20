import React, { useState, useEffect } from "react";

export default function SpeechToText({ data }) {
  const [response, setResponse] = useState(null); // başlangıçta response null olarak set ediyoruz.
  const [currentPage, setCurrentPage] = useState(1); // Sayfa numarasını default 1 olarak set ediyoruz.
  const perPage = 10; // Sayfa başına gösterilecek data sayısı

  useEffect(() => {
    // localStoragede response var mı ?
    const savedData = localStorage.getItem("speechToText");

    if (savedData) {
      setResponse(JSON.parse(savedData)); // localStoragedan alınan veriyi state'e set et
    } else {
      setResponse(data);
      localStorage.setItem("speechToText", JSON.stringify(data));
    }
  }, [data]);

  if (!response) {
    return <div>Yükleniyor...</div>;
  }

   // Sayfa numarasına göre kelimeleri ayarlama
   const indexOfLast = currentPage * perPage;
   const indexOfFirst = indexOfLast - perPage;
   const currentWords = response ? response.words.slice(indexOfFirst, indexOfLast) : [];
 
   // Sayfa sayısını hesapla
   const totalPages = response ? Math.ceil(response.words.length / perPage) : 0;
 
   // Sayfa değişim fonksiyonu
   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber); // Yeni sayfa numarasını state'e kaydet
   };
 

  return (
    <div>
      <h3 className="text-3xl font-bold text-center mb-6 mt-10 text-gray-800">Konuşma Hata Analizi</h3>

      <div className="mx-auto bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Güven:</strong> <span className="text-gray-700">{response.confidence}</span>
        </p>

        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Süre:</strong> <span className="text-gray-700">{response.duration} saniye</span>
        </p>

        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Okuma Hızı:</strong> <span className="text-gray-700">{response.reading_speed} WPM (Dakikadaki Kelime Sayısı)</span>
        </p>

        <p className="mb-6 text-lg">
          <strong className="text-xl text-blue-600">Dönüştürülmüş Metin:</strong> <span className="text-gray-700">{response.transcript}</span>
        </p>
      </div>

      <table className="min-w-full table-auto border-collapse mt-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b text-left">Kelime</th>
            <th className="px-4 py-2 border-b text-left">Başlangıç Saniye</th>
            <th className="px-4 py-2 border-b text-left">Bitiş Saniye</th>
            <th className="px-4 py-2 border-b text-left">Güven</th>
          </tr>
        </thead>
        <tbody>
          {currentWords.map((wordItem, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2 border-b">{wordItem.word}</td>
              <td className="px-4 py-2 border-b">{wordItem.start}</td>
              <td className="px-4 py-2 border-b">{wordItem.end}</td>
              <td className="px-4 py-2 border-b">{wordItem.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    {/* Sayfa numaralandırma ve butonlar */}
    <div className="flex justify-center mt-6">
        {/* Önceki sayfa */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 text-white bg-blue-600 rounded disabled:opacity-50"
        >
          Önceki
        </button>

        {/* Sayfa sayısı */}
        {[...Array(totalPages)].map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => handlePageChange(pageIndex + 1)}
            className={`px-4 py-2 mx-1 text-white bg-blue-600 rounded ${currentPage === pageIndex + 1 ? 'bg-blue-800' : ''}`}
          >
            {pageIndex + 1}
          </button>
        ))}

        {/* Sonraki sayfa */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 text-white bg-blue-600 rounded disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
