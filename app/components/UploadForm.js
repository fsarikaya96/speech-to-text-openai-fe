"use client";
import { useState, useEffect } from "react";
import axios from 'axios';
import { MoonLoader  } from "react-spinners";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { useAnalysis } from "../context/AnalysisProvider";

export default function UploadForm() {
  const [audioFile, setAudioFile] = useState(null);
  const [textFile, setTextFile] = useState(null);
  const [audioError, setAudioError] = useState("");
  const [textError, setTextError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateAnalysisData } = useAnalysis();
  const router = useRouter();

  // Herhangi bir dosya değişiminde form validasyonunu kontrol et
  useEffect(() => {
    validateForm();
  }, [audioFile, textFile]);

  // audio/video validation
  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("audio/") || file.type === "video/mp4") {
        setAudioFile(file);
        setAudioError("");
      } else {
        setAudioError("Lütfen bir ses veya mp4 dosyası yükleyin.");
        setAudioFile(null);
      }
    }
  };

  // txt validation
  const handleTextChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        setTextFile(file);
        setTextError("");
      } else {
        setTextError("Lütfen bir metin dosyası yükleyin.");
        setTextFile(null);
      }
    }
  };

  const validateForm = () => {
    // Eğer her iki dosya doğru şekilde yüklüyse ve hata mesajı yoksa form geçerli
    if (audioFile && textFile && !audioError && !textError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  // post request
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        title: 'Hata!',
        text: 'Lütfen tüm alanları doğru şekilde doldurun.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      })
      return;
    }
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    formData.append("textFile", textFile);

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  
        },          
      });
      
      // İstek başarısız ise return et
      if (response.data.status === "failure") {
        Swal.fire({
          title: 'Hata!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Tamam'
        })
        return;
      }
      // Her istekte localde ki datayı temizle
      localStorage.removeItem("speechToText");
      localStorage.removeItem("analysisOpenai");
      // Context apiye set et.
      updateAnalysisData(response.data.message);
      router.push('/analysis');
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Tamam'
      })
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div
      className={`relative bg-white p-5 rounded-lg shadow-lg border border-gray-200 ${
        isLoading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-lg mb-1 text-gray-800">
          Ses Dosyası Yükle (mp3/wav/mp4):
        </label>
        <input
          type="file"
          accept="audio/*,video/mp4"
          onChange={handleAudioChange}
          className="w-full p-2.5 rounded-md border border-gray-300 text-lg mt-1 box-border"
        />
        {audioError && <span className="text-red-600">{audioError}</span>}
      </div>
      <div className="mt-5">
        <label className="block text-lg mb-1 text-gray-800">
          Metin Dosyası Yükle (.txt):
        </label>
        <input
          type="file"
          accept=".txt"
          onChange={handleTextChange}
          className="w-full p-2.5 rounded-md border border-gray-300 text-lg mt-1 box-border"
        />
        {textError && <span className="text-red-600">{textError}</span>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 text-lg rounded-md transition-colors ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#693232] text-white hover:bg-[#580c0c]"
        } mt-5`}
      >
        {isLoading ? "Yükleniyor..." : "Gönder"}
      </button>
    </form>

    {isLoading && (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10">
        <MoonLoader color="#de3232" />
      </div>
    )}
  </div>

  );  
}
