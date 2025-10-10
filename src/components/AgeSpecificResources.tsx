
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield, Heart, BookOpen, Phone } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { AgeSpecificResource } from "@/types";

const RESOURCES: AgeSpecificResource[] = [
  // Children (5-12)
  {
    id: "1",
    title: "Childline South Africa",
    description: "Free counseling for children experiencing bullying",
    url: "tel:0800055555",
    ageRange: { min: 5, max: 17 },
    category: "emergency",
    language: "en"
  },
  {
    id: "2", 
    title: "Kids' Guide to Bullying",
    description: "Simple explanations and coping strategies for young children",
    url: "#",
    ageRange: { min: 5, max: 12 },
    category: "educational",
    language: "en"
  },
  // Teenagers (13-17)
  {
    id: "3",
    title: "Teen Mental Health Resources",
    description: "SADAG resources specifically for teenagers",
    url: "tel:0112344837",
    ageRange: { min: 13, max: 17 },
    category: "mental-health",
    language: "en"
  },
  {
    id: "4",
    title: "Your Rights at School",
    description: "Understanding anti-bullying policies in SA schools",
    url: "#",
    ageRange: { min: 13, max: 17 },
    category: "legal",
    language: "en"
  },
  // Young Adults (18-25)
  {
    id: "5",
    title: "Workplace Bullying Laws",
    description: "Know your rights in the workplace",
    url: "#",
    ageRange: { min: 18, max: 25 },
    category: "legal",
    language: "en"
  },
  {
    id: "6",
    title: "University Support Services",
    description: "Campus resources for dealing with bullying",
    url: "#",
    ageRange: { min: 18, max: 25 },
    category: "educational",
    language: "en"
  }
];

export function AgeSpecificResources() {
  const { currentUser } = useApp();
  
  const userAge = currentUser?.age || 18;
  const relevantResources = RESOURCES.filter(
    resource => userAge >= resource.ageRange.min && userAge <= resource.ageRange.max
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return <Phone className="h-4 w-4" />;
      case 'legal': return <Shield className="h-4 w-4" />;
      case 'mental-health': return <Heart className="h-4 w-4" />;
      case 'educational': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'legal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'mental-health': return 'text-green-600 bg-green-50 border-green-200';
      case 'educational': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources for You</CardTitle>
        <p className="text-sm text-muted-foreground">
          Age-appropriate resources and support (Age: {userAge})
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relevantResources.map((resource) => (
            <div 
              key={resource.id} 
              className={`p-3 rounded-lg border ${getCategoryColor(resource.category)}`}
            >
              <div className="flex items-start gap-3">
                {getCategoryIcon(resource.category)}
                <div className="flex-1">
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{resource.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 p-0 h-auto"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    Access Resource <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
