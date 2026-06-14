import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Briefcase, GraduationCap, Building2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'freelancer',
      title: 'Student Freelancer',
      description: 'Find freelance work, build your portfolio, and earn while learning',
      icon: <GraduationCap className="w-8 h-8" />,
      features: [
        'Find freelance work',
        'Build your portfolio',
        'Earn while learning'
      ]
    },
    {
      id: 'client',
      title: 'Client',
      description: 'Find top student talent for your projects',
      icon: <Briefcase className="w-8 h-8" />,
      features: [
        'Post jobs and projects',
        'Review proposals',
        'Hire and pay securely'
      ]
    }
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }
    toast.success(`Continuing as ${selectedRole}`);
    navigate(`/${selectedRole}/profile-setup`, { state: { role: selectedRole } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Choose Your Journey
          </h1>
          <p className="text-xl text-gray-600">
            Join TVK as a student freelancer or a client
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`p-6 cursor-pointer transition-all border-2 ${selectedRole === role.id
                ? 'border-indigo-600 shadow-xl scale-105'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'
                }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              {selectedRole === role.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-semibold text-indigo-600">✓ Selected</div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-12"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
