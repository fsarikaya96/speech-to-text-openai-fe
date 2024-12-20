"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SpeechToText from "./SpeechToText";
import AnalysisOpenAI from "./AnalysisOpenAI";
import { useAnalysis } from "../context/AnalysisProvider";


export default function Analysis() {
  const { analysisData } = useAnalysis();
  return (
    <div>
      <Header />
       <div className="container mx-auto px-4">
        <SpeechToText data={analysisData?.speech_to_text} />
        <AnalysisOpenAI data={analysisData?.analysis_from_openai} />
       </div>
      <Footer />
    </div>
  );
}
