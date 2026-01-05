import React, { useState } from 'react';
import { Upload, Camera, Image as ImageIcon, ArrowLeft, RefreshCcw, Users } from 'lucide-react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { CameraCapture } from './components/CameraCapture';
import { countPeopleInImage } from './services/geminiService';
import { AppState, AnalysisResult, ImageFile } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 and mime type
        const base64 = result.split(',')[1];
        const mimeType = result.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        setImageFile({ data: base64, mimeType });
        setAppState(AppState.PREVIEW);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (base64: string, mimeType: string) => {
    setImageFile({ data: base64, mimeType });
    setAppState(AppState.PREVIEW);
  };

  const runAnalysis = async () => {
    if (!imageFile) return;

    setAppState(AppState.ANALYZING);
    try {
      const data = await countPeopleInImage(imageFile.data, imageFile.mimeType);
      setResult(data);
      setAppState(AppState.RESULT);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setImageFile(null);
    setResult(null);
    setAppState(AppState.IDLE);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col justify-center">
        
        {/* IDLE STATE - Hero & Inputs */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center text-center space-y-10 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Comptage instantané <br className="hidden sm:block" />
                <span className="text-indigo-600">propulsé par l'IA</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Importez une photo ou prenez-en une. Notre intelligence artificielle compte les personnes présentes en quelques secondes avec précision.
              </p>
            </div>

            <div className="w-full max-w-md grid gap-4 sm:grid-cols-2">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Importer une image"
                />
                <div className="h-full bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-50 group-hover:border-indigo-200 group-hover:shadow-md transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="font-semibold text-slate-700">Importer une photo</span>
                </div>
              </div>

              <button
                onClick={() => setAppState(AppState.CAMERA)}
                className="h-full bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer border-2 border-transparent"
              >
                <div className="p-3 bg-white/20 text-white rounded-xl">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="font-semibold text-white">Utiliser la caméra</span>
              </button>
            </div>
          </div>
        )}

        {/* CAMERA STATE */}
        {appState === AppState.CAMERA && (
          <div className="flex-1 flex flex-col animate-fade-in h-[80vh]">
            <CameraCapture 
              onCapture={handleCameraCapture} 
              onCancel={() => setAppState(AppState.IDLE)} 
            />
          </div>
        )}

        {/* PREVIEW STATE */}
        {appState === AppState.PREVIEW && imageFile && (
          <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100">
              <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={`data:${imageFile.mimeType};base64,${imageFile.data}`} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  onClick={resetApp}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Changer d'image
                </Button>
                <Button 
                  variant="primary" 
                  onClick={runAnalysis}
                  className="flex-[2]"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Lancer le comptage
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ANALYZING STATE */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyse en cours...</h2>
            <p className="text-slate-500">Notre IA examine l'image pour détecter les personnes.</p>
          </div>
        )}

        {/* RESULT STATE */}
        {appState === AppState.RESULT && result && imageFile && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in">
             <div className="grid lg:grid-cols-2 gap-8 items-start">
                
                {/* Result Card */}
                <div className="order-2 lg:order-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                  <div className="bg-indigo-600 p-8 text-center text-white">
                    <p className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-xs">Personnes détectées</p>
                    <div className="text-7xl font-extrabold tracking-tighter mb-2">
                      {result.count}
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Analyse</h3>
                      <p className="text-slate-700 leading-relaxed text-lg">
                        {result.description}
                      </p>
                    </div>

                    {result.confidenceLevel && (
                      <div className="flex items-center space-x-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${result.confidenceLevel === 'Élevé' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span>Confiance: <span className="font-medium text-slate-700">{result.confidenceLevel}</span></span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                      <Button variant="primary" onClick={resetApp} className="w-full">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Nouvelle analyse
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Reference */}
                <div className="order-1 lg:order-2 relative rounded-3xl overflow-hidden shadow-lg h-full min-h-[300px]">
                  <img 
                    src={`data:${imageFile.mimeType};base64,${imageFile.data}`} 
                    alt="Analyzed" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                </div>

             </div>
          </div>
        )}

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-xl border-2 border-red-50 animate-fade-in">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="w-8 h-8" />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Oups, une erreur.</h2>
             <p className="text-slate-600 mb-6">{errorMessage || "Une erreur inconnue est survenue lors de l'analyse."}</p>
             <Button variant="primary" onClick={resetApp}>
               Réessayer
             </Button>
          </div>
        )}

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© 2024 Compteur AI. Analyse via Gemini Flash.</p>
      </footer>
    </div>
  );
};

export default App;