import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { popularSkills } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function FreelancerProfileSetup() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profile, setProfile] = useState({
        university: '',
        major: '',
        graduationYear: '',
        bio: '',
        skills: [],
    });

    const handleSkillToggle = (skill) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const handleComplete = async () => {
        if (profile.skills.length < 3) {
            toast.error('Please select at least 3 skills');
            return;
        }

        setIsSubmitting(true);
        try {
            const setupData = {
                bio: profile.bio,
                skills: profile.skills,
                education: [
                    {
                        institution: profile.university,
                        stream: profile.major,
                        yearCompleted: parseInt(profile.graduationYear)
                    }
                ]
            };

            const { data } = await api.post('/auth/freelancer-setup', setupData);

            if (data.success) {
                toast.success('Freelancer profile setup complete!');
                await refreshUser();
                navigate('/freelancer/dashboard');
            }
        } catch (err) {
            console.error('Setup error:', err);
            toast.error(err.response?.data?.message || 'Failed to complete setup');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8 shadow-2xl border-0">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Complete Your Freelancer Profile</h1>
                    <p className="text-gray-600">Tell us about yourself to get better job matches</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Step {step} of 2</span>
                        <span className="text-sm text-gray-600">{step === 1 ? 'Basic Info' : 'Skills'}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="university">University / College</Label>
                            <Input
                                id="university"
                                placeholder="Stanford University"
                                value={profile.university}
                                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="major">Major / Field of Study</Label>
                                <Input
                                    id="major"
                                    placeholder="Computer Science"
                                    value={profile.major}
                                    onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="graduationYear">Graduation Year</Label>
                                <Input
                                    id="graduationYear"
                                    type="number"
                                    placeholder="2025"
                                    value={profile.graduationYear}
                                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell clients about yourself..."
                                rows={4}
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                required
                            />
                        </div>

                        <Button
                            onClick={() => setStep(2)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            size="lg"
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label>Select Your Skills</Label>
                                <p className="text-sm text-gray-600 mt-1">Choose at least 3 skills</p>
                            </div>

                            {profile.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-indigo-50 rounded-lg">
                                    {profile.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleSkillToggle(skill)}
                                        >
                                            {skill}
                                            <X className="w-3 h-3" />
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {popularSkills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant={profile.skills.includes(skill) ? 'default' : 'outline'}
                                        className={`cursor-pointer ${profile.skills.includes(skill)
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            : 'hover:border-indigo-600'
                                            }`}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {profile.skills.includes(skill) ? '✓ ' : '+ '}
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1">
                                Back
                            </Button>
                            <Button
                                onClick={handleComplete}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    'Complete Setup'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
