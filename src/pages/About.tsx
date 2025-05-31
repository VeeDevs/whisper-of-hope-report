
import { Navbar } from "@/components/Navbar";
import { Shield, User, MessageCircle, Phone, Heart, Building } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">{t('aboutWhisperOfHope')}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6 text-center">
              {t('aboutDescription')}
            </p>
            
            <div className="space-y-12 mt-10">
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <Shield className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">{t('ourMission')}</h2>
                </div>
                <p>
                  {t('ourMissionText')}
                </p>
              </section>
              
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <User className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">{t('howAnonymityWorks')}</h2>
                </div>
                <p>
                  {t('howAnonymityWorksText')}
                </p>
              </section>
              
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <MessageCircle className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">{t('communityGuidelines')}</h2>
                </div>
                <p className="mb-4">
                  {t('communityGuidelinesText')}
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>{t('guidelineRespectful')}</li>
                  <li>{t('guidelineNoIdentifying')}</li>
                  <li>{t('guidelineReportAbuse')}</li>
                  <li>{t('guidelineIntendedPurpose')}</li>
                  <li>{t('guidelineRealPeople')}</li>
                </ul>
              </section>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-12">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800">{t('needImmediateHelp')}</h3>
              </div>
              <p className="text-red-700 mb-6">
                {t('immediateHelpText')}
              </p>
              
              {/* Emergency Numbers */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('emergencyNumbers')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800">{t('nationalEmergency')}</h5>
                    <p className="text-2xl font-bold text-red-600">10111</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800">{t('policeEmergency')}</h5>
                    <p className="text-2xl font-bold text-red-600">10111</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800">{t('medicalEmergency')}</h5>
                    <p className="text-2xl font-bold text-red-600">10177</p>
                  </div>
                </div>
              </div>

              {/* Crisis Support Services */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-red-800 mb-4">{t('crisisSupport')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <h5 className="font-medium text-green-800">{t('suicideCrisisLine')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-green-700 mb-1">0800 567 567</p>
                    <p className="text-sm text-green-600">{t('crisis247')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <h5 className="font-medium text-blue-800">{t('childlineSA')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 mb-1">0800 055 555</p>
                    <p className="text-sm text-blue-600">{t('supportForChildren')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <h5 className="font-medium text-purple-800">{t('gbvCommandCentre')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-purple-700 mb-1">0800 428 428</p>
                    <p className="text-sm text-purple-600">{t('gbvSupport')}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-orange-600" />
                      <h5 className="font-medium text-orange-800">{t('sadagMentalHealth')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-orange-700 mb-1">011 234 4837</p>
                    <p className="text-sm text-orange-600">{t('mentalHealthSupport')}</p>
                  </div>
                  
                  <div className="bg-teal-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-teal-600" />
                      <h5 className="font-medium text-teal-800">{t('safeline')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-teal-700 mb-1">0861 322 322</p>
                    <p className="text-sm text-teal-600">{t('traumaCounseling')}</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-indigo-600" />
                      <h5 className="font-medium text-indigo-800">{t('lifelineNorthern')}</h5>
                    </div>
                    <p className="text-2xl font-bold text-indigo-700 mb-1">053 830 3502</p>
                    <p className="text-sm text-indigo-600">{t('emotionalSupport')}</p>
                  </div>
                </div>
              </div>

              {/* Relevant Foundations */}
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('relevantFoundations')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 border rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-1">{t('famsa')}</h5>
                    <p className="text-sm text-gray-600 mb-2">{t('famsaDescription')}</p>
                    <p className="text-sm font-medium text-gray-700">011 975 7106/7</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-1">{t('tears')}</h5>
                    <p className="text-sm text-gray-600 mb-2">{t('tearsDescription')}</p>
                    <p className="text-sm font-medium text-gray-700">010 590 5920</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-1">{t('mosaic')}</h5>
                    <p className="text-sm text-gray-600 mb-2">{t('mosaicDescription')}</p>
                    <p className="text-sm font-medium text-gray-700">021 761 7585</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-1">{t('rape')}</h5>
                    <p className="text-sm text-gray-600 mb-2">{t('rapeDescription')}</p>
                    <p className="text-sm font-medium text-gray-700">021 447 9762</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          {t('copyright')} {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
