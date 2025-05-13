
import { Navbar } from "@/components/Navbar";
import { Shield, User, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">About Whisper of Hope</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6 text-center">
              A safe, anonymous platform created to help people report bullying incidents and support each other.
            </p>
            
            <div className="space-y-12 mt-10">
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <Shield className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                </div>
                <p>
                  Whisper of Hope was created with a simple yet powerful mission: to provide a safe space 
                  where anyone experiencing bullying or witnessing it can share their stories anonymously.
                  We believe that by breaking the silence around bullying, we can help create safer
                  communities and support those who need it most.
                </p>
              </section>
              
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <User className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">How Anonymity Works</h2>
                </div>
                <p>
                  When you register on Whisper of Hope, you're assigned a unique anonymous ID that will be
                  used instead of your real name when you post reports or comments. Your personal information
                  is never shared with other users, ensuring your privacy and safety. This anonymity allows
                  people to speak freely about sensitive situations without fear of retaliation.
                </p>
              </section>
              
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-whisper-100 rounded-full">
                    <MessageCircle className="h-6 w-6 text-whisper-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">Community Guidelines</h2>
                </div>
                <p className="mb-4">
                  While anonymity provides freedom, it also comes with responsibility. We expect all members
                  of our community to adhere to these basic guidelines:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Be respectful and supportive in your comments</li>
                  <li>Do not share identifying information about yourself or others</li>
                  <li>Report abuse or harmful content</li>
                  <li>Use the platform for its intended purpose of support and awareness</li>
                  <li>Remember that real people are behind every report</li>
                </ul>
              </section>
            </div>
            
            <div className="bg-whisper-50 p-6 rounded-lg mt-12">
              <h3 className="text-xl font-semibold mb-4 text-center">Need Immediate Help?</h3>
              <p className="text-center mb-4">
                If you or someone you know is in immediate danger, please contact local emergency services.
              </p>
              <div className="text-center">
                <strong>National Bullying Hotline:</strong> 1-800-123-4567<br />
                <strong>Crisis Text Line:</strong> Text HOME to 741741
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          Whisper of Hope © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
