import Header from "./components/Header";
import UploadForm from "./components/UploadForm";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-4 mt-10">
          Konuşma ve Metin Hata Analizi
        </h3>
      <UploadForm />
    </div>
    </>
  );
}
